import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Send, Repeat, Receipt, Camera } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Accounts() {
  return (
    <MobileShell>
      <Seo title="Accounts — GreenBank" description="View and manage all your accounts." canonical={window.location.href} />
      <section className="p-4">
        <header className="mb-3">
          <h1 className="text-xl font-semibold">My Accounts</h1>
          <p className="text-xs text-muted-foreground">Updated just now</p>
        </header>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: "Send", icon: Send },
            { label: "Transfer", icon: Repeat },
            { label: "Bills", icon: Receipt },
            { label: "Deposit", icon: Camera },
          ].map(({ label, icon: Icon }) => (
            <Button key={label} variant="action" size="icon" className="h-16 w-16 flex flex-col">
              <Icon className="h-5 w-5" />
              <span className="mt-1 text-xs">{label}</span>
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {[
            { id: "chq", name: "Unlimited Chequing", balance: 1490.12 },
            { id: "svg", name: "Every Day Savings", balance: 167.82 },
          ].map((a) => (
            <NavLink key={a.id} to="/card" className="block transition-transform duration-200 hover:scale-105" aria-label={`View ${a.name} details`}>
              <Card className="border hover:bg-muted/40">
                <CardContent className="py-4 px-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{a.name}</p>
                    <p className="text-xl font-semibold">${a.balance.toLocaleString()}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </NavLink>
          ))}
        </div>
      </section>
    </MobileShell>
  );
}
