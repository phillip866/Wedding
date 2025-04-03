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
    { href: "/appointments", icon: CalendarIcon, label: "Appointments" }
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
              <div key={item.href}>
                <Link href={item.href} className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                  location === item.href 
                    ? "bg-primary/20 text-primary font-medium" 
                    : "hover:bg-primary/5 hover:text-primary"
                )}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex justify-between items-center space-x-2 md:hidden">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link href={item.href} className={cn(
                  "flex flex-col items-center justify-center px-2 py-2 transition-colors",
                  location === item.href 
                    ? "text-primary font-medium" 
                    : "text-muted-foreground hover:text-primary/70"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5",
                    location === item.href && "text-primary"
                  )} />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
