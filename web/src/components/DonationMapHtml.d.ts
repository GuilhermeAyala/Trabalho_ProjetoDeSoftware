import type { HemocentroPublico } from '@/services/agendamentoApi';
export type DonationMapPoint = Pick<HemocentroPublico, 'id' | 'nome' | 'endereco' | 'latitude' | 'longitude'>;
export declare function createDonationMapHtml(hemocentros: DonationMapPoint[]): string;
//# sourceMappingURL=DonationMapHtml.d.ts.map