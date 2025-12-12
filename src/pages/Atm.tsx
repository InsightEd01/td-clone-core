import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMemo, useState } from "react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { NavLink } from "react-router-dom";

type RevealKey = "cardNumber" | "expiry" | "cardholder" | "cvv" | "pin" | "dailyLimit" | "perTxnLimit";

export default function AtmPage() {
  const [revealAll, setRevealAll] = useState(false);
  const [reveals, setReveals] = useState<Record<RevealKey, boolean>>({
    cardNumber: false,
    expiry: false,
    cardholder: true,
    cvv: false,
    pin: false,
    dailyLimit: true,
    perTxnLimit: true,
  });

  const effectiveReveals = useMemo(() => {
    if (!revealAll) return reveals;
    return {
      ...reveals,
      cardNumber: true,
      expiry: true,
      cardholder: true,
      cvv: true,
      pin: true,
      dailyLimit: true,
      perTxnLimit: true,
    } as Record<RevealKey, boolean>;
  }, [revealAll, reveals]);

  const details = useMemo(
    () => ({
      cardNumber: "5214 5678 9012 3456",
      expiry: "11/30",
      cardholder: "Jasmin Gina Fabro",
      cvv: "123",
      pin: "4321",
      dailyLimit: "₱ 4,800,500.00",
      perTxnLimit: "₱ 4,800,500.00",
    }),
    []
  );

  const masked = useMemo(
    () => ({
      cardNumber: "•••• •••• •••• 3456",
      expiry: "••/••",
      cardholder: details.cardholder,
      cvv: "•••",
      pin: "••••",
      dailyLimit: details.dailyLimit,
      perTxnLimit: details.perTxnLimit,
    }),
    [details.cardholder, details.dailyLimit, details.perTxnLimit]
  );

  const setReveal = (key: RevealKey, next: boolean) => {
    setReveals((prev) => ({ ...prev, [key]: next }));
  };

  const valueFor = (key: RevealKey) => (effectiveReveals[key] ? details[key] : masked[key]);

  return (
    <MobileShell>
      <Seo title="ATM — GCB" description="Simulated in-app ATM details" canonical={window.location.href} />

      <section className="px-4 pt-6 pb-4 bg-hero text-primary-foreground rounded-b-3xl">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <NavLink to="/card" aria-label="Back to card">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </NavLink>
              <h1 className="text-xl font-semibold">ATM</h1>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={() => setRevealAll((v) => !v)}
            >
              {revealAll ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide all
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Reveal all
                </>
              )}
            </Button>
          </div>

          <Card className="mt-4 bg-background/10 backdrop-blur border-white/10 overflow-hidden">
            <CardContent className="p-0">
              <img
                src="/gcb-visa-card.jpeg"
                alt="GCB Bank Visa Platinum Debit Card"
                className="w-full h-auto"
              />
            </CardContent>
          </Card>

          <p className="text-xs opacity-80 mt-2">
            Add your card image to: <span className="font-medium">public/gcb-visa-card.jpeg</span>
          </p>
        </div>
      </section>

      <section className="p-4 space-y-4">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">ATM Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Card number</p>
                <p className="text-sm text-muted-foreground font-mono">{valueFor("cardNumber")}</p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="reveal-cardNumber" className="text-sm">Show</Label>
                <Switch
                  id="reveal-cardNumber"
                  checked={effectiveReveals.cardNumber}
                  onCheckedChange={(v) => setReveal("cardNumber", Boolean(v))}
                  disabled={revealAll}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Expiry</p>
                <p className="text-sm text-muted-foreground font-mono">{valueFor("expiry")}</p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="reveal-expiry" className="text-sm">Show</Label>
                <Switch
                  id="reveal-expiry"
                  checked={effectiveReveals.expiry}
                  onCheckedChange={(v) => setReveal("expiry", Boolean(v))}
                  disabled={revealAll}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Cardholder</p>
                <p className="text-sm text-muted-foreground">{valueFor("cardholder")}</p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="reveal-cardholder" className="text-sm">Show</Label>
                <Switch
                  id="reveal-cardholder"
                  checked={effectiveReveals.cardholder}
                  onCheckedChange={(v) => setReveal("cardholder", Boolean(v))}
                  disabled={revealAll}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">CVV</p>
                  <Switch
                    id="reveal-cvv"
                    checked={effectiveReveals.cvv}
                    onCheckedChange={(v) => setReveal("cvv", Boolean(v))}
                    disabled={revealAll}
                  />
                </div>
                <p className="text-sm text-muted-foreground font-mono mt-1">{valueFor("cvv")}</p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">ATM PIN</p>
                  <Switch
                    id="reveal-pin"
                    checked={effectiveReveals.pin}
                    onCheckedChange={(v) => setReveal("pin", Boolean(v))}
                    disabled={revealAll}
                  />
                </div>
                <p className="text-sm text-muted-foreground font-mono mt-1">{valueFor("pin")}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">Daily withdrawal limit</p>
                <p className="text-sm text-muted-foreground mt-1">{valueFor("dailyLimit")}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">Per-transaction limit</p>
                <p className="text-sm text-muted-foreground mt-1">{valueFor("perTxnLimit")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Simulated ATM Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline" onClick={() => {}}>
              Balance inquiry
            </Button>
            <Button className="w-full" variant="outline" onClick={() => {}}>
              Cash withdrawal
            </Button>
            <Button className="w-full" variant="outline" onClick={() => {}}>
              Change PIN
            </Button>
          </CardContent>
        </Card>
      </section>
    </MobileShell>
  );
}
