
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { hexA } from "../theme/tokens";
import { card, btnPrimary, inputStyle, lbl } from "../components/ui/styles";
import { enviarAvaliacao } from "../api/client";
import { useAuth } from "../context/AuthContext";

const LEGENDAS = { 1: "Muito insatisfeito", 2: "Insatisfeito", 3: "Neutro", 4: "Satisfeito", 5: "Muito satisfeito" };

export default function AvaliacaoApp() {
  const { A, provider, t } = useTheme();
  const { cliente } = useAuth()
  const { showToast } = useToast();
  const nav = useNavigate();

  const [nota, setNota] = useState(0);
  const [hover, setHover] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const enviar = async () => {
    if (!nota) { showToast("Selecione uma nota antes de enviar", "alert"); return; }
    setEnviando(true);
    try {
      await enviarAvaliacao({cliente: cliente.dadosCadastrais.nome, nota, mensagem: mensagem.trim(), codigoProvedor: provider.codigoProvedor, rota:"app" });
      setEnviado(true);
    } catch {
      showToast("Não foi possível enviar. Tente novamente.", "alert");
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div style={{ padding: "60px 28px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: hexA("#12B76A", 0.14), display: "grid", placeItems: "center" }}>
          <CheckCircle2 size={32} color="#12B76A" />
        </div>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 19, color: t.text }}>
          Obrigado pelo feedback!
        </div>
        <div style={{ fontSize: 13.5, color: t.sub, maxWidth: 260, lineHeight: 1.5 }}>
          Sua opinião ajuda a {provider.nome} a melhorar o app para todos os assinantes.
        </div>
        <button className="btn-a" onClick={() => nav(-1)} style={{ ...btnPrimary(A), width: "auto", padding: "12px 26px", marginTop: 8 }}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "22px 18px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={card(t)}>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: t.text }}>
          Como está sua experiência?
        </div>
        <div style={{ fontSize: 13, color: t.sub, marginTop: 4 }}>
          Avalie o app da {provider.nome} — leva menos de um minuto.
        </div>

        {/* estrelas */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 22 }}>
          {[1, 2, 3, 4, 5].map((n) => {
            const ativa = n <= (hover || nota);
            return (
              <button
                key={n}
                onClick={() => setNota(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                aria-label={`Nota ${n}`}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, transition: "transform .1s" }}
              >
                <Star size={34} color={ativa ? A : t.border} fill={ativa ? A : "none"} strokeWidth={1.8} />
              </button>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 10, height: 18, fontSize: 13, fontWeight: 600, color: A }}>
          {LEGENDAS[hover || nota] || " "}
        </div>

        <label style={{ ...lbl(t), marginTop: 18 }}>Quer contar mais? (opcional)</label>
        <textarea
          className="fld"
          rows={4}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="O que podemos melhorar, ou o que você mais gosta no app…"
          style={{ ...inputStyle(t, A), resize: "none" }}
        />

        <button className="btn-a" onClick={enviar} disabled={enviando} style={{ ...btnPrimary(A), marginTop: 18 }}>
          {enviando ? "Enviando…" : <><Send size={17} /> Enviar avaliação</>}
        </button>
      </div>

      <div style={{ fontSize: 11.5, color: t.sub, textAlign: "center", lineHeight: 1.5 }}>
        Sua avaliação é enviada de forma anônima e usada apenas para melhorar o serviço.
      </div>
    </div>
  );
}

/* ============================================================================
 * ADICIONAR EM src/api/client.js (junto com as outras funções exportadas):
 *
 * export async function enviarAvaliacao({ nota, mensagem }) {
 *   if (USE_MOCK) {
 *     await new Promise((r) => setTimeout(r, 600));
 *     return { ok: true };
 *   }
 *   const { data } = await request(`/api/avaliacoes`, {
 *     method: "POST",
 *     body: JSON.stringify({ nota, mensagem }),
 *   });
 *   return data;
 * }
 * ==========================================================================*/