import type { CoordenadasDTO, HemocentroDTO } from "../dto/HemocentroDTO";
import { HemocentroRepository } from "../repository/HemocentroRepository";

export class HemocentroService {
    constructor(private readonly hemocentroRepository = new HemocentroRepository()) {}

    async listarHemocentros(coordenadas?: CoordenadasDTO): Promise<HemocentroDTO[]> {
        const hemocentros = await this.hemocentroRepository.listar();

        if (!coordenadas) {
            return hemocentros;
        }

        this.validarCoordenadas(coordenadas);

        // A distância é calculada no service para manter o repository dedicado
        // somente à persistência. A API de mapas pode substituir este cálculo depois.
        return hemocentros
            .map((hemocentro) => ({
                ...hemocentro,
                distanciaKm: Number(this.calcularDistanciaKm(coordenadas, hemocentro).toFixed(2)),
            }))
            .sort((a, b) => a.distanciaKm - b.distanciaKm);
    }

    async buscarHemocentro(id: number) {
        this.validarId(id);
        return this.hemocentroRepository.buscarPorId(id);
    }

    private validarId(id: number) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("Id do hemocentro inválido");
        }
    }

    private validarCoordenadas({ latitude, longitude }: CoordenadasDTO) {
        if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
            throw new Error("Latitude inválida");
        }

        if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
            throw new Error("Longitude inválida");
        }
    }

    private calcularDistanciaKm(origem: CoordenadasDTO, destino: CoordenadasDTO) {
        const raioTerraKm = 6371;
        const converterParaRadianos = (graus: number) => graus * Math.PI / 180;
        const diferencaLatitude = converterParaRadianos(destino.latitude - origem.latitude);
        const diferencaLongitude = converterParaRadianos(destino.longitude - origem.longitude);
        const latitudeOrigem = converterParaRadianos(origem.latitude);
        const latitudeDestino = converterParaRadianos(destino.latitude);

        const haversine = Math.sin(diferencaLatitude / 2) ** 2
            + Math.cos(latitudeOrigem)
            * Math.cos(latitudeDestino)
            * Math.sin(diferencaLongitude / 2) ** 2;

        return 2 * raioTerraKm * Math.asin(Math.sqrt(haversine));
    }
}
