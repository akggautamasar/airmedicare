import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoansTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Loans Management</CardTitle>
        <CardDescription>
          Manage all medical loan applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* TODO: Implement loans management */}
      </CardContent>
    </Card>
  );
}