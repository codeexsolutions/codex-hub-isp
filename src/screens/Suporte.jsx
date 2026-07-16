import { useCallback, useEffect, useState } from "react";
import { Plus, LifeBuoy, ChevronRight, Inbox } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { listarChamados, abrirChamado } from "../api/client";
import { hexA } from "../theme/tokens";
import { card, btnPrimary, btnGhost, inputStyle, lbl } from "../components/ui/styles";
import ChamadoDetalhe from "./ChamadoDetalhe";

const CATEGORIAS = ["Técnico", "Financeiro", "Comercial", "Outros"];
const INTERVALO_LISTA = 30000;

export default function Suporte() {
  const { A, t } = useTheme();
  const { showToast } = useToast();
  const { token } = useAuth();

  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [selecionadoId, setSelecionadoId] = useState(null);

  const [form, setForm] = useState(false);
  const [assunto, setAssunto] = useState("");
  const [cat, setCat] = useState(CATEGORIAS[0]);
  const [msg, setMsg] = useState("");
  const [enviando, setEnviando] = useState(false);

  const carregar = useCallback(
    async ({ silencioso = false } = {}) => {
      if (!token) return;
      if (!silencioso) setCarregando(true);
      try {
        setLista(await listarChamados(token));
        setErro(null);
      } catch (e) {
        console.error(e);
        setErro("Não foi possível carregar seus chamados.");
      } finally {
        setCarregando(false);
      }
    },
    [token]
  );

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Enquanto a lista está visível, checa se o suporte respondeu (respostas_status → 1).
  useEffect(() => {
    if (selecionadoId) return;
    const id = setInterval(() => carregar({ silencioso: true }), INTERVALO_LISTA);
    return () => clearInterval(id);
  }, [carregar, selecionadoId]);

  // Ao responder, o ReceitaNet zera o respostas_status. Reflete na hora, sem esperar o poll.
  const marcarComoRespondido = useCallback((id) => {
    setLista((l) =>
      l.map((c) => (c.id === id ? { ...c, respostasStatus: 0, temRespostaDoSuporte: false } : c))
    );
  }, []);

  const enviar = async () => {
    if (!assunto.trim() || !msg.trim()) {
      showToast("Preencha assunto e descrição", "alert");
      return;
    }
    setEnviando(true);
    try {
      await abrirChamado(token, {
        assunto: assunto.trim(),
        categoria: cat,
        descricao: msg.trim(),
      });
      setAssunto("");
      setMsg("");
      setForm(false);
      showToast("Chamado aberto");
      await carregar({ silencioso: true });
    } catch (e) {
      console.error(e);
      showToast("O chamado não foi aberto. Tente de novo.", "alert");
    } finally {
      setEnviando(false);
    }
  };

  const selecionado = lista.find((c) => c.id === selecionadoId) ?? null;

  if (selecionado) {
    return (
      <ChamadoDetalhe
        chamado={selecionado}
        token={token}
        onVoltar={() => {
          setSelecionadoId(null);
          carregar({ silencioso: true });
        }}
        onRespostaEnviada={marcarComoRespondido}
      />
    );
  }

  return (
    <div style={{ padding: "18px 18px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
      {!form && (
        <button className="btn-a" onClick={() => setForm(true)} style={btnPrimary(A)}>
          <Plus size={18} /> Abrir novo chamado
        </button>
      )}

      {form && (
        <div style={card(t)}>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: t.text,
              marginBottom: 4,
            }}
          >
            Novo chamado
          </div>

          <label style={lbl(t)}>Categoria</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                style={{
                  padding: "8px 14px",
                  borderRadius: 20,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: `1px solid ${cat === c ? A : t.border}`,
                  background: cat === c ? hexA(A, 0.12) : "transparent",
                  color: cat === c ? A : t.sub,
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <label style={lbl(t)}>Assunto</label>
          <input
            className="fld"
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            placeholder="Ex.: Sem conexão"
            style={{ ...inputStyle(t, A), marginBottom: 12 }}
          />

          <label style={lbl(t)}>Descrição</label>
          <textarea
            className="fld"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            rows={4}
            placeholder="Descreva o que está acontecendo…"
            style={{ ...inputStyle(t, A), resize: "none" }}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              onClick={() => setForm(false)}
              style={{ ...btnGhost(t), flex: 1, width: "auto" }}
            >
              Cancelar
            </button>
            <button
              className="btn-a"
              onClick={enviar}
              disabled={enviando}
              style={{ ...btnPrimary(A), flex: 1, opacity: enviando ? 0.6 : 1 }}
            >
              {enviando ? "Enviando…" : "Enviar chamado"}
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          color: t.sub,
          letterSpacing: 0.5,
          marginTop: 4,
        }}
      >
        MEUS CHAMADOS
      </div>

      {carregando && (
        <div style={{ ...card(t), color: t.sub, fontSize: 13.5 }}>Carregando chamados…</div>
      )}

      {!carregando && erro && (
        <div style={{ ...card(t), display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ color: t.text, fontSize: 13.5 }}>{erro}</div>
          <button onClick={() => carregar()} style={{ ...btnGhost(t), width: "auto" }}>
            Tentar de novo
          </button>
        </div>
      )}

      {!carregando && !erro && lista.length === 0 && (
        <div
          style={{
            ...card(t),
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: t.sub,
            fontSize: 13.5,
          }}
        >
          <Inbox size={22} color={t.sub} />
          Você ainda não abriu nenhum chamado.
        </div>
      )}

      {!carregando &&
        !erro &&
        lista.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelecionadoId(c.id)}
            aria-label={`Abrir chamado ${c.protocolo}${c.temRespostaDoSuporte ? " — nova resposta" : ""}`}
            style={{
              ...card(t),
              display: "flex",
              alignItems: "center",
              gap: 14,
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              border: `1px solid ${c.temRespostaDoSuporte ? hexA(A, 0.5) : t.border}`,
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  background: hexA(A, 0.1),
                }}
              >
                <LifeBuoy size={22} color={A} />
              </div>
              {c.temRespostaDoSuporte && (
                <span
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: A,
                    border: `2px solid ${t.border}`,
                  }}
                />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14.5,
                  color: t.text,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {c.descricao.split('\n')[0]}
              </div>
              <div style={{ fontSize: 12, color: t.sub, marginTop: 2 }}>
                {c.protocolo} · {c.data}
              </div>
              {c.temRespostaDoSuporte && (
                <div style={{ fontSize: 11.5, fontWeight: 700, color: A, marginTop: 4 }}>
                  Nova resposta do suporte
                </div>
              )}
            </div>

            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "5px 10px",
                borderRadius: 20,
                whiteSpace: "nowrap",
                color: c.aberto ? A : "#12B76A",
                background: c.aberto ? hexA(A, 0.12) : hexA("#12B76A", 0.12),
              }}
            >
              {c.aberto ? "Em aberto" : "Fechado"}
            </span>
            <ChevronRight size={18} color={t.sub} style={{ flexShrink: 0 }} />
          </button>
        ))}
    </div>
  );
}
