import { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import { Home, CreditCard, Send, User } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/accounts", label: "Accounts", icon: CreditCard },
  { to: "/payments", label: "Pay", icon: Send },
  { to: "/profile", label: "Profile", icon: User },
];

export default function MobileShell({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto w-full max-w-md min-h-screen bg-background flex flex-col">
      <main className="flex-1">{children}</main>
      <nav aria-label="Bottom Navigation" className="border-t">
        <ul className="grid grid-cols-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex">
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex-1 flex flex-col items-center justify-center py-3 text-sm ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
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
