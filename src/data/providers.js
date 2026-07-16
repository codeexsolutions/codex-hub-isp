// Catálogo demo de provedores. Na prática, o endpoint getProvider(codigo)
// deve devolver esta mesma estrutura vinda do backend.
const color = "#04e247"

export const PROVIDERS = {
  "1001": { codigo: "1001", nome: "NetFibra", tag: "Fibra de verdade", accent: "#6C4CF1", accent2: "#9B7BFF", glyph: "◈" },
  "2002": { codigo: "2002", nome: "VeloNet", tag: "Velocidade que conecta", accent: "#00A870", accent2: "#4BD8A0", glyph: "⏻" },
  "3003": { codigo: "3003", nome: "GigaMais", tag: "Sua internet, sem limites", accent: "#FF6A2C", accent2: "#FF9A5C", glyph: "⬢" },
};

export const DEFAULT_PROVIDER = {
  codigo: "0000",
  nome: "HUB Demo",
  tag: "Central do Assinante",
  accent: "#DB5F00",
  accent2: "#000000",
  glyph: "◉",
  lgoo_url: ""
};
