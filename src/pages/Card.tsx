import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Banknote, ShoppingBag, Utensils } from "lucide-react";

const tx = [
  { id: 1, name: "Uber Eats", time: "1h ago", amount: -5, icon: Utensils },
  { id: 2, name: "Amazon", time: "5h ago", amount: -10, icon: ShoppingBag },
  { id: 3, name: "Payroll", time: "Yesterday", amount: 980, icon: Banknote },
];

const data = [
  { name: "Groceries", value: 320, color: "hsl(var(--primary))" },
  { name: "Transport", value: 210, color: "hsl(var(--accent-foreground))" },
  { name: "Dining", value: 180, color: "hsl(var(--muted-foreground))" },
  { name: "Other", value: 90, color: "hsl(var(--secondary-foreground))" },
];

export default function CardPage() {
  return (
    <MobileShell>
      <Seo title="Debit Card — GreenBank" description="View card details, history and analytics." canonical={window.location.href} />
      <section className="px-4 pt-6 pb-4 bg-hero text-primary-foreground rounded-b-3xl">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-semibold">Debit Card</h1>
          <p className="text-sm opacity-80 mt-1">1111 •••• •••• 1111 • Expires 05/27</p>
          <Card className="mt-4 bg-background/10 backdrop-blur border-white/10">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-80">Current Balance</p>
                  <p className="text-3xl font-bold">$3,225.00</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80">Apple Pay</p>
                  <p className="text-xs opacity-80">Enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="p-4">
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="history" className="mt-4">
            <div className="divide-y rounded-lg border">
              {tx.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center">
                        <Icon className="h-4 w-4 text-foreground" aria-hidden />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.time}</p>
                      </div>
                    </div>
                    <p className={t.amount >= 0 ? "text-primary" : "text-foreground"}>
                      {t.amount >= 0 ? "+$" : "-$"}
                      {Math.abs(t.amount).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={90}
                        stroke="hsl(var(--border))"
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  {data.map((d) => (
                    <li key={d.name} className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: d.color }} />
                      <span>{d.name}</span>
                      <span className="ml-auto font-medium">${d.value}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </MobileShell>
  );
}
