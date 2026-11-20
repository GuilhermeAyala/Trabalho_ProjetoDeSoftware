export type Voucher = {
    id: string;
    brand: string;
    title: string;
    tag: string;
    expiresAt: string;
    acquiredAt: string;
    code: string;
    accentColor: string;
    iconName: string;
};
export type DonationHistoryItem = {
    id: string;
    date: string;
    time: string;
    place: string;
    points: number;
};
export type BloodCenter = {
    id: string;
    name: string;
    address: string;
    distance: string;
    nextSlot: string;
};
export type Appointment = {
    id: string;
    bloodCenter: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending';
};
export type FaqItem = {
    id: string;
    title: string;
    description: string;
    icon: string;
};
//# sourceMappingURL=domain.d.ts.map