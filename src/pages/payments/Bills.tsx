import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { mockdb } from "@/lib/mock-db";

const schema = z.object({
  from: z.string().min(1, "Required"),
  payeeId: z.string().min(1, "Required"),
  amount: z.coerce.number().positive("Must be > 0"),
  note: z.string().optional(),
});

export default function Bills() {
  const accounts = mockdb.getAccounts();
  const payees = mockdb.getPayees();
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { from: accounts[0]?.id, payeeId: payees[0]?.id } });

  const onSubmit = (values: z.infer<typeof schema>) => {
    try {
      mockdb.payBill(values.from, values.payeeId, values.amount, values.note);
      toast({ title: "Bill paid", description: `${values.amount.toFixed(2)} sent` });
      form.reset({ from: values.from, payeeId: values.payeeId });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <MobileShell>
      <Seo title="Pay Bills — GreenBank" description="Manage and pay your bills." canonical={window.location.href} />
      <section className="p-4 animate-fade-in">
        <h1 className="text-xl font-semibold mb-3">Pay Bills</h1>
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

                <FormField name="payeeId" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payee</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {payees.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="amount" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="note" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                  </FormItem>
                )} />

                <Button type="submit" className="w-full">Pay Bill</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </MobileShell>
  );
}
