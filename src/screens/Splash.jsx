import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wifi } from "lucide-react";

export default function Splash() {
  const nav = useNavigate();
  useEffect(() => {
    const id = setTimeout(() => nav("/provedor", { replace: true }), 2400);
    return () => clearTimeout(id);
  }, [nav]);

  return (
    <div style={{ flex: 1, background: "radial-gradient(120% 90% at 50% 12%, #14203A 0%, #0B0F17 60%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
      <div style={{ position: "relative", width: 130, height: 130, display: "grid", placeItems: "center" }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1.5px solid rgba(91,141,239,.35)", animation: `pulse 2.4s ${i * 0.5}s ease-out infinite` }} />
        ))}
        <div style={{ width: 78, height: 78, borderRadius: 22, display: "grid", placeItems: "center", background: "linear-gradient(135deg,#3B82F6,#8B5CF6)", boxShadow: "0 12px 40px rgba(59,130,246,.5)", animation: "rise .9s cubic-bezier(.2,.8,.2,1)" }}>
          <Wifi size={38} color="#fff" strokeWidth={2.4} />
        </div>
      </div>
      <div style={{ textAlign: "center", animation: "fadeUp 1s .3s both" }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 32, letterSpacing: 6, color: "#fff" }}>CODEX</div>
        <div style={{ marginTop: 8, fontSize: 12.5, letterSpacing: 3, color: "#5B8DEF", fontWeight: 600 }}>TECNOLOGIA</div>
      </div>
      <div style={{ position: "absolute", bottom: 34, fontSize: 11, color: "#3A4658", letterSpacing: 1 }}>powered by Codex</div>
    </div>
  );
}
