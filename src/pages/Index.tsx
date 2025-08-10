import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Send, Repeat, Receipt, Camera, Wallet, ShoppingBag, Utensils, Banknote } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import { NavLink } from "react-router-dom";
import Seo from "@/components/Seo";

const actions = [
  { label: "Send", icon: Send },
  { label: "Transfer", icon: Repeat },
  { label: "Bills", icon: Receipt },
  { label: "Deposit", icon: Camera },
];

const accounts = [
  { id: "chq", name: "Unlimited Chequing", balance: 1490.12 },
  { id: "svg", name: "Every Day Savings", balance: 167.82 },
];

const transactions = [
  { id: 1, name: "Uber Eats", time: "1h ago", amount: -5, icon: Utensils },
  { id: 2, name: "Amazon", time: "5h ago", amount: -10, icon: ShoppingBag },
  { id: 3, name: "Payroll", time: "Yesterday", amount: 980, icon: Banknote },
];

export default function Index() {
  return (
    <MobileShell>
      <Seo
        title="GreenBank Dashboard — Mobile Banking"
        description="View balances, send money, pay bills, and track spending in a mobile-first banking dashboard."
        canonical={window.location.href}
      />

      {/* Header / Hero */}
      <section className="relative px-4 pt-8 pb-6 bg-hero text-primary-foreground rounded-b-3xl">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm leading-5 opacity-90">Good Evening</p>
              <h1 className="text-2xl font-semibold">Mobile Banking Dashboard</h1>
            </div>
            <Wallet className="h-6 w-6 opacity-90" aria-hidden />
          </div>
          <div className="mt-4">
            <Input
              placeholder="Search transactions"
              aria-label="Search transactions"
              className="bg-white/10 text-primary-foreground placeholder:opacity-80 border-white/20"
            />
          </div>

          <NavLink to="/card" aria-label="View card details" className="block transition-transform duration-200 hover:scale-105">
            <Card className="mt-4 bg-background/10 backdrop-blur border-white/10">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-80">Current Balance</p>
                    <p className="text-3xl font-bold">$30,987.00</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80">Card •••• 9875</p>
                    <p className="text-xs opacity-80">Exp 03/24</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                {actions.map(({ label, icon: Icon }) => (
                  <Button key={label} variant="action" size="icon" className="h-16 w-16 flex flex-col">
                    <Icon className="h-5 w-5" />
                    <span className="mt-1 text-xs">{label}</span>
                  </Button>
                ))}
                </div>
              </CardContent>
            </Card>
          </NavLink>
        </div>
      </section>

      {/* Accounts */}
      <section className="px-4 py-5">
        <header className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">My Accounts</h2>
          <Button variant="link" className="p-0">View all</Button>
        </header>
        <div className="space-y-3">
          {accounts.map((a) => (
            <Card key={a.id} className="border hover:bg-muted/40 transition">
              <CardContent className="py-4 px-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{a.name}</p>
                  <p className="text-xl font-semibold">${a.balance.toLocaleString()}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="px-4 pb-6">
        <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
        <div className="divide-y rounded-lg border">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center">
                    {(() => {
                      const Icon = t.icon;
                      return <Icon className="h-4 w-4 text-foreground" aria-hidden />;
                    })()}
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
            ))}
        </div>
      </section>
    </MobileShell>
  );
}
