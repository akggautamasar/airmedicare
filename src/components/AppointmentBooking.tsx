import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

interface AppointmentBookingProps {
  doctorId: string;
  doctorName: string;
  hospitalId: string;
  hospitalName: string;
  consultationFee: number;
}

export const AppointmentBooking = ({
  doctorId,
  doctorName,
  hospitalId,
  hospitalName,
  consultationFee,
}: AppointmentBookingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [paymentType, setPaymentType] = useState<"full" | "partial">("full");
  const { user } = useAuth();

  const calculateAppointmentTime = (tokenNumber: number) => {
    const baseTime = new Date();
    baseTime.setHours(10, 0, 0, 0); // Start time: 10:00 AM
    const minutesPerPatient = 5;
    const additionalMinutes = (tokenNumber - 1) * minutesPerPatient;
    baseTime.setMinutes(baseTime.getMinutes() + additionalMinutes);
    return baseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleBookAppointment = async () => {
    try {
      if (!user) {
        toast.error("Please login to book an appointment");
        return;
      }

      // Get the latest token number for the selected date
      const { data: existingAppointments, error: fetchError } = await supabase
        .from('appointments')
        .select('token_number')
        .eq('doctor_id', doctorId)
        .eq('appointment_date', selectedDate)
        .order('token_number', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      const tokenNumber = existingAppointments && existingAppointments.length > 0
        ? existingAppointments[0].token_number + 1
        : 1;

      const scheduledTime = calculateAppointmentTime(tokenNumber);
      const paymentAmount = paymentType === 'partial' 
        ? consultationFee * 0.1 
        : consultationFee;

      // Create appointment record
      const { error: insertError } = await supabase
        .from('appointments')
        .insert([
          {
            patient_id: user.id,
            doctor_id: doctorId,
            hospital_id: hospitalId,
            appointment_date: selectedDate,
            token_number: tokenNumber,
            scheduled_time: scheduledTime,
            payment_status: paymentType,
            payment_amount: paymentAmount,
            status: 'confirmed'
          }
        ]);

      if (insertError) throw insertError;

      // Send notification email
      const { error: emailError } = await supabase
        .functions.invoke('send-appointment-email', {
          body: {
            email: user.email,
            name: user.name,
            doctorName,
            hospitalName,
            date: selectedDate,
            time: scheduledTime,
            tokenNumber,
          },
        });

      if (emailError) console.error('Error sending email:', emailError);

      toast.success(`Appointment booked successfully! Your token number is ${tokenNumber}`);
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to book appointment. Please try again.");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Book Appointment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Book an appointment with Dr. {doctorName} at {hospitalName}
          </DialogDescription>
        </DialogHeader>
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
                  Partial Payment (₹{consultationFee * 0.1})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleBookAppointment} className="w-full">
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
