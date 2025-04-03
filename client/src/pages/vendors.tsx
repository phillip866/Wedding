import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertVendorSchema } from "@shared/schema";
import type { Vendor } from "@shared/schema";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PhoneIcon, AtSignIcon, GlobeIcon, Trash2Icon, PencilIcon } from "lucide-react";

// Extend the insert schema with validation
const formSchema = insertVendorSchema.extend({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required")
});

export default function Vendors() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const { data: vendors, isLoading } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"]
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      contactName: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      notes: "",
      contractFile: ""
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error("Failed to create vendor");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors"] });
      form.reset();
      setIsOpen(false);
      toast({
        title: "Vendor created",
        description: "The vendor has been added successfully."
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

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; vendor: Partial<z.infer<typeof formSchema>> }) => {
      const response = await fetch(`/api/vendors/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.vendor)
      });
      
      if (!response.ok) {
        throw new Error("Failed to update vendor");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors"] });
      form.reset();
      setIsOpen(false);
      setEditingVendor(null);
      toast({
        title: "Vendor updated",
        description: "The vendor has been updated successfully."
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

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/vendors/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete vendor");
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors"] });
      toast({
        title: "Vendor deleted",
        description: "The vendor has been removed."
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
    if (editingVendor) {
      updateMutation.mutate({ id: editingVendor.id, vendor: data });
    } else {
      createMutation.mutate(data);
    }
  }

  function handleEdit(vendor: Vendor) {
    setEditingVendor(vendor);
    form.reset({
      name: vendor.name,
      category: vendor.category,
      contactName: vendor.contactName || "",
      phone: vendor.phone || "",
      email: vendor.email || "",
      website: vendor.website || "",
      address: vendor.address || "",
      notes: vendor.notes || "",
      contractFile: vendor.contractFile || ""
    });
    setIsOpen(true);
  }

  function handleOpenDialog() {
    setEditingVendor(null);
    form.reset({
      name: "",
      category: "",
      contactName: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      notes: "",
      contractFile: ""
    });
    setIsOpen(true);
  }

  const getVendorCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      "Photographer": "bg-blue-100 text-blue-800",
      "Videographer": "bg-indigo-100 text-indigo-800",
      "Florist": "bg-pink-100 text-pink-800",
      "Caterer": "bg-orange-100 text-orange-800",
      "Venue": "bg-purple-100 text-purple-800",
      "DJ": "bg-green-100 text-green-800",
      "Band": "bg-yellow-100 text-yellow-800",
      "Baker": "bg-red-100 text-red-800"
    };
    
    return categoryColors[category] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Vendors</h1>
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vendors</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog}>Add Vendor</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingVendor ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
              <DialogDescription>
                {editingVendor 
                  ? "Make changes to this vendor's details." 
                  : "Add a new vendor to help organize your wedding services."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Photographer, Caterer, etc." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact person's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="Website URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Physical address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contractFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract File URL</FormLabel>
                      <FormControl>
                        <Input placeholder="URL to contract file" {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Enter a URL to where the contract is stored
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any additional notes..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : editingVendor ? "Save Changes" : "Add Vendor"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {vendors?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-2">No vendors have been added yet.</p>
            <Button variant="outline" onClick={handleOpenDialog}>Add Your First Vendor</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vendors?.map((vendor) => (
            <Card key={vendor.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{vendor.name}</CardTitle>
                    <div className="mt-1">
                      <Badge 
                        className={getVendorCategoryColor(vendor.category)} 
                        variant="outline"
                      >
                        {vendor.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(vendor)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteMutation.mutate(vendor.id)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {vendor.contactName && (
                  <p className="text-sm font-medium mb-2">
                    Contact: {vendor.contactName}
                  </p>
                )}
                <div className="space-y-1">
                  {vendor.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <PhoneIcon className="mr-2 h-3.5 w-3.5" />
                      <span>{vendor.phone}</span>
                    </div>
                  )}
                  {vendor.email && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <AtSignIcon className="mr-2 h-3.5 w-3.5" />
                      <span>{vendor.email}</span>
                    </div>
                  )}
                  {vendor.website && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <GlobeIcon className="mr-2 h-3.5 w-3.5" />
                      <a 
                        href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {vendor.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
              {vendor.contractFile && (
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                    <a
                      href={vendor.contractFile}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Contract
                    </a>
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}