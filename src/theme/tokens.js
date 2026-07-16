// Tokens neutros do "chrome" do app. O accent vem do provedor (white-label).
export const buildTokens = (dark) =>
  dark
    ? { bg: "#0B0F17", surface: "#141A24", surface2: "#1C2431", border: "#26303F", text: "#EAF0F7", sub: "#8A97A8", inputBg: "#1C2431" }
    : { bg: "#EEF1F6", surface: "#FFFFFF", surface2: "#F4F6FA", border: "#E4E8EF", text: "#101828", sub: "#66717F", inputBg: "#F4F6FA" };

// cores semânticas fixas
export const STATUS = {
  ok: "#12B76A",
  danger: "#F04438",
  warn: "#F79009",
};

// aplica um alpha a um hex (#RRGGBB ou #RGB) -> rgba()
export const hexA = (hex, a) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
