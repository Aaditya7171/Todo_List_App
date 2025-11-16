import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type Todo = {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function TodosPage() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string>("");

  const todosQuery = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await api.get<{ todos: Todo[] }>("/todos");
      return res.todos;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { title: string; description?: string; dueDate?: string | null }) => {
      return api.post<{ todo: Todo }>("/todos", payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, update }: { id: string; update: Partial<Todo> }) => {
      return api.patch<{ todo: Todo }>(`/todos/${id}`, update);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.del(`/todos/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
  });

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createMutation.mutate({ title, description: description || undefined, dueDate: dueDate || undefined });
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Your Todos</h1>

      <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input label="Due date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Adding..." : "Add"}
        </Button>
      </form>

      {todosQuery.isLoading ? (
        <p>Loading...</p>
      ) : todosQuery.isError ? (
        <p className="text-red-500">Failed to load todos</p>
      ) : (
        <ul className="space-y-2">
          {todosQuery.data!.map((t) => (
            <TodoItem
              key={t._id}
              todo={t}
              onToggle={() => updateMutation.mutate({ id: t._id, update: { completed: !t.completed } })}
              onDelete={() => deleteMutation.mutate(t._id)}
              onSave={(update) => updateMutation.mutate({ id: t._id, update })}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
  onSave,
}: {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onSave: (update: Partial<Todo>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [dueDate, setDueDate] = useState<string>(todo.dueDate ? todo.dueDate.slice(0, 10) : "");

  return (
    <li className="border border-gray-300 rounded-md p-3 bg-white text-black">
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={todo.completed} onChange={onToggle} />
        {!editing ? (
          <div className="flex-1">
            <div className={"font-medium " + (todo.completed ? "line-through" : "")}>{todo.title}</div>
            {todo.description && <div className="text-sm text-gray-600">{todo.description}</div>}
            {todo.dueDate && <div className="text-xs text-gray-500">Due: {new Date(todo.dueDate).toDateString()}</div>}
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        )}

        {!editing ? (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing(true)}>Edit</Button>
            <Button variant="secondary" onClick={onDelete}>Delete</Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                onSave({ title, description, dueDate: dueDate || undefined });
                setEditing(false);
              }}
            >
              Save
            </Button>
            <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        )}
      </div>
    </li>
  );
}
