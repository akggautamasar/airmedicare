import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AppointmentFormProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  paymentType: "full" | "partial";
  setPaymentType: (type: "full" | "partial") => void;
  consultationFee: number;
}

export const AppointmentForm = ({
  selectedDate,
  setSelectedDate,
  paymentType,
  setPaymentType,
  consultationFee,
}: AppointmentFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Select Date</Label>
        <Input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="payment">Payment Type</Label>
        <Select
          value={paymentType}
          onValueChange={(value: "full" | "partial") => setPaymentType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Full Payment (₹{consultationFee})</SelectItem>
            <SelectItem value="partial">
              Partial Payment (₹{Math.round(consultationFee * 0.1)})
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};