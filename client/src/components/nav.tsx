import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  HomeIcon, 
  UsersIcon, 
  WalletIcon, 
  CheckSquareIcon,
  CalendarIcon,
  UserCheckIcon,
  SettingsIcon,
  GlobeIcon
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { UserSettings } from "@shared/schema";

export default function Navigation() {
  const [location] = useLocation();
  
  const { data: settings } = useQuery<UserSettings>({
    queryKey: ["/api/settings"]
  });

  const navItems = [
    { href: "/", icon: HomeIcon, label: "Dashboard" },
    { href: "/guests", icon: UsersIcon, label: "Guest List" },
    { href: "/budget", icon: WalletIcon, label: "Budget" },
    { href: "/tasks", icon: CheckSquareIcon, label: "Tasks" },
    { href: "/vendors", icon: GlobeIcon, label: "Vendors" },
    { href: "/appointments", icon: CalendarIcon, label: "Appointments" },
    { href: "/seating", icon: UserCheckIcon, label: "Seating Chart" },
    { href: "/settings", icon: SettingsIcon, label: "Settings" }
  ];

  const premium = settings?.isPremium;
  
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-xl font-semibold text-primary">
              {settings?.coupleNames ? `${settings.coupleNames}'s Wedding` : "Wedding Planner"}
              {premium && <span className="ml-2 text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">Premium</span>}
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                  location === item.href 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </Link>
            ))}
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex flex-nowrap overflow-auto -mx-4 px-4 md:hidden">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  "flex flex-col items-center justify-center min-w-[4rem] px-2 py-2 transition-colors",
                  location === item.href 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}>
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
