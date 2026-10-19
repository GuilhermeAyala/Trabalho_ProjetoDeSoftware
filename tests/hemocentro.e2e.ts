import assert from "node:assert/strict";

const API_URL = process.env.E2E_API_URL ?? "http://localhost:3000";

type Json = Record<string, any>;

async function request(path: string, options: RequestInit = {}, expected = 200): Promise<Json> {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: { "Content-Type": "application/json", ...options.headers },
    });
    const body = await response.json().catch(() => ({}));
    assert.equal(response.status, expected, `${options.method ?? "GET"} ${path}: ${JSON.stringify(body)}`);
    return body;
}

function auth(token: string) {
    return { Authorization: `Bearer ${token}` };
}

async function main() {
    process.env.DATABASE_URL ??= "postgresql://vitta:vitta_dev@localhost:5433/vitta?schema=public";
    const { prisma } = await import("../src/config/prisma");
    const sufixo = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const emailsHemocentro = [`e2e-a-${sufixo}@vitta.local`, `e2e-b-${sufixo}@vitta.local`];
    const emailsDoador = [`e2e-d1-${sufixo}@vitta.local`, `e2e-d2-${sufixo}@vitta.local`];
    const idsHemocentro: number[] = [];
    const idsDoador: number[] = [];

    try {
        const api = await fetch(`${API_URL}/`);
        assert.equal(api.status, 200);

        const cadastrarHemocentro = async (indice: number) => {
            const resultado = await request("/hemocentros/cadastro", {
                method: "POST",
                body: JSON.stringify({
                    nome: `Hemocentro E2E ${indice + 1}`,
                    endereco: `Rua de Teste ${indice + 1}, 100, Brasília - DF`,
                    latitude: -15.78 - indice * 0.01,
                    longitude: -47.93 - indice * 0.01,
                    email: emailsHemocentro[indice],
                    senha: "senha-e2e-123",
                }),
            }, 201);
            idsHemocentro.push(resultado.hemocentro.id);
            assert.equal(typeof resultado.token, "string");
            return resultado;
        };

        const centroA = await cadastrarHemocentro(0);
        const centroB = await cadastrarHemocentro(1);

        const loginA = await request("/hemocentros/login", {
            method: "POST",
            body: JSON.stringify({ email: emailsHemocentro[0], senha: "senha-e2e-123" }),
        });
        assert.equal(loginA.hemocentro.id, centroA.hemocentro.id);
        await request("/hemocentros/login", {
            method: "POST",
            body: JSON.stringify({ email: emailsHemocentro[0], senha: "incorreta" }),
        }, 401);

        const perfilA = await request("/hemocentros/me", { headers: auth(loginA.token) });
        assert.equal(perfilA.nome, "Hemocentro E2E 1");

        const estoqueInicialA = await request("/hemocentros/me/estoque", { headers: auth(loginA.token) });
        assert.equal(estoqueInicialA.length, 8);
        assert.ok(estoqueInicialA.every((item: Json) => item.quantidade === 0));

        await request("/hemocentros/me/estoque/movimentacoes", {
            method: "POST", headers: auth(loginA.token),
            body: JSON.stringify({ tipoSanguineo: "O+", tipo: "ENTRADA", quantidade: 10, motivo: "Entrada E2E" }),
        });
        await request("/hemocentros/me/estoque/movimentacoes", {
            method: "POST", headers: auth(loginA.token),
            body: JSON.stringify({ tipoSanguineo: "O+", tipo: "BAIXA", quantidade: 3, motivo: "Baixa E2E" }),
        });
        await request("/hemocentros/me/estoque/movimentacoes", {
            method: "POST", headers: auth(loginA.token),
            body: JSON.stringify({ tipoSanguineo: "O+", tipo: "BAIXA", quantidade: 100, motivo: "Saldo insuficiente" }),
        }, 400);
        const estoqueA = await request("/hemocentros/me/estoque", { headers: auth(loginA.token) });
        assert.equal(estoqueA.find((item: Json) => item.tipoSanguineo === "O+").quantidade, 7);
        const estoqueB = await request("/hemocentros/me/estoque", { headers: auth(centroB.token) });
        assert.equal(estoqueB.find((item: Json) => item.tipoSanguineo === "O+").quantidade, 0);
        const historicoA = await request("/hemocentros/me/estoque/movimentacoes", { headers: auth(loginA.token) });
        assert.equal(historicoA.length, 2);

        const data = "2099-12-31";
        const horario = "13:30";
        const vaga = await request("/hemocentros/me/vagas", {
            method: "POST", headers: auth(loginA.token),
            body: JSON.stringify({ data, horario, capacidade: 1 }),
        }, 201);
        assert.equal(vaga.capacidade, 1);
        const vagasPublicas = await request(`/hemocentros/${centroA.hemocentro.id}/vagas`);
        assert.equal(vagasPublicas.length, 1);

        const cadastrarDoador = async (indice: number) => {
            const resultado = await request("/doadores", {
                method: "POST",
                body: JSON.stringify({
                    nome: `Doador E2E ${indice + 1}`,
                    email: emailsDoador[indice],
                    DataNascimento: "1995-01-01T00:00:00.000Z",
                    password: "senha-e2e",
                    cpf: `9999999990${indice}`,
                    sexo: "Masculino",
                    tipoSanguineo: "O+",
                }),
            }, 201);
            idsDoador.push(resultado.doador.id);
            return resultado.doador;
        };

        const doador1 = await cadastrarDoador(0);
        const doador2 = await cadastrarDoador(1);
        const agendamentoCriado = await request("/agendamentos", {
            method: "POST",
            body: JSON.stringify({ doadorId: doador1.id, hemocentroId: centroA.hemocentro.id, data, horario }),
        }, 201);
        const agendamentoId = agendamentoCriado.agendamento.id;

        await request("/agendamentos", {
            method: "POST",
            body: JSON.stringify({ doadorId: doador2.id, hemocentroId: centroA.hemocentro.id, data, horario }),
        }, 400);

        const agendaA = await request("/hemocentros/me/agendamentos", { headers: auth(loginA.token) });
        const agendaB = await request("/hemocentros/me/agendamentos", { headers: auth(centroB.token) });
        assert.equal(agendaA.length, 1);
        assert.equal(agendaB.length, 0);
        await request(`/hemocentros/me/agendamentos/${agendamentoId}`, { headers: auth(centroB.token) }, 404);
        await request(`/hemocentros/${centroB.hemocentro.id}/agendamentos`, { headers: auth(loginA.token) }, 403);
        await request(`/hemocentros/me/agendamentos/${agendamentoId}/status`, {
            method: "PATCH", headers: auth(loginA.token), body: JSON.stringify({ status: "CONFIRMADO" }),
        });
        await request(`/hemocentros/me/agendamentos/${agendamentoId}/status`, {
            method: "PATCH", headers: auth(loginA.token), body: JSON.stringify({ status: "REALIZADO" }),
        });
        const doadorComPontos = await request(`/doadores/${doador1.id}`);
        assert.equal(doadorComPontos.pontosDoacao, 50);
        await request(`/hemocentros/me/agendamentos/${agendamentoId}/status`, {
            method: "PATCH", headers: auth(loginA.token), body: JSON.stringify({ status: "REALIZADO" }),
        });
        const doadorSemDuplicacao = await request(`/doadores/${doador1.id}`);
        assert.equal(doadorSemDuplicacao.pontosDoacao, 50);
        await request(`/hemocentros/me/agendamentos/${agendamentoId}/status`, {
            method: "PATCH", headers: auth(loginA.token), body: JSON.stringify({ status: "CANCELADO" }),
        }, 400);

        console.log("E2E hemocentro concluído: cadastro, login, estoque, vagas, agenda, isolamento e pontos validados.");
    } finally {
        if (idsHemocentro.length || idsDoador.length) {
            await prisma.$transaction(async (tx) => {
                await tx.movimentacaoEstoque.deleteMany({ where: { estoque: { hemocentroId: { in: idsHemocentro } } } });
                await tx.agendamento.deleteMany({ where: { OR: [
                    { hemocentroId: { in: idsHemocentro } },
                    { doadorId: { in: idsDoador } },
                ] } });
                await tx.vaga.deleteMany({ where: { hemocentroId: { in: idsHemocentro } } });
                await tx.estoque.deleteMany({ where: { hemocentroId: { in: idsHemocentro } } });
                await tx.hemocentroConta.deleteMany({ where: { hemocentroId: { in: idsHemocentro } } });
                await tx.hemocentro.deleteMany({ where: { id: { in: idsHemocentro } } });
                await tx.doador.deleteMany({ where: { id: { in: idsDoador } } });
            });
        }
        await prisma.$disconnect();
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
