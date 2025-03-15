
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
  const [processingEmail, setProcessingEmail] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;
      console.log("Fetched profiles:", profiles);
      setUsers(profiles || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      console.log(`Updating user ${userId} to role ${newRole}`);
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating user role:", error);
      toast.error("Error updating user role: " + error.message);
    }
  };

  const makeAdminByEmail = async () => {
    try {
      if (!emailToPromote) {
        toast.error("Please enter an email address");
        return;
      }

      setProcessingEmail(emailToPromote);
      console.log("Searching for user with email:", emailToPromote);

      // Find user by email through RPC
      const { data: userIdFromRPC, error: rpcError } = await supabase
        .rpc("find_user_id_by_email", { email_input: emailToPromote });

      if (rpcError) {
        console.error("RPC error:", rpcError);
        throw rpcError;
      }
      
      console.log("User ID from RPC:", userIdFromRPC);
      
      if (!userIdFromRPC) {
        toast.error(`User not found with email: ${emailToPromote}`);
        setProcessingEmail("");
        return;
      }
      
      // If we found a user ID from RPC
      await updateRoleOrCreateProfile(userIdFromRPC);
      setProcessingEmail("");
    } catch (error: any) {
      console.error("Error making admin by email:", error);
      toast.error("Error making admin by email: " + error.message);
      setProcessingEmail("");
    }
  };

  const updateRoleOrCreateProfile = async (userId: string) => {
    try {
      console.log("Updating or creating profile for user ID:", userId);
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();
      
      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile error:", profileError);
        throw profileError;
      }
      
      console.log("Existing profile:", existingProfile);
      
      if (!existingProfile) {
        // Create profile if it doesn't exist
        console.log("Creating new admin profile for user ID:", userId);
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ id: userId, role: 'admin' }]);
          
        if (insertError) {
          console.error("Insert error:", insertError);
          throw insertError;
        }
        toast.success(`Created admin profile for ${emailToPromote}`);
      } else {
        // Update existing profile
        console.log("Updating existing profile to admin for user ID:", userId);
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: 'admin' })
          .eq("id", userId);
          
        if (updateError) {
          console.error("Update error:", updateError);
          throw updateError;
        }
        toast.success(`Updated ${emailToPromote} to admin role`);
      }
      
      setEmailToPromote("");
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating/creating profile:", error);
      toast.error("Error updating/creating profile: " + error.message);
    }
  };

  // Function to make nikhilbbes@gmail.com an admin
  const makeNikhilAdmin = async () => {
    setEmailToPromote("nikhilbbes@gmail.com");
    await makeAdminByEmail();
  };

  // Function to make worksbeyondworks@gmail.com an admin
  const makeWorksBeyondWorksAdmin = async () => {
    setEmailToPromote("worksbeyondworks@gmail.com");
    await makeAdminByEmail();
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading user data...</div>;
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
              <Button 
                onClick={makeAdminByEmail} 
                disabled={!!processingEmail}
              >
                {processingEmail ? "Processing..." : "Make Admin"}
              </Button>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Quick Actions</label>
            <div className="flex flex-col gap-2">
              <Button 
                onClick={makeNikhilAdmin} 
                className="w-full"
                disabled={processingEmail === "nikhilbbes@gmail.com"}
              >
                Make nikhilbbes@gmail.com Admin
              </Button>
              <Button 
                onClick={makeWorksBeyondWorksAdmin} 
                className="w-full"
                disabled={processingEmail === "worksbeyondworks@gmail.com"}
              >
                Make worksbeyondworks@gmail.com Admin
              </Button>
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
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users
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
                ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
