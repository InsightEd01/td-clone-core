import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";
import { ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Payments() {
  const sections = [
    { title: "Payments", items: ["Transfers", "Bills", "Mobile Deposit"] },
    { title: "Investing", items: ["Invest", "Markets & Research"] },
    { title: "Services", items: ["My Rewards", "Credits", "Banking Services", "Spending Insights", "Offers", "Wallet"] },
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
                {s.items.map((label) => (
                  <button key={label} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-accent/50" onClick={() => toast({ title: label, description: "Coming soon" })}>
                    <span>{label}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </section>
    </MobileShell>
  );
}
