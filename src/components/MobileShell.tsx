import { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import { Home, CreditCard, Send, User, RefreshCcw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/accounts", label: "Accounts", icon: CreditCard },
  { to: "/payments", label: "Pay", icon: Send },
  { to: "/profile", label: "Profile", icon: User },
];

// Fixed profile (no editing)
const FIXED_PROFILE = {
  name: "Estela logdat",
  avatarUrl: "/profile picture.jpg",
} as const;

export default function MobileShell({ children }: PropsWithChildren) {
  const profile = FIXED_PROFILE;

  const initials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="mx-auto w-full max-w-md min-h-screen bg-background flex flex-col">
      <header
        aria-label="User Header"
        className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/logo.png"
              alt="GSB logo"
              className="h-6 w-auto"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement & { dataset: { triedComma?: string } };
                if (!img.dataset.triedComma) {
                  img.dataset.triedComma = "1";
                  img.src = "/logo,png"; // try alternate filename with comma if provided
                } else {
                  img.src = "/placeholder.svg";
                }
              }}
            />
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile.avatarUrl} alt={`${profile.name} avatar`} />
              <AvatarFallback>{initials(profile.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground leading-tight">{getTimeBasedGreeting()}</p>
              <span className="block text-sm font-semibold truncate">{profile.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Refresh"
              className="p-2 rounded-full hover:bg-accent/60 text-muted-foreground"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 pb-16">{children}</main>
      <nav
        aria-label="Bottom Navigation"
        className="sticky bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <ul className="grid grid-cols-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex">
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex-1 flex flex-col items-center justify-center py-3 text-sm rounded-t-lg ${
                    isActive ? "text-primary bg-accent/60" : "text-muted-foreground hover:text-foreground"
                  }`
                }
                aria-label={label}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
