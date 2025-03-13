import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  HomeIcon, 
  UsersIcon, 
  WalletIcon, 
  CheckSquareIcon 
} from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: HomeIcon, label: "Dashboard" },
    { href: "/guests", icon: UsersIcon, label: "Guest List" },
    { href: "/budget", icon: WalletIcon, label: "Budget" },
    { href: "/tasks", icon: CheckSquareIcon, label: "Tasks" }
  ];

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center space-x-8">
          <div className="text-xl font-semibold text-primary">Wedding Planner</div>
          <div className="flex space-x-4">
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
        </div>
      </div>
    </nav>
  );
}
