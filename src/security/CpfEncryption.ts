import {
    createCipheriv,
    createDecipheriv,
    createHmac,
    randomBytes,
    timingSafeEqual,
} from "node:crypto";

const VERSAO = "v1";
const TAMANHO_IV = 12;

function segredoRaiz() {
    const segredo = process.env.CPF_ENCRYPTION_KEY ?? process.env.HEMOCENTRO_AUTH_SECRET;
    if (!segredo || segredo.length < 32) {
        throw new Error("CPF_ENCRYPTION_KEY deve ter pelo menos 32 caracteres");
    }
    return segredo;
}

function derivarChave(finalidade: "criptografia" | "busca") {
    return createHmac("sha256", segredoRaiz())
        .update(`vitta:cpf:${finalidade}:${VERSAO}`)
        .digest();
}

export function normalizarCpf(cpf: string) {
    return cpf.replace(/\D/g, "");
}

export function prefixoBuscaCpf(cpf: string) {
    const normalizado = normalizarCpf(cpf);
    if (!normalizado) throw new Error("CPF vazio não pode ser protegido");
    const hash = createHmac("sha256", derivarChave("busca"))
        .update(normalizado)
        .digest("base64url");
    return `${VERSAO}:${hash}:`;
}

export function criptografarCpf(cpf: string) {
    const normalizado = normalizarCpf(cpf);
    if (!normalizado) throw new Error("CPF vazio não pode ser protegido");

    const iv = randomBytes(TAMANHO_IV);
    const cipher = createCipheriv("aes-256-gcm", derivarChave("criptografia"), iv);
    const criptografado = Buffer.concat([
        cipher.update(normalizado, "utf8"),
        cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    return [
        prefixoBuscaCpf(normalizado).slice(0, -1),
        iv.toString("base64url"),
        tag.toString("base64url"),
        criptografado.toString("base64url"),
    ].join(":");
}

export function cpfEstaCriptografado(valor: string) {
    const [versao, hash, iv, tag, conteudo, ...excedentes] = valor.split(":");
    const base64Url = /^[A-Za-z0-9_-]+$/;
    return excedentes.length === 0
        && versao === VERSAO
        && Boolean(hash && base64Url.test(hash) && Buffer.from(hash, "base64url").length === 32)
        && Boolean(iv && base64Url.test(iv) && Buffer.from(iv, "base64url").length === TAMANHO_IV)
        && Boolean(tag && base64Url.test(tag) && Buffer.from(tag, "base64url").length === 16)
        && Boolean(conteudo && base64Url.test(conteudo));
}

export function descriptografarCpf(valor: string) {
    if (!cpfEstaCriptografado(valor)) throw new Error("CPF armazenado em formato inválido");
    const [, hash, ivBase64, tagBase64, conteudoBase64] = valor.split(":");
    if (!hash || !ivBase64 || !tagBase64 || !conteudoBase64) {
        throw new Error("CPF armazenado em formato inválido");
    }

    const decipher = createDecipheriv(
        "aes-256-gcm",
        derivarChave("criptografia"),
        Buffer.from(ivBase64, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(tagBase64, "base64url"));
    const cpf = Buffer.concat([
        decipher.update(Buffer.from(conteudoBase64, "base64url")),
        decipher.final(),
    ]).toString("utf8");

    const hashEsperado = Buffer.from(prefixoBuscaCpf(cpf).split(":")[1] ?? "", "base64url");
    const hashRecebido = Buffer.from(hash, "base64url");
    if (
        hashEsperado.length !== hashRecebido.length
        || !timingSafeEqual(hashEsperado, hashRecebido)
    ) {
        throw new Error("CPF armazenado foi adulterado");
    }

    return cpf;
}
