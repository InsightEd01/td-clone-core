import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";
import { ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Payments() {
  const sections = [
    { title: "Payments", items: [
      { label: "Send Money", to: "/payments/send" },
      { label: "Transfer", to: "/payments/transfer" },
      { label: "Pay Bills", to: "/payments/bills" },
      { label: "Mobile Deposit", to: "/payments/deposit" },
    ]},
    { title: "Investing", items: [
      { label: "Invest", to: "#" },
      { label: "Markets & Research", to: "#" },
    ]},
    { title: "Services", items: [
      { label: "My Rewards", to: "#" },
      { label: "Credits", to: "#" },
      { label: "Banking Services", to: "#" },
      { label: "Spending Insights", to: "/card" },
      { label: "Offers", to: "#" },
      { label: "Wallet", to: "#" },
    ]},
  ];

  return (
    <MobileShell>
      <Seo title="Payments — GreenBank" description="Send, transfer, pay bills, and deposit checks." canonical={window.location.href} />
      <section className="p-4">
        <h1 className="text-xl font-semibold mb-3">Payments</h1>
        <nav className="space-y-6" aria-label="Payments navigation">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-sm text-muted-foreground mb-2">{s.title}</h2>
              <div className="divide-y rounded-lg border">
                {s.items.map((item) => (
                  <NavLink key={item.label} to={item.to} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-accent/50">
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </section>
    </MobileShell>
  );
}
