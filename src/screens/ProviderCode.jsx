import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gauge, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { getProvider } from "../api/client";
import { inputStyle, btnPrimary, errStyle } from "../components/ui/styles";

export default function ProviderCode() {
  const { t, setProvider } = useTheme();
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const entrar = async () => {
    if (!code.trim()) { setErro("Informe o código do provedor."); return; }
    setErro(""); setLoading(true);
    try {
      const p = await getProvider(code.trim());
      setProvider(p);
      nav("/login");
    } catch {
      setErro("Não foi possível localizar o provedor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "64px 28px 32px", background: t.bg }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#2563EB,#7C3AED)", display: "grid", placeItems: "center", boxShadow: "0 8px 24px rgba(37,99,235,.35)" }}>
          <Gauge size={24} color="#fff" strokeWidth={2.4} />
        </div>
        <div>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 22, color: t.text, lineHeight: 1 }}>
            hub<span style={{ color: "#2563EB" }}>ISP</span>
          </div>
          <div style={{ fontSize: 11, color: t.sub, letterSpacing: 1.5, marginTop: 3 }}>CENTRAL DO ASSINANTE</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 340 }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 27, fontWeight: 800, margin: 0, color: t.text, lineHeight: 1.2 }}>
          Identifique seu provedor
        </h1>
        <p style={{ color: t.sub, fontSize: 14.5, marginTop: 10, lineHeight: 1.55 }}>
          Digite o código fornecido pela sua operadora para carregar sua central personalizada.
        </p>

        <label style={{ fontSize: 12.5, fontWeight: 600, color: t.sub, marginTop: 28, display: "block" }}>Código do provedor</label>
        <input
          className="fld"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9A-Za-z]/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && entrar()}
          placeholder="Ex.: 1"
          style={{ ...inputStyle(t), marginTop: 8, letterSpacing: 4, fontSize: 18, textAlign: "center", fontWeight: 600 }}
        />
        {erro && <div style={errStyle}><AlertCircle size={14} /> {erro}</div>}

        <button className="btn-a" onClick={entrar} disabled={loading} style={{ ...btnPrimary("#2563EB"), marginTop: 22 }}>
          {loading ? <RefreshCw size={18} className="spin" /> : <>Continuar <ArrowRight size={18} /></>}
        </button>

        <div style={{ marginTop: 20, fontSize: 12, color: t.sub, textAlign: "center" }}>
      {/*     Códigos demo:&nbsp;
          {["1001", "2002", "3003"].map((c) => (
            <button key={c} onClick={() => setCode(c)} style={{ background: "none", border: "none", color: "#2563EB", fontWeight: 600, cursor: "pointer", padding: "0 4px", fontSize: 12 }}>
              {c}
            </button>
          ))} */}
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: 11, color: t.sub }}>Codex · HUB ISP · v1.0</div>
    </div>
  );
}
