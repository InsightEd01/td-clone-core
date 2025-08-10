import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { mockdb } from "@/lib/mock-db";

const schema = z.object({
  from: z.string().min(1, "Required"),
  contact: z.string().min(3, "Enter email or phone"),
  name: z.string().optional(),
  amount: z.coerce.number().positive("Must be > 0"),
  message: z.string().optional(),
});

export default function Send() {
  const accounts = mockdb.getAccounts();
  const recipients = mockdb.getRecipients();
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { from: accounts[0]?.id } });

  const onSubmit = (values: z.infer<typeof schema>) => {
    try {
      mockdb.sendMoney(values.from, { name: values.name || values.contact, contact: values.contact }, values.amount, values.message);
      toast({ title: "Money sent", description: `${values.amount.toFixed(2)} from ${values.from}` });
      form.reset({ from: values.from });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <MobileShell>
      <Seo title="Send Money — GreenBank" description="Send money securely to contacts." canonical={window.location.href} />
      <section className="p-4 animate-fade-in">
        <h1 className="text-xl font-semibold mb-3">Send Money</h1>
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="from" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>From account</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map((a) => (
                          <SelectItem key={a.id} value={a.id}>{a.name} — ${a.balance.toLocaleString()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-2 gap-3">
                  <FormField name="contact" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>To (email or phone)</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient name</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

                <FormField name="amount" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="message" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                  </FormItem>
                )} />

                <Button type="submit" className="w-full">Send</Button>
              </form>
            </Form>

            <div className="mt-6">
              <Label className="mb-2 block">Recent recipients</Label>
              <div className="grid grid-cols-2 gap-2">
                {recipients.map(r => (
                  <button key={r.id} className="rounded-lg border px-3 py-2 text-left hover:bg-accent/50" onClick={() => {
                    form.setValue("contact", r.contact);
                    form.setValue("name", r.name);
                  }}>
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.contact}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </MobileShell>
  );
}
