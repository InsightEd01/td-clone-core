import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Repeat, Receipt, Wallet, Banknote, DollarSign, Plus, Search } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { mockdb } from "@/lib/mock-db";
import Seo from "@/components/Seo";

const actions = [
  { label: "Send Money", icon: DollarSign },
  { label: "Transfer", icon: Repeat },
  { label: "Pay Bill", icon: Receipt },
  { label: "Add", icon: Plus },
];

const accounts = mockdb.getAccounts();

const transactions = mockdb.getTransactions().slice(0, 5).map((t) => ({
  id: t.id,
  name: t.counterparty || (t.type === "deposit" ? "Deposit" : t.type.charAt(0).toUpperCase() + t.type.slice(1)),
  time: new Date(t.createdAt).toLocaleDateString(),
  amount: t.amount,
  icon: t.type === "transfer" ? Repeat : t.type === "bill" ? Receipt : t.type === "deposit" ? Banknote : Banknote,
}));

export default function Index() {
  return (
    <MobileShell>
      <Seo
        title="GreenBank Dashboard — Mobile Banking"
        description="View balances, send money, pay bills, and track spending in a mobile-first banking dashboard."
        canonical={window.location.href}
      />

      {/* Header / Hero */}
      <section className="relative px-4 pt-8 pb-6 bg-hero text-primary-foreground rounded-b-3xl animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">My Accounts</h1>
            <Wallet className="h-6 w-6 opacity-90" aria-hidden />
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
              </CardContent>
            </Card>
          </NavLink>
          <div className="mt-3 flex items-center justify-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/30" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {actions.map(({ label, icon: Icon }) => (
              <Button
                key={label}
                variant="action"
                size="icon"
                className="h-16 w-16 flex flex-col"
                onClick={() => toast({ title: label, description: "Coming soon" })}
              >
                <Icon className="h-5 w-5" />
                <span className="mt-1 text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Accounts */}
      <section className="px-4 py-5">
        <header className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">My Accounts</h2>
          <Button asChild variant="link" className="p-0">
            <NavLink to="/accounts">View all</NavLink>
          </Button>
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
        <header className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">History</h2>
          <button aria-label="Search" className="p-2 rounded-full hover:bg-accent/50">
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>
        </header>
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
