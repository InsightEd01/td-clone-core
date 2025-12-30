import { Button } from "@/components/ui/button";

import { Repeat, Receipt, Banknote, DollarSign, Plus, Search, ChevronRight, Eye, EyeOff, Wifi, Coffee, Zap } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { mockdb } from "@/lib/mock-db";
import Seo from "@/components/Seo";
import { useEffect, useRef, useState } from "react";

const actions = [
  { label: "Send", icon: DollarSign, to: "/payments/send" },
  { label: "Transfer", icon: Repeat, to: "/payments/transfer" },
  { label: "Pay Bill", icon: Receipt, to: "/payments/bills" },
  { label: "Add", icon: Plus },
  { label: "Deposit", icon: Banknote, to: "/payments/deposit" },
  { label: "Request", icon: Search },
  { label: "Split Bill", icon: ChevronRight },
  { label: "Invest", icon: Repeat },
  { label: "Budget", icon: Receipt },
  { label: "Track", icon: Plus },
  { label: "Donate", icon: DollarSign },
  { label: "Lend", icon: Banknote },
];

// Simplified history per request: single deposit entry
const sampleHistory = [
  { 
    id: "1", 
    name: "Deposit from Myrna Williams", 
    subtitle: " inherited fund", 
    amount: 4800500.0,
    date: "12/29/2025"
  },
];

const mainBalance = 4800500;

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: Math.random() * 4,
    duration: 4 + Math.random() * 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-white/30 rounded-full animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

 

 

