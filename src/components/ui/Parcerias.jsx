import { ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { hexA } from "../../theme/tokens";

export default function Parcerias({ items = [], onOpen }) {
  const { t } = useTheme();
  if (!items.length) return null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: t.text }}>
          Parcerias e vantagens
        </div>
        <span style={{ display: "flex", alignItems: "center", fontSize: 12.5, color: t.sub, cursor: "default" }}>
          Ver todas <ChevronRight size={15} />
        </span>
      </div>

      <div className="hscroll" style={{ display: "flex", gap: 12, overflowX: "auto", margin: "0 -18px", padding: "0 18px 6px" }}>
        {items.map((p) => (
          <button
            key={p.id}
            onClick={() => onOpen?.(p)}
            style={{ flex: "0 0 auto", width: 150, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 16, textAlign: "left", cursor: "pointer" }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", fontSize: 24, background: hexA(p.cor, 0.14) }}>
              {p.emoji}
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: t.text, marginTop: 10 }}>{p.nome}</div>
            <div style={{ fontSize: 12, color: t.sub, marginTop: 2, lineHeight: 1.35 }}>{p.beneficio}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
