import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";

export default function Profile() {
  return (
    <MobileShell>
      <Seo title="Profile — GreenBank" description="Manage your preferences and settings." canonical={window.location.href} />
      <section className="p-4">
        <h1 className="text-xl font-semibold mb-2">Profile</h1>
        <p className="text-muted-foreground">Settings and preferences coming soon.</p>
      </section>
    </MobileShell>
  );
}
