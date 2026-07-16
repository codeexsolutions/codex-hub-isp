import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Send, Lock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { listarRespostas, enviarResposta } from "../api/client";
import { hexA } from "../theme/tokens";
import { card, inputStyle } from "../components/ui/styles";

const INTERVALO_RESPOSTAS = 15000;

export default function ChamadoDetalhe({ chamado, token, onVoltar, onRespostaEnviada }) {
  const { A, t } = useTheme();
  const { showToast } = useToast();

  const [respostas, setRespostas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const fimRef = useRef(null);

  const carregar = useCallback(
    async ({ silencioso = false } = {}) => {
      if (!silencioso) setCarregando(true);
      try {
        setRespostas(await listarRespostas(token, chamado.id));
      } catch (e) {
        console.error(e);
        if (!silencioso) showToast("Não foi possível carregar as mensagens", "alert");
      } finally {
        setCarregando(false);
      }
    },
    [token, chamado.id, showToast]
  );

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Chamado aberto: busca respostas novas do suporte enquanto a tela estiver visível.
  useEffect(() => {
    if (!chamado.aberto) return;
    const id = setInterval(() => carregar({ silencioso: true }), INTERVALO_RESPOSTAS);
    return () => clearInterval(id);
  }, [carregar, chamado.aberto]);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [respostas.length]);

  // A descrição do chamado é a 1ª mensagem do cliente.
  // Se a rota /respostas já devolver essa mensagem, remova a linha de abertura abaixo.
  const mensagens = useMemo(
    () => [
      { id: "abertura", mensagem: chamado.descricao, data: chamado.data, doCliente: true },
      ...respostas,
    ],
    [chamado.descricao, chamado.data, respostas]
  );

  const enviar = async () => {
    const mensagem = texto.trim();
    if (!mensagem || enviando) return;

    const provisoria = { id: `tmp-${Date.now()}`, mensagem, data: "", doCliente: true, pendente: true };
    setTexto("");
    setEnviando(true);
    setRespostas((r) => [...r, provisoria]);

    try {
      await enviarResposta(token, chamado.id, mensagem);
      onRespostaEnviada?.(chamado.id);
      await carregar({ silencioso: true });
    } catch (e) {
      console.error(e);
      setRespostas((r) => r.filter((x) => x.id !== provisoria.id));
      setTexto(mensagem);
      showToast("A mensagem não foi enviada. Tente de novo.", "alert");
    } finally {
      setEnviando(false);
    }
  };

  const aoTeclar = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      {/* Cabeçalho */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 18px",
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <button
          onClick={onVoltar}
          aria-label="Voltar para meus chamados"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 4,
            display: "grid",
            placeItems: "center",
          }}
        >
          <ArrowLeft size={20} color={t.text} />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: t.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {chamado.descricao.split('\n')[0]}
          </div>
          <div style={{ fontSize: 12, color: t.sub, marginTop: 2 }}>
            Protocolo {chamado.protocolo} · {chamado.data}
          </div>
        </div>

        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "5px 10px",
            borderRadius: 20,
            whiteSpace: "nowrap",
            color: chamado.aberto ? A : "#12B76A",
            background: chamado.aberto ? hexA(A, 0.12) : hexA("#12B76A", 0.12),
          }}
        >
          {chamado.aberto ? "Em aberto" : "Fechado"}
        </span>
      </div>

      {/* Conversa */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {carregando && <div style={{ color: t.sub, fontSize: 13 }}>Carregando mensagens…</div>}

        {!carregando &&
          mensagens.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.doCliente ? "flex-end" : "flex-start",
                maxWidth: "82%",
                padding: "10px 13px",
                borderRadius: 14,
                borderBottomRightRadius: m.doCliente ? 4 : 14,
                borderBottomLeftRadius: m.doCliente ? 14 : 4,
                background: m.doCliente ? hexA(A, 0.14) : hexA(t.text, 0.06),
                border: `1px solid ${m.doCliente ? hexA(A, 0.22) : t.border}`,
                opacity: m.pendente ? 0.6 : 1,
              }}
            >
              {!m.doCliente && (
                <div style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 3 }}>
                  Suporte
                </div>
              )}
              <div style={{ fontSize: 14, color: t.text, whiteSpace: "pre-wrap", lineHeight: 1.45 }}>
                {m.mensagem}
              </div>
              <div style={{ fontSize: 10.5, color: t.sub, marginTop: 5, textAlign: "right" }}>
                {m.pendente ? "Enviando…" : m.data}
              </div>
            </div>
          ))}

        <div ref={fimRef} />
      </div>

      {/* Composição */}
      {chamado.aberto ? (
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
            padding: "12px 18px 18px",
            borderTop: `1px solid ${t.border}`,
          }}
        >
          <textarea
            className="fld"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={aoTeclar}
            rows={1}
            placeholder="Escreva uma mensagem…"
            style={{ ...inputStyle(t, A), resize: "none", flex: 1, minHeight: 44 }}
          />
          <button
            className="btn-a"
            onClick={enviar}
            disabled={enviando || !texto.trim()}
            aria-label="Enviar mensagem"
            style={{
              width: 46,
              height: 46,
              flexShrink: 0,
              borderRadius: 14,
              border: "none",
              display: "grid",
              placeItems: "center",
              background: A,
              cursor: enviando || !texto.trim() ? "default" : "pointer",
              opacity: enviando || !texto.trim() ? 0.5 : 1,
            }}
          >
            <Send size={19} color="#fff" />
          </button>
        </div>
      ) : (
        <div
          style={{
            ...card(t),
            margin: 18,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: t.sub,
            fontSize: 13,
          }}
        >
          <Lock size={16} color={t.sub} />
          Este chamado foi fechado. Abra um novo para continuar o atendimento.
        </div>
      )}
    </div>
  );
}
