import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Todo } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function TodosPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const { data: todos = [] } = useQuery<Todo[]>({
    queryKey: ["/api/todos"],
  });

  const createMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await apiRequest("POST", "/api/todos", { title });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      setNewTodoTitle("");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (todo: Todo) => {
      const res = await apiRequest("PATCH", `/api/todos/${todo.id}`, {
        completed: !todo.completed,
        completedAt: !todo.completed ? new Date().toISOString() : null,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      toast({
        title: "Todo deleted",
        description: "The todo has been removed.",
      });
    },
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      createMutation.mutate(newTodoTitle);
    }
  };

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="space-y-6 p-6 pb-24 md:pb-6" data-testid="page-todos">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Todos</h1>
        <p className="text-muted-foreground">Keep track of tasks you need to complete</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleAddTodo} className="flex gap-2">
          <Input
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1"
          />
          <Button type="submit" disabled={createMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </form>
      </Card>

      {activeTodos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 text-foreground">Active</h2>
          <div className="space-y-2">
            {activeTodos.map((todo) => (
              <Card key={todo.id} className="p-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleMutation.mutate(todo)}
                  />
                  <span className="flex-1 text-foreground">{todo.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(todo.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {completedTodos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 text-foreground">Completed</h2>
          <div className="space-y-2">
            {completedTodos.map((todo) => (
              <Card key={todo.id} className="p-4 opacity-60">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleMutation.mutate(todo)}
                  />
                  <span className="flex-1 text-foreground line-through">
                    {todo.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(todo.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {todos.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No todos yet. Add one above to get started!</p>
        </Card>
      )}
    </div>
  );
}
