import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AppointmentsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments Management</CardTitle>
        <CardDescription>
          Manage all appointments in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* TODO: Implement appointments management */}
      </CardContent>
    </Card>
  );
}