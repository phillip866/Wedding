import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "./components/nav";
import Dashboard from "@/pages/dashboard";
import Guests from "@/pages/guests";
import Budget from "@/pages/budget";
import Tasks from "@/pages/tasks";
import Vendors from "@/pages/vendors";
import Appointments from "@/pages/appointments";
import Seating from "@/pages/seating";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { apiRequest } from "./lib/queryClient";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/guests" component={Guests} />
      <Route path="/budget" component={Budget} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/appointments" component={Appointments} />
      <Route path="/seating" component={Seating} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Check for settings on startup and create default if none exist
  useEffect(() => {
    async function initializeSettings() {
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) {
          throw new Error("No settings found");
        }
      } catch (error) {
        // No settings found, create default
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            weddingDate: null,
            coupleNames: "Your",
            venueAddress: null,
            theme: "default",
            isPremium: false
          })
        });
      }
    }
    
    initializeSettings();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Router />
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
