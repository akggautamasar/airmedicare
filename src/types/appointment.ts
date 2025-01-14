export interface AppointmentSlot {
  id: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  tokenNumber: number;
}

export interface AppointmentBooking {
  id: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  appointmentDate: string;
  tokenNumber: number;
  scheduledTime: string;
  paymentStatus: 'partial' | 'full' | 'pending';
  paymentAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
}