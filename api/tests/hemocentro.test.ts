import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { test } from 'node:test';

process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5433/test';
process.env.HEMOCENTRO_AUTH_SECRET = 'segredo_de_teste_para_hemocentro_2026_123456';
process.env.CPF_ENCRYPTION_KEY = 'segredo_de_teste_para_criptografia_cpf_2026';

type EstoqueRepository = import('../src/repository/EstoqueRepository').EstoqueRepository;

function token(hemocentroId: number, exp: number) {
  const payload = Buffer.from(JSON.stringify({ hemocentroId, exp })).toString('base64url');
  const assinatura = createHmac('sha256', process.env.HEMOCENTRO_AUTH_SECRET!).update(payload).digest('base64url');
  return `${payload}.${assinatura}`;
}

test('token identifica o hemocentro e rejeita adulteração e expiração', async () => {
  const { verificarTokenHemocentro } = await import('../src/service/HemocentroAuthService');
  const valido = token(7, Date.now() + 60_000);
  assert.equal(verificarTokenHemocentro(valido), 7);
  assert.equal(verificarTokenHemocentro(token(7, Date.now() - 1)), null);
  const [payload, assinatura] = valido.split('.');
  const adulterado = Buffer.from(JSON.stringify({ hemocentroId: 8, exp: Date.now() + 60_000 })).toString('base64url');
  assert.equal(verificarTokenHemocentro(`${adulterado}.${assinatura}`), null);
  assert.equal(verificarTokenHemocentro(`${payload}.invalida`), null);
});

test('estoque exige tipo, quantidade e motivo antes de escrever', async () => {
  const { EstoqueService } = await import('../src/service/EstoqueService');
  let chamadas = 0;
  const repository = {
    movimentar: async (hemocentroId: number, dados: unknown) => {
      chamadas++;
      return { hemocentroId, dados };
    },
  } as unknown as EstoqueRepository;
  const service = new EstoqueService(repository);
  assert.throws(() => service.movimentar(3, { tipoSanguineo: 'O+', tipo: 'BAIXA', quantidade: 0, motivo: 'uso' }), /quantidade/);
  assert.throws(() => service.movimentar(3, { tipoSanguineo: 'X+' as 'O+', tipo: 'BAIXA', quantidade: 1, motivo: 'uso' }), /sanguíneo/);
  assert.throws(() => service.movimentar(3, { tipoSanguineo: 'O+', tipo: 'BAIXA', quantidade: 1, motivo: 'x' }), /motivo/);
  assert.equal(chamadas, 0);
  const resultado = await service.movimentar(3, { tipoSanguineo: 'O+', tipo: 'BAIXA', quantidade: 2, motivo: ' uso clínico ' });
  assert.deepEqual(resultado, { hemocentroId: 3, dados: { tipoSanguineo: 'O+', tipo: 'BAIXA', quantidade: 2, motivo: 'uso clínico' } });
  assert.equal(chamadas, 1);
});

test('CPF é criptografado com valor aleatório e pode ser recuperado somente com a chave', async () => {
  const {
    cpfEstaCriptografado,
    criptografarCpf,
    descriptografarCpf,
    prefixoBuscaCpf,
  } = await import('../src/security/CpfEncryption');
  const cpf = '123.456.789-01';
  const primeiro = criptografarCpf(cpf);
  const segundo = criptografarCpf(cpf);

  assert.equal(cpfEstaCriptografado(primeiro), true);
  assert.notEqual(primeiro, segundo);
  assert.equal(primeiro.includes('12345678901'), false);
  assert.equal(descriptografarCpf(primeiro), '12345678901');
  assert.equal(prefixoBuscaCpf(cpf), prefixoBuscaCpf('12345678901'));

  const chaveCorreta = process.env.CPF_ENCRYPTION_KEY;
  process.env.CPF_ENCRYPTION_KEY = 'outra_chave_de_teste_com_mais_de_32_caracteres';
  assert.throws(() => descriptografarCpf(primeiro));
  process.env.CPF_ENCRYPTION_KEY = chaveCorreta;
});
