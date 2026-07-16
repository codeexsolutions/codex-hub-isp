import { ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { STATUS, hexA } from "../../theme/tokens";

export function StatusPill({ status }) {
  const { A } = useTheme();
  const map = {
    aberta: { txt: "Em aberto", c: A },
    vencida: { txt: "Vencida", c: STATUS.danger },
    paga: { txt: "Paga", c: STATUS.ok },
  }[status] || { txt: status, c: A };
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 20, color: map.c, background: hexA(map.c, 0.12) }}>
      {map.txt}
    </span>
  );
}

export function Toggle({ on, onClick }) {
  const { A, t } = useTheme();
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      style={{ width: 46, height: 28, borderRadius: 20, border: "none", cursor: "pointer", position: "relative", background: on ? A : t.border, transition: "background .2s", flexShrink: 0 }}
    >
      <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: 12, background: "#fff", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.3)" }} />
    </button>
  );
}

export function Legend({ color, label }) {
  const { t } = useTheme();
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.sub }}>
      <span style={{ width: 9, height: 9, borderRadius: 3, background: color }} />
      {label}
    </span>
  );
}

export function MiniStat({ icon, label, value }) {
  const { t } = useTheme();
  return (
    <div style={{ flex: 1, padding: "13px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: t.sub }}>{icon}{label}</div>
      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: t.text, marginTop: 3 }}>{value}</div>
    </div>
  );
}

export function InfoRow({ icon: Icon, label, value, last }) {
  const { A, t } = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: last ? "none" : `1px solid ${t.border}` }}>
      <Icon size={18} color={A} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11.5, color: t.sub }}>{label}</div>
        <div style={{ fontSize: 14, color: t.text, fontWeight: 600, marginTop: 1, wordBreak: "break-word" }}>{value}</div>
      </div>
    </div>
  );
}

export function ConfigRow({ icon: Icon, label, onClick, last }) {
  const { A, t } = useTheme();
  return (
    <button
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", width: "100%", background: "none", border: "none", borderBottom: last ? "none" : `1px solid ${t.border}`, cursor: "pointer", textAlign: "left" }}
    >
      <Icon size={19} color={A} />
      <span style={{ flex: 1, color: t.text, fontWeight: 600, fontSize: 14 }}>{label}</span>
      <ChevronRight size={18} color={t.sub} />
    </button>
  );
}

export function Atalho({ icon: Icon, label, onClick }) {
  const { A, t } = useTheme();
  return (
    <button
      onClick={onClick}
      style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 20, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start", cursor: "pointer", padding: 16 }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 12, background: hexA(A, 0.12), display: "grid", placeItems: "center" }}>
        <Icon size={20} color={A} />
      </div>
      <span style={{ fontWeight: 600, fontSize: 13.5, color: t.text }}>{label}</span>
    </button>
  );
}
