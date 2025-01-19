export const calculateAppointmentTime = (tokenNumber: number) => {
  const baseTime = new Date();
  baseTime.setHours(10, 0, 0, 0); // Start time: 10:00 AM
  const minutesPerPatient = 15; // 15 minutes per patient
  const additionalMinutes = (tokenNumber - 1) * minutesPerPatient;
  baseTime.setMinutes(baseTime.getMinutes() + additionalMinutes);
  return baseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const validateAppointmentDate = (selectedDate: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDateObj = new Date(selectedDate);
  return selectedDateObj >= today;
};