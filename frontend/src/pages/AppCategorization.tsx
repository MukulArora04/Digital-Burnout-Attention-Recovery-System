import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useApplications } from '@/hooks/useApplications';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AppCategorization() {
  const { applications, addApplication, updateApplication, removeApplication } = useApplications();
  const [newAppName, setNewAppName] = useState('');
  const [newAppCategory, setNewAppCategory] = useState<'productive' | 'distracting'>('productive');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<'productive' | 'distracting'>('productive');

  const productiveApps = applications.filter((app) => app.category === 'productive');
  const distractingApps = applications.filter((app) => app.category === 'distracting');

  const handleAdd = () => {
    if (newAppName.trim()) {
      addApplication(newAppName.trim(), newAppCategory);
      setNewAppName('');
      setNewAppCategory('productive');
    }
  };

  const startEdit = (id: string, name: string, category: 'productive' | 'distracting') => {
    setEditingId(id);
    setEditName(name);
    setEditCategory(category);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      updateApplication(editingId, editName.trim(), editCategory);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Application Categories</h2>
        <p className="text-muted-foreground">
          Manage which applications are productive or distracting for your workflow
        </p>
      </div>

      {/* Add New Application */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Application</CardTitle>
          <CardDescription>
            Categorize applications to help Focus Guardian understand your work patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="app-name">Application Name</Label>
              <Input
                id="app-name"
                placeholder="e.g., Visual Studio Code"
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div className="w-full sm:w-48">
              <Label htmlFor="app-category">Category</Label>
              <Select
                value={newAppCategory}
                onValueChange={(value: 'productive' | 'distracting') => setNewAppCategory(value)}
              >
                <SelectTrigger id="app-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="productive">Productive</SelectItem>
                  <SelectItem value="distracting">Distracting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAdd} className="gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Lists */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Productive Apps */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  Productive Apps
                </CardTitle>
                <CardDescription>Applications that support your work</CardDescription>
              </div>
              <Badge variant="secondary">{productiveApps.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {productiveApps.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No productive apps yet. Add some above!
                </p>
              ) : (
                productiveApps.map((app) => (
                  <div
                    key={app.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border',
                      editingId === app.id ? 'bg-muted/50' : 'bg-card hover:bg-muted/30'
                    )}
                  >
                    {editingId === app.id ? (
                      <>
                        <div className="flex-1 flex gap-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8"
                          />
                          <Select
                            value={editCategory}
                            onValueChange={(value: 'productive' | 'distracting') =>
                              setEditCategory(value)
                            }
                          >
                            <SelectTrigger className="h-8 w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="productive">Productive</SelectItem>
                              <SelectItem value="distracting">Distracting</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button size="sm" variant="ghost" onClick={saveEdit}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="font-medium">{app.name}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(app.id, app.name, app.category)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeApplication(app.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Distracting Apps */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-amber-600 dark:text-amber-400">⚠</span>
                  Distracting Apps
                </CardTitle>
                <CardDescription>Applications that may break your focus</CardDescription>
              </div>
              <Badge variant="secondary">{distractingApps.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {distractingApps.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No distracting apps yet. Add some above!
                </p>
              ) : (
                distractingApps.map((app) => (
                  <div
                    key={app.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border',
                      editingId === app.id ? 'bg-muted/50' : 'bg-card hover:bg-muted/30'
                    )}
                  >
                    {editingId === app.id ? (
                      <>
                        <div className="flex-1 flex gap-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8"
                          />
                          <Select
                            value={editCategory}
                            onValueChange={(value: 'productive' | 'distracting') =>
                              setEditCategory(value)
                            }
                          >
                            <SelectTrigger className="h-8 w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="productive">Productive</SelectItem>
                              <SelectItem value="distracting">Distracting</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button size="sm" variant="ghost" onClick={saveEdit}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="font-medium">{app.name}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(app.id, app.name, app.category)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeApplication(app.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
