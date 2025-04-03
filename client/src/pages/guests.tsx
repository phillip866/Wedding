import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Guest, type SeatingPlan, insertGuestSchema, insertSeatingPlanSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UsersIcon, Trash2Icon, PencilIcon, PlusCircleIcon } from "lucide-react";

export default function Guests() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: guests, isLoading } = useQuery<Guest[]>({
    queryKey: ["/api/guests"]
  });

  const createGuest = useMutation({
    mutationFn: async (data: Guest) => {
      const res = await apiRequest("POST", "/api/guests", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
      setOpen(false);
      toast({ title: "Guest added successfully" });
    },
    onError: () => {
      toast({ 
        title: "Error adding guest",
        variant: "destructive"
      });
    }
  });

  const updateRsvp = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/guests/${id}`, { rsvpStatus: status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
    }
  });

  const form = useForm({
    resolver: zodResolver(insertGuestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      category: "friends",
      rsvpStatus: "pending",
      plusOne: false,
      dietaryRestrictions: "",
      notes: ""
    }
  });

  const filteredGuests = guests?.filter(guest => 
    guest.name.toLowerCase().includes(search.toLowerCase())
  );

  const [openSeatingDialog, setOpenSeatingDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("guests");
  
  // Fetch seating plans
  const { data: seatingPlans, isLoading: isSeatingLoading } = useQuery<SeatingPlan[]>({
    queryKey: ["/api/seating"]
  });
  
  // Form for seating plan
  const seatingForm = useForm({
    resolver: zodResolver(insertSeatingPlanSchema),
    defaultValues: {
      tableName: "",
      capacity: 8,
      category: "general",
      location: "",
      notes: ""
    }
  });
  
  // Create seating plan mutation
  const createSeatingPlan = useMutation({
    mutationFn: async (data: SeatingPlan) => {
      const res = await apiRequest("POST", "/api/seating", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seating"] });
      setOpenSeatingDialog(false);
      toast({ title: "Seating table added successfully" });
    },
    onError: () => {
      toast({ 
        title: "Error adding seating table",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Guest Management</h1>
      </div>

      <Tabs defaultValue="guests" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="guests">Guest List</TabsTrigger>
          <TabsTrigger value="seating">Seating Chart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guests" className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search guests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={() => setOpen(true)}>Add Guest</Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>RSVP Status</TableHead>
                  <TableHead>Plus One</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : filteredGuests?.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell>{guest.name}</TableCell>
                    <TableCell className="capitalize">{guest.category}</TableCell>
                    <TableCell>
                      <Select
                        value={guest.rsvpStatus}
                        onValueChange={(value) => updateRsvp.mutate({ id: guest.id, status: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{guest.plusOne ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="seating" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Seating Tables</h2>
            <Button onClick={() => setOpenSeatingDialog(true)}>Add Table</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isSeatingLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="h-[200px]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl"><div className="h-6 w-24 bg-muted rounded animate-pulse"></div></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : seatingPlans?.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No seating tables created yet.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setOpenSeatingDialog(true)}
                >
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                  Create your first table
                </Button>
              </div>
            ) : (
              seatingPlans?.map((table) => (
                <Card key={table.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{table.tableName}</CardTitle>
                      <Badge>{table.capacity} seats</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {table.location && `Location: ${table.location}`}
                    </p>
                    <div className="flex items-center space-x-1">
                      <UsersIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        0/{table.capacity} assigned
                      </span>
                    </div>
                    {table.category && (
                      <div className="mt-2">
                        <Badge variant="outline" className="capitalize">
                          {table.category}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Guest</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => createGuest.mutate(data))} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="friends">Friends</SelectItem>
                        <SelectItem value="colleagues">Colleagues</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createGuest.isPending}>
                  {createGuest.isPending ? "Adding..." : "Add Guest"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Seating Dialog */}
      <Dialog open={openSeatingDialog} onOpenChange={setOpenSeatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Seating Table</DialogTitle>
          </DialogHeader>
          <Form {...seatingForm}>
            <form onSubmit={seatingForm.handleSubmit((data) => createSeatingPlan.mutate(data as any))} className="space-y-4">
              <FormField
                control={seatingForm.control}
                name="tableName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Table 1, Family Table, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={seatingForm.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={seatingForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="kids">Kids</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={seatingForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Main Hall, Near Stage, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setOpenSeatingDialog(false)}>Cancel</Button>
                <Button type="submit" disabled={createSeatingPlan.isPending}>
                  {createSeatingPlan.isPending ? "Adding..." : "Add Table"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
