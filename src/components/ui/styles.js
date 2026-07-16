// Helpers de estilo. Recebem os tokens `t` (do useTheme) e devolvem objetos de style.
export const card = (t) => ({
  background: t.surface,
  border: `1px solid ${t.border}`,
  borderRadius: 20,
  padding: 18,
});

export const inputStyle = (t, focus) => ({
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: `1.5px solid ${t.border}`,
  background: t.inputBg,
  color: t.text,
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  "--focus": focus || t.text,
});

export const lbl = (t) => ({
  fontSize: 12,
  fontWeight: 600,
  color: t.sub,
  display: "block",
  marginBottom: 6,
});

export const btnPrimary = (A) => ({
  width: "100%",
  padding: 14,
  borderRadius: 14,
  border: "none",
  background: A,
  color: "#fff",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontFamily: "inherit",
});

export const btnGhost = (t) => ({
  width: 52,
  padding: 14,
  borderRadius: 14,
  border: `1.5px solid ${t.border}`,
  background: "transparent",
  color: t.text,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontWeight: 600,
  fontSize: 14,
});

export const iconBtn = (t) => ({
  width: 40,
  height: 40,
  borderRadius: 12,
  background: t.surface2,
  border: `1px solid ${t.border}`,
  color: t.text,
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  position: "relative",
  flexShrink: 0,
});

export const errStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  color: "#F04438",
  fontSize: 12.5,
  marginTop: 8,
  fontWeight: 500,
};
