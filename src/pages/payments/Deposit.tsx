import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotification } from "@/hooks/useNotification";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { mockdb } from "@/lib/mock-db";

const schema = z.object({
  to: z.string().min(1, "Required"),
  amount: z.coerce.number().positive("Must be > 0"),
  note: z.string().optional(),
});

export default function Deposit() {
  const { notifyTransaction, notify } = useNotification();
  const accounts = mockdb.getAccounts();
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { to: accounts[0]?.id } });

  const onSubmit = (values: z.infer<typeof schema>) => {
    try {
      mockdb.deposit(values.to, values.amount, values.note);
      notifyTransaction(values.amount, 'deposit');
      form.reset({ to: values.to });
    } catch (e: any) {
      notify({ title: "Deposit Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <MobileShell>
      <Seo title="Mobile Deposit — GreenBank" description="Deposit checks from your phone." canonical={window.location.href} />
      <section className="p-4 animate-fade-in">
        <h1 className="text-xl font-semibold mb-3">Mobile Deposit</h1>
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="to" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>To account</FormLabel>
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

                <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                  Upload check images is simulated in this demo.
                </div>

                <Button type="submit" className="w-full">Deposit</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </MobileShell>
  );
}
