import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UsersTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <CardDescription>
          Manage all users in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* TODO: Implement users management */}
      </CardContent>
    </Card>
  );
}