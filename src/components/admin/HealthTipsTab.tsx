
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, PlusCircle, Eye } from "lucide-react";

type HealthTip = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
};

export function HealthTipsTab() {
  const [healthTips, setHealthTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTip, setEditingTip] = useState<HealthTip | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    is_published: false,
  });

  useEffect(() => {
    fetchHealthTips();
  }, []);

  const fetchHealthTips = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("health_tips")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHealthTips(data || []);
    } catch (error: any) {
      console.error("Error fetching health tips:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (tip?: HealthTip) => {
    if (tip) {
      setEditingTip(tip);
      setFormData({
        title: tip.title,
        content: tip.content,
        image_url: tip.image_url || "",
        is_published: tip.is_published,
      });
    } else {
      setEditingTip(null);
      setFormData({
        title: "",
        content: "",
        image_url: "",
        is_published: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTip(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_published: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTip) {
        // Update existing tip
        const { error } = await supabase
          .from("health_tips")
          .update({
            title: formData.title,
            content: formData.content,
            image_url: formData.image_url || null,
            is_published: formData.is_published,
          })
          .eq("id", editingTip.id);

        if (error) throw error;
        toast.success("Health tip updated successfully");
      } else {
        // Create new tip
        const { error } = await supabase.from("health_tips").insert({
          title: formData.title,
          content: formData.content,
          image_url: formData.image_url || null,
          is_published: formData.is_published,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });

        if (error) throw error;
        toast.success("Health tip added successfully");
      }
      
      handleCloseDialog();
      fetchHealthTips();
    } catch (error: any) {
      console.error("Error saving health tip:", error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this health tip?")) {
      try {
        const { error } = await supabase.from("health_tips").delete().eq("id", id);
        if (error) throw error;
        toast.success("Health tip deleted successfully");
        fetchHealthTips();
      } catch (error: any) {
        console.error("Error deleting health tip:", error);
        toast.error(error.message);
      }
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("health_tips")
        .update({ is_published: !currentStatus })
        .eq("id", id);
      
      if (error) throw error;
      toast.success(`Health tip ${!currentStatus ? "published" : "unpublished"} successfully`);
      fetchHealthTips();
    } catch (error: any) {
      console.error("Error updating health tip:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Health Tips Management</h2>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Tip
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading health tips...</div>
      ) : healthTips.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <p className="text-muted-foreground">No health tips found. Add your first tip!</p>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {healthTips.map((tip) => (
              <TableRow key={tip.id}>
                <TableCell className="font-medium">{tip.title}</TableCell>
                <TableCell className="max-w-xs truncate">{tip.content}</TableCell>
                <TableCell>
                  <Badge variant={tip.is_published ? "default" : "outline"}>
                    {tip.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(tip.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTogglePublish(tip.id, tip.is_published)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(tip)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(tip.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingTip ? "Edit Health Tip" : "Add New Health Tip"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter tip title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Enter tip content"
                rows={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL (optional)</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="Enter image URL"
              />
              {formData.image_url && (
                <div className="mt-2 rounded-md overflow-hidden h-32 w-full">
                  <img
                    src={formData.image_url}
                    alt="Tip preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_published">Publish immediately</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">{editingTip ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
