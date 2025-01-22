import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface HospitalFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export function HospitalForm({ onSuccess, initialData }: HospitalFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    category: "",
    district: "",
    address: "",
    contact: "",
    emergency: false,
    services: [] as string[],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "",
        category: initialData.category || "",
        district: initialData.district || "",
        address: initialData.address || "",
        contact: initialData.contact || "",
        emergency: initialData.emergency || false,
        services: initialData.services || [],
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (initialData) {
        // Update existing hospital
        const { error } = await supabase
          .from("hospitals_data")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id);

        if (error) throw error;

        toast.success("Hospital updated successfully");
      } else {
        // Add new hospital
        const { error } = await supabase.from("hospitals_data").insert([
          {
            ...formData,
            created_by: user.id,
          },
        ]);

        if (error) throw error;

        toast.success("Hospital added successfully");
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error saving hospital:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Hospital Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="government">Government</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="clinic">Clinic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="specialty">Specialty</SelectItem>
            <SelectItem value="super-specialty">Super Specialty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="district">District</Label>
        <Input
          id="district"
          value={formData.district}
          onChange={(e) =>
            setFormData({ ...formData, district: e.target.value })
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="contact">Contact</Label>
        <Input
          id="contact"
          value={formData.contact}
          onChange={(e) =>
            setFormData({ ...formData, contact: e.target.value })
          }
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="emergency"
          checked={formData.emergency}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, emergency: checked })
          }
        />
        <Label htmlFor="emergency">24/7 Emergency Services</Label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : initialData ? "Update Hospital" : "Add Hospital"}
      </Button>
    </form>
  );
}