
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [emailToPromote, setEmailToPromote] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;
      setUsers(profiles || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating user role:", error);
      toast.error(error.message);
    }
  };

  const makeAdminByEmail = async () => {
    try {
      if (!emailToPromote) {
        toast.error("Please enter an email address");
        return;
      }

      // First get the user ID from the auth.users table
      const { data: userData, error: userError } = await supabase.auth.admin
        .getUserByEmail(emailToPromote)
        .catch(() => {
          // This fails in the client-side API, we'll handle it differently
          return { data: null, error: new Error("Admin API not available client-side") };
        });

      let userId;

      if (userError) {
        // If admin API fails, try to find the user from profiles table instead
        // Note: This assumes emails are unique and the structure of your DB
        const { data: usersByEmail, error: emailError } = await supabase
          .rpc('find_user_id_by_email', { email_input: emailToPromote });

        if (emailError) throw emailError;
        if (!usersByEmail || usersByEmail.length === 0) {
          toast.error("User not found with that email");
          return;
        }

        userId = usersByEmail[0];
      } else if (userData) {
        userId = userData.user.id;
      }

      if (userId) {
        // First check if user has a profile
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", userId);
          
        if (profileError) throw profileError;
        
        if (!existingProfile || existingProfile.length === 0) {
          // Create profile if it doesn't exist
          const { error: insertError } = await supabase
            .from("profiles")
            .insert([{ id: userId, role: 'admin' }]);
            
          if (insertError) throw insertError;
          toast.success(`Created admin profile for ${emailToPromote}`);
        } else {
          // Update existing profile
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: 'admin' })
            .eq("id", userId);
            
          if (updateError) throw updateError;
          toast.success(`Updated ${emailToPromote} to admin role`);
        }
        
        fetchUsers();
        setEmailToPromote("");
      } else {
        toast.error("Could not find user with that email");
      }
    } catch (error: any) {
      console.error("Error making admin by email:", error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <CardDescription>
          View and manage all users in the system.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Make Admin by Email</label>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter email address" 
                value={emailToPromote}
                onChange={(e) => setEmailToPromote(e.target.value)}
              />
              <Button onClick={makeAdminByEmail}>Make Admin</Button>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Filter by Email</label>
            <Input 
              placeholder="Search users..." 
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              .filter(user => !searchEmail || user.id.toLowerCase().includes(searchEmail.toLowerCase()))
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">{user.id}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value: 'user' | 'admin') =>
                        updateUserRole(user.id, value)
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