export default function Index() {
  const [showBalance, setShowBalance] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem("gb.showBalance");
      return v !== "false"; // default true
    } catch {
      return true;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("gb.showBalance", String(showBalance));
    } catch {}
  }, [showBalance]);

  // swipe-driven, animated card carousel (no scrollbars)
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50; // px
  const cards = [
    { label: "Debit card", masked: "5214 **** **** 3456", expiry: "11/30", variant: "default" as const },
    { label: "Credit card", masked: "5454 **** **** 3421", expiry: "07/29", variant: "yellow" as const },
  ];
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta < 0 && activeSlide < cards.length - 1) setActiveSlide((i) => i + 1);
      if (delta > 0 && activeSlide > 0) setActiveSlide((i) => i - 1);
    }
    touchStartX.current = null;
  };

  const formattedMainBalance = mainBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <MobileShell>
      <Seo
        title="GCB Dashboard — Mobile Banking"
        description="View balances, send money, pay bills, and track spending in a mobile-first banking dashboard."
        canonical={window.location.href}
      />

      {/* Header / Hero */}
      <section className="relative px-4 pt-4 pb-4 bg-gradient-to-b from-emerald-700 to-emerald-900 text-primary-foreground rounded-b-3xl animate-fade-in overflow-hidden">
        <FloatingParticles />
        <div className="max-w-md mx-auto relative z-10">
          <div
            className="relative mt-2 min-h-[140px] select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {cards.map((c, idx) => {
              const isActive = idx === activeSlide;
              const position = idx < activeSlide ? "-translate-x-full" : idx > activeSlide ? "translate-x-full" : "translate-x-0";
              const ringClass = c.variant === "yellow" ? "ring-yellow-200/30" : "ring-white/15";
              const bgClass = c.variant === "yellow" ? "bg-amber-300/20" : "bg-white/10";
              const chipClass = c.variant === "yellow" ? "bg-amber-300/90" : "bg-yellow-300/90";
              return (
                <NavLink
                  key={idx}
                  to="/card"
                  aria-label={`View ${c.label} details`}
                  className={`absolute inset-0 block transition-all duration-300 ${position} ${isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                >
                  <div className={`rounded-2xl p-4 shadow-xl shadow-black/30 ring-1 ${ringClass} ${bgClass} backdrop-blur-md`}>
                    <div className="flex items-center justify-between text-white/90">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[18px] font-black italic tracking-wider leading-none text-white">
                            VISA
                          </span>
                          <p className="text-sm text-white/95">{c.label}</p>
                        </div>
                        <p className="mt-2 text-sm font-mono tracking-[0.25em] text-white/90">{c.masked}</p>
                        <p className="text-xs text-white/80">{c.expiry}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={showBalance ? "Hide balance" : "Show balance"}
                          className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowBalance((v) => !v);
                          }}
                        >
                          {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <Wifi className="h-4 w-4 rotate-90 opacity-80" aria-hidden />
                        <img src="/apple%20pay.png" alt="Apple Pay" className="h-6 w-auto" />
                      </div>
                    </div>
                    <p className="mt-6 text-3xl font-semibold text-white">
                      {showBalance ? `$${formattedMainBalance} USD` : "•••••••• USD"}
                    </p>
                  </div>
                </NavLink>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-center gap-1">
            {cards.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${activeSlide === i ? "bg-primary/80" : "bg-primary/30"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Card */}
      <section className="px-4 py-4 -mt-1">
        <div className="max-w-md mx-auto bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-2xl p-4 shadow-lg">
          <div className="grid grid-cols-4 gap-2">
            {actions.slice(0, 4).map(({ label, icon: Icon, to }, index) => {
              const content = (
                <Button
                  aria-label={label}
                  variant="action"
                  size="icon"
                  className="h-16 w-16 rounded-full text-white 
                  bg-gradient-to-b from-emerald-600/95 to-emerald-800/95 border border-white/20 
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_20px_rgba(0,0,0,0.35)] 
                  transition-all duration-300 will-change-transform 
                  hover:-translate-y-1 hover:scale-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_16px_32px_rgba(0,0,0,0.4)] 
                  active:translate-y-0 active:scale-95 active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.45),0_6px_12px_rgba(0,0,0,0.25)]
                  animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={(e) => {
                    if (to) return;
                    // Add haptic-style visual feedback
                    const button = document.activeElement as HTMLElement;
                    button?.classList.add('animate-pulse');
                    setTimeout(() => button?.classList.remove('animate-pulse'), 200);
                    toast({ title: label, description: "Coming soon" });
                    e.preventDefault();
                  }}
                >
                  <Icon
                    className="h-7 w-7 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] transition-transform duration-300"
                    strokeWidth={3}
                    aria-hidden
                  />
                </Button>
              );

              return (
                <div key={label} className="flex flex-col items-center">
                  {to ? (
                    <NavLink to={to} className="contents">
                      {content}
                    </NavLink>
                  ) : (
                    content
                  )}
                  <span className="mt-1 w-16 text-[11px] font-medium leading-tight text-center text-white/95 whitespace-normal">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* History Sheet */}
      <section className="px-0 pb-6">
        <div className="mx-auto max-w-md rounded-t-3xl bg-white text-foreground pt-4 px-4 shadow-sm">
          <header className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">History</h2>
            <button aria-label="Search" className="p-2 rounded-full hover:bg-accent/50">
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          </header>
          <div className="py-1 text-center text-xs text-muted-foreground">29/12/2025</div>
          <div className="divide-y">
            {sampleHistory.slice(0, 8).map((t, index) => {
              // Dynamic icon based on merchant
              const getIcon = (name: string) => {
                if (name.toLowerCase().includes('coffee') || name.toLowerCase().includes('starbucks')) return Coffee;
                if (name.toLowerCase().includes('gas') || name.toLowerCase().includes('shell')) return Zap;
                if (name.toLowerCase().includes('grocery') || name.toLowerCase().includes('farm')) return Receipt;
                return Banknote;
              };
              
              const Icon = getIcon(t.name);
              const isPositive = t.amount > 0;
              
              return (
                <div 
                  key={t.id} 
                  className="flex items-center justify-between py-3 animate-fade-in hover:bg-gray-50/50 transition-colors duration-200 rounded-lg px-2 -mx-2"
                  style={{ animationDelay: `${600 + index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 ${
                      isPositive ? 'bg-green-400/90' : 'bg-yellow-400/90'
                    }`}>
                      <Icon className="h-4 w-4 text-black" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      {t.subtitle && <p className="text-xs text-muted-foreground">{t.subtitle}</p>}
                    </div>
                  </div>
                  <p className={`font-medium transition-colors duration-200 ${
                    isPositive ? 'text-green-600' : 'text-foreground'
                  }`}>
                    {t.amount < 0 ? `$${Math.abs(t.amount).toFixed(2)}` : `+$${t.amount.toFixed(2)}`}
                  </p>
                </div>
              );
            })}
            
            {/* Show more button */}
            <div className="pt-4 text-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 animate-fade-in"
                style={{ animationDelay: '1000ms' }}
                onClick={() => toast({ title: "View All", description: "Full transaction history coming soon" })}
              >
                View all transactions
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MobileShell>
  );
}
