import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { Guest, BudgetItem, Task } from "@shared/schema";

export default function Dashboard() {
  const { data: guests, isLoading: loadingGuests } = useQuery<Guest[]>({
    queryKey: ["/api/guests"]
  });

  const { data: budget, isLoading: loadingBudget } = useQuery<BudgetItem[]>({
    queryKey: ["/api/budget"]
  });

  const { data: tasks, isLoading: loadingTasks } = useQuery<Task[]>({
    queryKey: ["/api/tasks"]
  });

  const isLoading = loadingGuests || loadingBudget || loadingTasks;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const confirmedGuests = guests?.filter(g => g.rsvpStatus === "confirmed").length || 0;
  const totalGuests = guests?.length || 0;
  const totalBudget = budget?.reduce((acc, item) => acc + Number(item.estimatedAmount), 0) || 0;
  const spentBudget = budget?.reduce((acc, item) => acc + (Number(item.actualAmount) || 0), 0) || 0;
  const completedTasks = tasks?.filter(t => t.completed).length || 0;
  const totalTasks = tasks?.length || 0;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Wedding Planning Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Guest List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{confirmedGuests}/{totalGuests}</div>
            <p className="text-sm text-muted-foreground">Confirmed Guests</p>
            <Progress 
              value={totalGuests ? (confirmedGuests / totalGuests) * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${spentBudget.toLocaleString()}/{totalBudget.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Budget Spent</p>
            <Progress 
              value={totalBudget ? (spentBudget / totalBudget) * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedTasks}/{totalTasks}</div>
            <p className="text-sm text-muted-foreground">Tasks Completed</p>
            <Progress 
              value={totalTasks ? (completedTasks / totalTasks) * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tasks?.slice(0, 5).map(task => (
                <li key={task.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    readOnly
                    className="h-4 w-4"
                  />
                  <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                    {task.title}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {budget?.filter(item => !item.paid).slice(0, 5).map(item => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.description}</span>
                  <span>${Number(item.estimatedAmount).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-64" />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} className="h-6 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
