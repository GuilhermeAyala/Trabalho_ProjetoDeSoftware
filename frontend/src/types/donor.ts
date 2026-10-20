export type DonorProfile = {
  id: number;
  nome: string;
  email: string;
  sexo: string;
  tipoSanguineo: string;
  pontosDoacao: number;
  doacoesRealizadas: number;
};

export type DonorSession = { doador: DonorProfile; token: string };
