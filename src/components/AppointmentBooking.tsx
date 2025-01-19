import * as React from "react";
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
import { supabase } from '@/integrations/supabase/client';
import { initializeRazorpay, processPayment, createRazorpayOrder } from "@/lib/razorpay";

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
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [paymentType, setPaymentType] = React.useState<"full" | "partial">("full");
  const { user } = useAuth();

  const calculateAppointmentTime = (tokenNumber: number) => {
    const baseTime = new Date();
    baseTime.setHours(10, 0, 0, 0); // Start time: 10:00 AM
    const minutesPerPatient = 15; // 15 minutes per patient
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

      if (!selectedDate) {
        toast.error("Please select an appointment date");
        return;
      }

      // Validate selected date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDateObj = new Date(selectedDate);
      if (selectedDateObj < today) {
        toast.error("Please select a future date");
        return;
      }

      // Initialize Razorpay
      const res = await initializeRazorpay();
      if (!res) {
        toast.error("Razorpay SDK failed to load");
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

      if (fetchError) {
        console.error('Error fetching appointments:', fetchError);
        toast.error("Failed to check available slots");
        return;
      }

      const tokenNumber = existingAppointments && existingAppointments.length > 0
        ? existingAppointments[0].token_number + 1
        : 1;

      const scheduledTime = calculateAppointmentTime(tokenNumber);
      const paymentAmount = paymentType === 'partial' 
        ? Math.round(consultationFee * 0.1) 
        : consultationFee;

      // Create Razorpay order
      const order = await createRazorpayOrder(paymentAmount);
      if (!order) {
        toast.error("Failed to create payment order");
        return;
      }
      
      // Process payment with user details
      const userName = user.user_metadata?.full_name || user.name || user.email?.split('@')[0] || '';
      const userPhone = user.user_metadata?.phone || user.phone || '';
      
      const paymentResponse = await processPayment({
        amount: paymentAmount,
        orderId: order.id,
        prefill: {
          name: userName,
          email: user.email,
          contact: userPhone,
        },
      });

      if (!paymentResponse) {
        toast.error("Payment failed");
        return;
      }

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
            razorpay_order_id: order.id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            status: 'confirmed'
          }
        ]);

      if (insertError) {
        console.error('Error creating appointment:', insertError);
        toast.error("Failed to book appointment");
        return;
      }

      toast.success(`Appointment booked successfully! Your token number is ${tokenNumber}`);
      setIsOpen(false);
    } catch (error) {
      console.error('Error in handleBookAppointment:', error);
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Book Appointment</Button>
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
                  Partial Payment (₹{Math.round(consultationFee * 0.1)})
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