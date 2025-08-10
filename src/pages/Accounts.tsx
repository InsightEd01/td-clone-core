import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";

export default function Accounts() {
  return (
    <MobileShell>
      <Seo title="Accounts — GreenBank" description="View and manage all your accounts." canonical={window.location.href} />
      <section className="p-4">
        <h1 className="text-xl font-semibold mb-2">Accounts</h1>
        <p className="text-muted-foreground">Account list and details coming next.</p>
      </section>
    </MobileShell>
  );
}
