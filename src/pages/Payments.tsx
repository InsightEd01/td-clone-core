import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";

export default function Payments() {
  return (
    <MobileShell>
      <Seo title="Payments — GreenBank" description="Send, transfer, pay bills, and deposit checks." canonical={window.location.href} />
      <section className="p-4">
        <h1 className="text-xl font-semibold mb-2">Payments</h1>
        <p className="text-muted-foreground">Quick actions and forms will be added here.</p>
      </section>
    </MobileShell>
  );
}
