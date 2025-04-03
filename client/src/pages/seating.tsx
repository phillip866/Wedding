import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertSeatingPlanSchema } from "@shared/schema";
import type { SeatingPlan, Guest } from "@shared/schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersIcon, Trash2Icon, PencilIcon, PlusCircleIcon } from "lucide-react";

// Extend the insert schema with validation
const formSchema = insertSeatingPlanSchema.extend({
  tableName: z.string().min(1, "Table name is required"),
  capacity: z.number().int().min(1, "Capacity must be at least 1")
});

export default function Seating() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<SeatingPlan | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: tables, isLoading: tablesLoading } = useQuery<SeatingPlan[]>({
    queryKey: ["/api/seating-plans"]
  });

  const { data: guests, isLoading: guestsLoading } = useQuery<Guest[]>({
    queryKey: ["/api/guests"]
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tableName: "",
      capacity: 8,
      category: "",
      location: ""
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await fetch("/api/seating-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error("Failed to create table");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seating-plans"] });
      form.reset();
      setIsOpen(false);
      toast({
        title: "Table created",
        description: "The table has been added to your seating plan."
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
    mutationFn: async (data: { id: number; table: Partial<z.infer<typeof formSchema>> }) => {
      const response = await fetch(`/api/seating-plans/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.table)
      });
      
      if (!response.ok) {
        throw new Error("Failed to update table");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seating-plans"] });
      form.reset();
      setIsOpen(false);
      setEditingTable(null);
      toast({
        title: "Table updated",
        description: "The table has been updated."
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
      const response = await fetch(`/api/seating-plans/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete table");
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seating-plans"] });
      toast({
        title: "Table deleted",
        description: "The table has been removed from your seating plan."
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
    if (editingTable) {
      updateMutation.mutate({ id: editingTable.id, table: data });
    } else {
      createMutation.mutate(data);
    }
  }

  function handleEdit(table: SeatingPlan) {
    setEditingTable(table);
    form.reset({
      tableName: table.tableName,
      capacity: table.capacity,
      category: table.category || "",
      location: table.location || ""
    });
    setIsOpen(true);
  }

  function handleOpenDialog() {
    setEditingTable(null);
    form.reset({
      tableName: "",
      capacity: 8,
      category: "",
      location: ""
    });
    setIsOpen(true);
  }

  const uniqueCategories = tables ? 
    ["all", ...new Set(tables.map(table => table.category).filter(Boolean) as string[])] : 
    ["all"];

  const filteredTables = tables && activeTab !== "all" ?
    tables.filter(table => table.category === activeTab) :
    tables;

  const isLoading = tablesLoading || guestsLoading;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Seating Chart</h1>
          <Skeleton className="h-10 w-28" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
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
        <h1 className="text-3xl font-bold">Seating Chart</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog}>Add Table</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>{editingTable ? "Edit Table" : "Add New Table"}</DialogTitle>
              <DialogDescription>
                {editingTable 
                  ? "Make changes to this table's settings." 
                  : "Add a new table to your seating plan."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="tableName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Table Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Table 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of guests that can be seated at this table
                      </FormDescription>
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
                      <FormControl>
                        <Input placeholder="E.g., Family, Friends, VIP" {...field} />
                      </FormControl>
                      <FormDescription>
                        Categorize tables to organize them better
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Near dance floor" {...field} />
                      </FormControl>
                      <FormDescription>
                        Where this table is located in the venue
                      </FormDescription>
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
                      : editingTable ? "Save Changes" : "Add Table"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {tables?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-2">No tables have been created yet.</p>
            <Button variant="outline" onClick={handleOpenDialog}>Create Your First Table</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full h-auto flex flex-wrap">
              {uniqueCategories.map((category) => (
                <TabsTrigger key={category} value={category} className="flex-grow">
                  {category === "all" ? "All Tables" : category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTables?.map((table) => (
                  <Card key={table.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{table.tableName}</CardTitle>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(table)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteMutation.mutate(table.id)}
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Capacity: {table.capacity}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        {table.category && (
                          <div className="text-sm">
                            <span className="font-medium">Category:</span> {table.category}
                          </div>
                        )}
                        {table.location && (
                          <div className="text-sm">
                            <span className="font-medium">Location:</span> {table.location}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/40 border-t p-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full" 
                        onClick={() => toast({
                          title: "Coming Soon",
                          description: "Assigning guests to tables will be available in the next update."
                        })}
                      >
                        <PlusCircleIcon className="h-4 w-4 mr-2" />
                        Assign Guests
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}