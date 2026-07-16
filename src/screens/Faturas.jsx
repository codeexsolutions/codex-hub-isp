import { useOutletContext } from "react-router-dom";
import { CheckCircle2, AlertCircle, Clock, ChevronRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { STATUS, hexA } from "../theme/tokens";
import { brl, dataBR, statusFatura } from "../utils/format";
import { card } from "../components/ui/styles";
import { StatusPill } from "../components/ui/widgets";
import { useEffect, useState } from "react";
import { getFaturas } from "../api/client";

export default function Faturas() {
  const { A, provider, t } = useTheme();
  const { cliente, token } = useAuth();
  const { openPay } = useOutletContext();
  const [ faturasx, setFaturas ] = useState(null);
  const [statusFaturas, setStatusFaturas] = useState(null);

  useEffect(() => {
    console.log("useEffect");
    obterFaturas(token);
    
  },[token])
  
  async function obterFaturas(data) {
    
    const params = data.gerenciador === "IXCSOFT" ? data : {gerenciador:data.gerenciador, token:data.token}
    const faturasCliente = await getFaturas(params);
    
    if(faturasCliente && faturasCliente.boletos.length > 0){
      setFaturas(faturasCliente.boletos)
      const emAberto = faturasCliente.boletos
        .filter((f) => statusFatura(f, new Date()) !== "paga")
        .reduce((s, f) => s + f.valor, 0);
      setStatusFaturas(emAberto);
    } 
  
  }
  console.log(faturasx);


  return (
    <div style={{ padding: "18px 18px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...card(t), background: `linear-gradient(140deg,${A},${provider.accent2})`, color: "#fff", border: "none" }}>
        <div style={{ fontSize: 12.5, opacity: 0.9 }}>Total em aberto</div>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 30, marginTop: 4 }}>{brl(statusFaturas)}</div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{statusFaturas > 0 ? "Você tem faturas pendentes" : "Tudo em dia 🎉"}</div>
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 700, color: t.sub, letterSpacing: 0.5, marginTop: 4 }}>HISTÓRICO</div>
      
      {faturasx ? faturasx.map((f) => {
        const st = statusFatura(f, new Date());
        const pagavel = st !== "paga";
        const cor = st === "paga" ? STATUS.ok : st === "vencida" ? STATUS.danger : A;
        const Icon = st === "paga" ? CheckCircle2 : st === "vencida" ? AlertCircle : Clock;
        return (
          <button
            key={f.id}
            onClick={() => pagavel && openPay(f)}
            style={{ ...card(t), textAlign: "left", cursor: pagavel ? "pointer" : "default", display: "flex", alignItems: "center", gap: 14, width: "100%" }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", flexShrink: 0, background: hexA(cor, 0.12) }}>
              <Icon size={22} color={cor} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: t.text }}>{brl(f.valor)}</div>
              <div style={{ fontSize: 12, color: t.sub, marginTop: 2 }}>
                {st === "paga" ? `Pago em ${dataBR(f.dataPagamento)}` : `Vence em ${dataBR(f.dataVencimento)}`}
              </div>
            </div>
            <StatusPill status={st} />
            {pagavel && <ChevronRight size={18} color={t.sub} />}
          </button>
        );
      }) : null}
    </div>
  );
}
