import { api } from '@/services/api';
import type { DonorProfile } from '@/types/donor';

export async function buscarPerfilDoador(doadorId: number): Promise<DonorProfile> {
  const { data } = await api.get<DonorProfile>(`/doadores/${doadorId}`);
  return data;
}
