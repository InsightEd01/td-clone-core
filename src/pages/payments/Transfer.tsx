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
  from: z.string().min(1, "Required"),
  to: z.string().min(1, "Required"),
  amount: z.coerce.number().positive("Must be > 0"),
  note: z.string().optional(),
});

export default function Transfer() {
  const { notifyTransaction, notify } = useNotification();
  const accounts = mockdb.getAccounts();
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { from: accounts[0]?.id, to: accounts[1]?.id } });

  const onSubmit = (values: z.infer<typeof schema>) => {
    try {
      mockdb.transfer(values.from, values.to, values.amount, values.note);
      notifyTransaction(values.amount, 'sent', `${accounts.find(a => a.id === values.to)?.name || 'account'}`);
      form.reset({ from: values.from, to: values.to });
    } catch (e: any) {
      notify({ title: "Transfer Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <MobileShell>
      <Seo title="Transfer — GreenBank" description="Transfer between your accounts." canonical={window.location.href} />
      <section className="p-4 animate-fade-in">
        <h1 className="text-xl font-semibold mb-3">Transfer</h1>
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField name="from" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
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

                  <FormField name="to" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
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

                <FormField name="note" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                  </FormItem>
                )} />

                <Button type="submit" className="w-full">Transfer</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </MobileShell>
  );
}
