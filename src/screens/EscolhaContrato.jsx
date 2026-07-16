// src/screens/EscolhaContrato.jsx
// Exibida quando o login retorna uma LISTA de contratos (em vez de token/cliente).
// O cliente escolhe um contrato -> carrega os dados daquele contrato -> vai ao dashboard.
//
// Recebe via router state: { contratos, cpfCnpj, codigoProvedor }
// (enviado pelo Login). Se aberta direto, usa uma lista de exemplo.

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Wifi, MapPin, ArrowLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { hexA } from "../theme/tokens";
import { card } from "../components/ui/styles";
import { nomeCapitalizado } from "../utils/format";

// fallback caso a tela seja aberta sem state (ex.: refresh na URL)
const EXEMPLO = [
  { id: 71066, nome: "EVALDO MORAIS DOS SANTOS", login: "evaldo.santos", endereco: "TRAVESSA MESQUITA, 638", complemento: "", bairro: "GENIBAÚ", cidade: "FORTALEZA", uf: "CE" },
  { id: 71067, nome: "EVALDO MORAIS DOS SANTOS", login: "evaldo.loja", endereco: "AV. BEZERRA DE MENEZES, 1200", complemento: "Loja 3", bairro: "SÃO GERARDO", cidade: "FORTALEZA", uf: "CE" },
];

export default function EscolhaContrato() {
  const { A, provider, t } = useTheme();
  const { selecionarContrato } = useAuth();
  const { showToast } = useToast();
  const nav = useNavigate();
  const { state } = useLocation();

  const contratos = state?.contratos?.length ? state.contratos : EXEMPLO;
  const cpfCnpj = state?.cpfCnpj || "";
  const codigoProvedor = state?.codigoProvedor || provider.codigo;

  const [loadingId, setLoadingId] = useState(null);

  const escolher = async (c) => {
    if (loadingId) return;
    setLoadingId(c.id);
    try {
      await selecionarContrato({ codigoProvedor, cpfCnpj, contratoId: c.id });
      nav("/app", { replace: true });
    } catch (e) {
      showToast(e.message || "Não foi possível abrir o contrato", "alert");
      setLoadingId(null);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: t.bg, minHeight: 0 }}>
      {/* header temado */}
      <div style={{ background: `linear-gradient(150deg, ${A} 0%, ${provider.accent2} 100%)`, color: "#fff", padding: "52px 24px 26px", position: "relative", flexShrink: 0, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <button onClick={() => nav("/login")} style={{ position: "absolute", top: 18, left: 18, width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,.2)", border: "none", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 23, marginTop: 8 }}>Selecione o contrato</div>
        <div style={{ fontSize: 13.5, opacity: 0.92, marginTop: 4 }}>
          Você tem {contratos.length} contratos ativos. Escolha qual deseja acessar.
        </div>
      </div>

      {/* lista */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "18px 18px 28px", display: "flex", flexDirection: "column", gap: 12 }}>
        {contratos.map((c) => {
          const loading = loadingId === c.id;
          const endereco = `${c.endereco}${c.complemento ? " · " + c.complemento : ""}`;
          return (
            <button
              key={c.id}
              onClick={() => escolher(c)}
              disabled={!!loadingId}
              style={{ ...card(t), display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left", cursor: loadingId ? "default" : "pointer", opacity: loadingId && !loading ? 0.55 : 1 }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, background: hexA(A, 0.12), display: "grid", placeItems: "center" }}>
                <Wifi size={22} color={A} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {nomeCapitalizado(c.nome)}
                </div>
                {c.login && (
                  <div style={{ display: "inline-block", fontSize: 11, fontWeight: 600, color: A, background: hexA(A, 0.12), padding: "2px 8px", borderRadius: 12, marginTop: 4 }}>
                    {c.login}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 5, fontSize: 12, color: t.sub, marginTop: 6, lineHeight: 1.4 }}>
                  <MapPin size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{endereco}<br />{c.bairro} — {c.cidade}/{c.uf}</span>
                </div>
              </div>
              {loading ? <RefreshCw size={18} color={A} className="spin" /> : <ChevronRight size={18} color={t.sub} style={{ flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
