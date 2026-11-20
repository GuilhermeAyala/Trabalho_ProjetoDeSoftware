export interface CoordenadasDTO {
    latitude: number;
    longitude: number;
}

export interface HemocentroDTO {
    id: number;
    nome: string;
    endereco: string;
    latitude: number;
    longitude: number;
    // Só é preenchida quando o usuário informa sua localização na consulta.
    distanciaKm?: number;
}
