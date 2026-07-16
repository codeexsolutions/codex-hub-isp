export const brl = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// "2026-07-10" -> "10/07/2026"
export const dataBR = (iso) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export const primeiroNome = (n) => {
  const p = (n || "").split(" ")[0];
  return p ? p.charAt(0) + p.slice(1).toLowerCase() : "";
};

export const nomeCapitalizado = (n) =>
  (n || "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");

export const iniciais = (n) =>
  (n || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

export function parseDateOnly(data) {
    const [ano, mes, dia] = data.split("-").map(Number);
    return new Date(ano, mes - 1, dia);
}    
// status de uma fatura a partir dos campos da API
export const statusFatura = (f, hojeISO) => {
  if (f.dataPagamento) return "paga";
  const hoje = hojeISO
      ? parseDateOnly(hojeISO.toLocaleString())
      : new Date().toLocaleDateString();

  hoje.setHours(0, 0, 0, 0);

  const vencimento = parseDateOnly(f.dataVencimento);
  return parseDateOnly(f.dataVencimento) < hoje ? "vencida" : "aberta" // parseDateOnly(f.dataVencimento) == hoje ? "vence hoje" : "aberta";
};

// máscara progressiva CPF (11) / CNPJ (14)
export const maskCpfCnpj = (v) => {
  const d = (v || "").replace(/\D/g, "");
  if (d.length <= 11)
    return d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return d
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

export const soDigitos = (v) => (v || "").replace(/\D/g, "");
export const docValido = (v) => [11, 14].includes(soDigitos(v).length);

// abrevia "07/2026" -> "Jul"
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
export const mesAbrev = (label) => MESES[Number(label.split("/")[0]) - 1] || label;
