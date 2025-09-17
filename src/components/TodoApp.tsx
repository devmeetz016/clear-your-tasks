import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}
type FilterType = 'all' | 'active' | 'completed';
const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const addTodo = useCallback(() => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: crypto.randomUUID(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos(prev => [todo, ...prev]);
      setNewTodo('');
    }
  }, [newTodo]);
  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => todo.id === id ? {
      ...todo,
      completed: !todo.completed
    } : todo));
  }, []);
  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;
  return <div className="min-h-screen bg-gradient-primary p-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-white mb-2">Todo App</h1>
          <p className="text-white/80">Stay organized and get things done</p>
        </div>

        {/* Add Todo */}
        <Card className="p-6 mb-6 shadow-card bg-card border-0">
          <div className="flex gap-3">
            <Input placeholder="What needs to be done?" value={newTodo} onChange={e => setNewTodo(e.target.value)} onKeyPress={handleKeyPress} className="flex-1 border-border/50 focus:border-primary transition-smooth" />
            <Button onClick={addTodo} disabled={!newTodo.trim()} className="bg-gradient-primary hover:shadow-hover transition-smooth border-0 text-lg text-slate-950">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center bg-card border-0 shadow-todo">
            <div className="text-2xl font-bold text-primary">{todos.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </Card>
          <Card className="p-4 text-center bg-card border-0 shadow-todo">
            <div className="text-2xl font-bold text-accent">{activeCount}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </Card>
          <Card className="p-4 text-center bg-card border-0 shadow-todo">
            <div className="text-2xl font-bold text-success">{completedCount}</div>
            <div className="text-sm text-muted-foreground">Done</div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-6">
          {(['all', 'active', 'completed'] as FilterType[]).map(filterType => <Button key={filterType} variant={filter === filterType ? "default" : "secondary"} size="sm" onClick={() => setFilter(filterType)} className={cn("capitalize transition-smooth", filter === filterType ? "bg-gradient-primary shadow-hover border-0" : "bg-secondary hover:bg-secondary/80")}>
              {filterType}
            </Button>)}
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? <Card className="p-8 text-center bg-card border-0 shadow-card">
              <div className="text-muted-foreground">
                {filter === 'all' ? 'No todos yet. Add one above!' : filter === 'active' ? 'No active todos!' : 'No completed todos!'}
              </div>
            </Card> : filteredTodos.map(todo => <Card key={todo.id} className={cn("p-4 bg-card border-0 shadow-todo hover:shadow-hover transition-smooth", todo.completed && "opacity-75")}>
                <div className="flex items-center gap-3">
                  <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} className="data-[state=checked]:bg-gradient-success data-[state=checked]:border-success" />
                  <span className={cn("flex-1 transition-smooth", todo.completed ? "line-through text-muted-foreground" : "text-card-foreground")}>
                    {todo.text}
                  </span>
                  {todo.completed && <div className="text-success">
                      <Check className="h-4 w-4" />
                    </div>}
                  <Button variant="ghost" size="sm" onClick={() => deleteTodo(todo.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive transition-smooth">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>)}
        </div>

        {todos.length > 0 && <div className="text-center mt-8 text-white/60 text-sm">
            {activeCount > 0 ? `${activeCount} item${activeCount !== 1 ? 's' : ''} left` : 'All done! 🎉'}
          </div>}
      </div>
    </div>;
};
export default TodoApp;