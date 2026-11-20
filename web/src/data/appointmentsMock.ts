import type { Appointment } from '@/types/domain';

export const appointmentsMock: Appointment[] = [
  {
    id: 'appointment-1',
    bloodCenter: 'Hospital Santa Lucia',
    date: '24/10/2025',
    time: '08:00',
    status: 'confirmed',
  },
  {
    id: 'appointment-2',
    bloodCenter: 'Campanha DOE+',
    date: '05/11/2025',
    time: '16:00',
    status: 'pending',
  },
];
