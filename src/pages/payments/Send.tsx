import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNotification } from "@/hooks/useNotification";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { mockdb, type Transaction } from "@/lib/mock-db";
import { 
  ArrowLeft, 
  Check, 
  User, 
  DollarSign, 
  MessageSquare, 
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
  Printer,
  Download,
  Share,
  Copy
} from "lucide-react";
import { NavLink } from "react-router-dom";

const schema = z.object({
  from: z.string().min(1, "Please select an account"),
  contact: z.string()
    .min(3, "Enter email or phone")
    .refine((val) => {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Phone validation (various formats)
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^\([0-9]{3}\)\s?[0-9]{3}-[0-9]{4}$|^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
      return emailRegex.test(val) || phoneRegex.test(val.replace(/[\s\-\(\)]/g, ''));
    }, "Please enter a valid email or phone number"),
  name: z.string().optional(),
  amount: z.coerce.number()
    .positive("Amount must be greater than 0")
    .max(10000, "Maximum transfer amount is $10,000")
    .refine((val) => val >= 0.01, "Minimum transfer amount is $0.01"),
  message: z.string().max(140, "Message must be 140 characters or less").optional(),
});

type SendStep = "recipient" | "amount" | "review" | "processing" | "success";

export default function Send() {
  const { notifyTransaction, notify } = useNotification();
  const [currentStep, setCurrentStep] = useState<SendStep>("recipient");
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const accounts = mockdb.getAccounts();
  const recipients = mockdb.getRecipients();
  const form = useForm<z.infer<typeof schema>>({ 
    resolver: zodResolver(schema), 
    defaultValues: { from: accounts[0]?.id } 
  });

  const watchedValues = form.watch();
  const selectedAccount = accounts.find(a => a.id === watchedValues.from);

  const getStepProgress = () => {
    switch (currentStep) {
      case "recipient": return 25;
      case "amount": return 50;
      case "review": return 75;
      case "processing": return 90;
      case "success": return 100;
      default: return 0;
    }
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (currentStep === "review") {
      setCurrentStep("processing");
      setIsProcessing(true);
      
      // Simulate processing time
      setTimeout(() => {
        try {
          const tx = mockdb.sendMoney(
            values.from, 
            { name: values.name || values.contact, contact: values.contact }, 
            values.amount, 
            values.message
          );
          setTransaction(tx);
          setCurrentStep("success");
          setIsProcessing(false);
          notifyTransaction(values.amount, 'sent', values.name || values.contact);
        } catch (e: any) {
          notify({ title: "Send Error", description: e.message, variant: "destructive" });
          setCurrentStep("review");
          setIsProcessing(false);
        }
      }, 2000);
    }
  };

  const handleNext = () => {
    const values = form.getValues();
    
    if (currentStep === "recipient") {
      if (!values.contact) {
        form.setError("contact", { message: "Please enter recipient contact" });
        return;
      }
      setCurrentStep("amount");
    } else if (currentStep === "amount") {
      if (!values.amount || values.amount <= 0) {
        form.setError("amount", { message: "Please enter a valid amount" });
        return;
      }
      if (selectedAccount && values.amount > selectedAccount.balance) {
        form.setError("amount", { message: "Insufficient funds" });
        return;
      }
      setCurrentStep("review");
    }
  };

  const handleBack = () => {
    if (currentStep === "amount") {
      setCurrentStep("recipient");
    } else if (currentStep === "review") {
      setCurrentStep("amount");
    }
  };

  const handleStartOver = () => {
    setCurrentStep("recipient");
    setTransaction(null);
    form.reset({ from: accounts[0]?.id });
  };

  const printReceipt = () => {
    setShowReceipt(true);
  };

  const generateReceiptContent = () => {
    if (!transaction || !selectedAccount) return "";
    
    const date = new Date(transaction.createdAt);
    const values = form.getValues();
    
    // Format for 80mm thermal printer (32 characters wide)
    const line = (char: string = "=") => char.repeat(32);
    const center = (text: string) => {
      const padding = Math.max(0, (32 - text.length) / 2);
      return " ".repeat(Math.floor(padding)) + text;
    };
    const leftRight = (left: string, right: string) => {
      const spaces = Math.max(1, 32 - left.length - right.length);
      return left + " ".repeat(spaces) + right;
    };
    
    return `${line()}
${center("GCB")}
${center("Transaction Receipt")}
${line()}

${leftRight("Date:", date.toLocaleDateString())}
${leftRight("Time:", date.toLocaleTimeString())}
${leftRight("Ref:", transaction.id.slice(0, 8).toUpperCase())}

${line("-")}
TRANSACTION DETAILS
${line("-")}
Type: Send Money

From Account:
${selectedAccount.name}
****${selectedAccount.id.slice(-4).toUpperCase()}

To Recipient:
${values.name || values.contact}
${values.contact}

${leftRight("Amount:", "$" + Math.abs(transaction.amount).toFixed(2))}
${leftRight("Fee:", "FREE")}
${leftRight("Total:", "$" + Math.abs(transaction.amount).toFixed(2))}
${values.message ? `\nMemo: ${values.message}` : ''}

${line("-")}
ACCOUNT SUMMARY
${line("-")}
${leftRight("Previous:", "$" + (selectedAccount.balance + Math.abs(transaction.amount)).toFixed(2))}
${leftRight("Transfer:", "-$" + Math.abs(transaction.amount).toFixed(2))}
${leftRight("Current:", "$" + selectedAccount.balance.toFixed(2))}

${line("-")}
SECURITY & COMPLIANCE
${line("-")}
✓ 256-bit SSL Encryption
✓ Real-time Fraud Detection
✓ FDIC Insured Institution
✓ PCI DSS Compliant

${line("-")}
CUSTOMER SERVICE
${line("-")}
Phone: 1-800-GCB
Web: www.gcb.com
Mobile: GCB App

Available 24/7 for support

${center("Thank you for choosing")}
${center("GCB!")}

${center("Keep this receipt for")}
${center("your records")}
${line()}`.trim();
  };

  return (
    <MobileShell>
      <Seo title="Send Money — GCB" description="Send money securely to contacts." canonical={window.location.href} />
      
      {/* Header */}
      <section className="relative px-4 pt-6 pb-4 bg-gradient-to-b from-emerald-700 to-emerald-900 text-primary-foreground">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <NavLink to="/payments">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </NavLink>
            <div>
              <h1 className="text-xl font-semibold">Send Money</h1>
              <p className="text-sm text-emerald-100">
                {currentStep === "recipient" && "Choose recipient"}
                {currentStep === "amount" && "Enter amount"}
                {currentStep === "review" && "Review details"}
                {currentStep === "processing" && "Processing..."}
                {currentStep === "success" && "Transfer complete"}
              </p>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-2">
          <Progress value={getStepProgress()} className="h-2 bg-white/20" />
        </div>
        <p className="text-xs text-emerald-100">Step {currentStep === "recipient" ? "1" : currentStep === "amount" ? "2" : currentStep === "review" ? "3" : "4"} of 4</p>
      </section>

      <section className="px-4 py-4 space-y-4 -mt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Account Selection - Always Visible */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  From Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField name="from" control={form.control} render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            <div className="flex items-center justify-between w-full">
                              <div>
                                <div className="font-medium">{a.name}</div>
                                <div className="text-sm text-muted-foreground">****{a.id.slice(-4)}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">${a.balance.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">Available</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            {/* Step 1: Recipient Selection */}
            {currentStep === "recipient" && (
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-600" />
                    Send To
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <FormField name="contact" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email or Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="name@example.com or +1 (555) 123-4567" 
                            className="h-12"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="name" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Name (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter recipient's name" 
                            className="h-12"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>

                  {recipients.length > 0 && (
                    <div className="mt-6">
                      <Label className="mb-3 block text-sm font-medium">Recent Recipients</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {recipients.map(r => (
                          <button 
                            key={r.id} 
                            type="button"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors text-left" 
                            onClick={() => {
                              form.setValue("contact", r.contact);
                              form.setValue("name", r.name);
                            }}
                          >
                            <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                              <User className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">{r.name}</div>
                              <div className="text-xs text-muted-foreground">{r.contact}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    type="button" 
                    onClick={handleNext} 
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Amount Entry */}
            {currentStep === "amount" && (
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    Amount
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField name="amount" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>How much would you like to send?</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-muted-foreground">$</span>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0.01"
                            max="10000"
                            placeholder="0.00" 
                            className="h-16 text-2xl font-semibold pl-8 text-center"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      {selectedAccount && (
                        <p className="text-sm text-muted-foreground">
                          Available balance: ${selectedAccount.balance.toLocaleString()}
                        </p>
                      )}
                    </FormItem>
                  )} />

                  {/* Quick Amount Buttons */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Quick amounts</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[25, 50, 100, 200].map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => form.setValue("amount", amount)}
                          className="h-10 text-sm"
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <FormField name="message" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Message (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add a note for the recipient..." 
                          className="min-h-[80px]"
                          maxLength={140}
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/140 characters
                      </p>
                    </FormItem>
                  )} />

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleBack}
                      className="flex-1 h-12"
                    >
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleNext} 
                      className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review */}
            {currentStep === "review" && (
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-600" />
                    Review Transfer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-sm text-muted-foreground">From</span>
                      <div className="text-right">
                        <div className="font-medium">{selectedAccount?.name}</div>
                        <div className="text-sm text-muted-foreground">****{selectedAccount?.id.slice(-4)}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-sm text-muted-foreground">To</span>
                      <div className="text-right">
                        <div className="font-medium">{watchedValues.name || watchedValues.contact}</div>
                        <div className="text-sm text-muted-foreground">{watchedValues.contact}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">
                          ${watchedValues.amount?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    {watchedValues.message && (
                      <div className="flex justify-between items-start py-3 border-b">
                        <span className="text-sm text-muted-foreground">Message</span>
                        <div className="text-right max-w-48">
                          <div className="text-sm">{watchedValues.message}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm text-muted-foreground">Transfer Fee</span>
                      <div className="text-right">
                        <div className="font-medium text-green-600">FREE</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-emerald-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-emerald-800">Secure Transfer</h4>
                        <p className="text-sm text-emerald-700 mt-1">
                          This transfer is protected by bank-level encryption and fraud monitoring.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleBack}
                      className="flex-1 h-12"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                    >
                      Send Money
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Processing */}
            {currentStep === "processing" && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">Processing Transfer</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please wait while we securely process your transfer...
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    This usually takes a few seconds
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Success */}
            {currentStep === "success" && transaction && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Transfer Successful!</h3>
                  <p className="text-muted-foreground mb-6">
                    ${Math.abs(transaction.amount).toFixed(2)} has been sent to {watchedValues.name || watchedValues.contact}
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Transaction ID</span>
                      <span className="font-mono">{transaction.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date & Time</span>
                      <span>{new Date(transaction.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={printReceipt}
                      className="flex flex-col items-center gap-1 h-auto py-3"
                    >
                      <Printer className="h-4 w-4" />
                      <span className="text-xs">Print</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        navigator.clipboard.writeText(transaction.id);
                        notify({ title: "Copied!", description: "Transaction ID copied to clipboard" });
                      }}
                      className="flex flex-col items-center gap-1 h-auto py-3"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="text-xs">Copy ID</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'GCB Transfer Receipt',
                            text: `Transfer of $${Math.abs(transaction.amount).toFixed(2)} completed. Transaction ID: ${transaction.id.slice(0, 8).toUpperCase()}`
                          });
                        }
                      }}
                      className="flex flex-col items-center gap-1 h-auto py-3"
                    >
                      <Share className="h-4 w-4" />
                      <span className="text-xs">Share</span>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={handleStartOver}
                      className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                    >
                      Send Another Transfer
                    </Button>
                    <NavLink to="/payments" className="block">
                      <Button variant="outline" className="w-full h-12">
                        Back to Payments
                      </Button>
                    </NavLink>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </section>

      {/* 80mm Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>80mm Transaction Receipt</DialogTitle>
          </DialogHeader>
          <div className="receipt-preview">
            <div className="receipt-content">
              <pre className="whitespace-pre-wrap">{generateReceiptContent()}</pre>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                const content = generateReceiptContent();
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `gcb-receipt-${transaction?.id.slice(0, 8)}.txt`;
                a.click();
                URL.revokeObjectURL(url);
                notify({ title: "Downloaded!", description: "Receipt saved to your device" });
              }}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              onClick={() => {
                // Create a new window for printing with proper 80mm formatting
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <title>GCB Receipt</title>
                      <style>
                        @page { 
                          size: 80mm auto; 
                          margin: 0; 
                        }
                        body { 
                          font-family: 'Courier New', monospace; 
                          font-size: 10px; 
                          line-height: 1.2; 
                          margin: 0; 
                          padding: 5mm;
                          width: 70mm;
                        }
                        pre { 
                          white-space: pre-wrap; 
                          word-wrap: break-word; 
                          margin: 0; 
                        }
                      </style>
                    </head>
                    <body>
                      <pre>${generateReceiptContent()}</pre>
                    </body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.print();
                  printWindow.close();
                }
                notify({ title: "Printing...", description: "Receipt sent to printer" });
              }}
              className="flex-1"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print 80mm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MobileShell>
  );
}
