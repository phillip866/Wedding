import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSettingsSchema } from "@shared/schema";
import type { UserSettings } from "@shared/schema";
import { toast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, SparklesIcon } from "lucide-react";

// Extend the insert schema with validation
const formSchema = insertUserSettingsSchema.extend({
  coupleNames: z.string().min(1, "Please provide names")
});

export default function Settings() {
  const { data: settings, isLoading } = useQuery<UserSettings>({
    queryKey: ["/api/settings"]
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weddingDate: null,
      coupleNames: "",
      venueAddress: "",
      theme: "",
      isPremium: false
    }
  });

  // Set form values when settings are loaded
  useEffect(() => {
    if (settings) {
      form.reset({
        weddingDate: settings.weddingDate,
        coupleNames: settings.coupleNames || "",
        venueAddress: settings.venueAddress || "",
        theme: settings.theme || "",
        isPremium: settings.isPremium || false
      });
    }
  }, [settings, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; settings: Partial<z.infer<typeof formSchema>> }) => {
      const response = await fetch(`/api/settings/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.settings)
      });
      
      if (!response.ok) {
        throw new Error("Failed to update settings");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings updated",
        description: "Your wedding settings have been saved."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (settings) {
      updateMutation.mutate({ id: settings.id, settings: data });
    }
  }

  const handleUpgradeToPremium = () => {
    // Premium upgrade logic would go here
    toast({
      title: "Coming Soon",
      description: "Premium upgrades will be available soon. Stay tuned!",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-3xl mx-auto">
        <div>
          <Skeleton className="h-10 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-1/6" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Wedding Settings</h1>
        <p className="text-muted-foreground">Manage your wedding details and preferences</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Wedding Details</CardTitle>
          <CardDescription>
            Update your wedding information that will be used throughout the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="coupleNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couple Names*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sarah & Michael" {...field} />
                    </FormControl>
                    <FormDescription>
                      How you would like your names to appear
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weddingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Wedding Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full justify-start text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => 
                            field.onChange(date ? format(date, "yyyy-MM-dd") : null)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The date of your wedding ceremony
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="venueAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your venue's address" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      The address where your wedding will take place
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wedding Theme</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Rustic, Modern, Beach" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      The theme of your wedding
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Premium Features
            <SparklesIcon className="ml-2 h-5 w-5 text-yellow-400" />
          </CardTitle>
          <CardDescription>
            Upgrade to premium for additional features and benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Premium Status</p>
                <p className="text-sm text-muted-foreground">
                  {settings?.isPremium 
                    ? "You have access to all premium features"
                    : "Upgrade to unlock all premium features"}
                </p>
              </div>
              {settings?.isPremium ? (
                <Badge className="bg-yellow-400 hover:bg-yellow-500 text-black">Premium</Badge>
              ) : (
                <Button onClick={handleUpgradeToPremium} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Upgrade to Premium
                </Button>
              )}
            </div>
            <div className="border-t pt-4">
              <p className="font-medium mb-2">Premium Benefits:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Unlimited guests and vendor management</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Digital invitation capabilities</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Advanced budget analytics and reporting</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Priority customer support</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>No advertisements</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}