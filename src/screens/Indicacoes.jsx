import { useState } from "react";
import { Gift, Send, User, Phone, MessageSquare } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { inputStyle, btnPrimary } from "../components/ui/styles";
import { enviarIndicacao } from "../api/client";
import { useToast } from "../context/ToastContext";

export default function Indicacoes() {
  const { A, t, provider } = useTheme();
  const { cliente } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    nome: "",
    contato: "",
    mensagem: ""
  });

  const enviar = async () => {
  try {
    await enviarIndicacao({
      nome: form.nome,
      contato: form.contato,
      mensagem: form.mensagem,
      cliente: cliente.dadosCadastrais.nome,
      codigo_provedor: provider.codigo,
    });

    showToast("Indicação enviada com sucesso! 🎉");

    setForm({
      nome: "",
      contato: "",
      mensagem: "",
    });

  } catch (error) {
    showToast("Não foi possível enviar a indicação.");
  }
};

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          background: `linear-gradient(135deg, ${A}, #4f46e5)`,
          borderRadius: 24,
          padding: 24,
          color: "#fff",
          marginBottom: 24,
        }}
      >
        <Gift size={34} />

        <h2
          style={{
            margin: "16px 0 8px",
            fontSize: 24,
            fontWeight: 800,
          }}
        >
          Indique um amigo
        </h2>

        <p style={{ margin: 0, opacity: 0.9 }}>
          Informe os dados do seu indicado. Nossa equipe entrará em contato.
        </p>
      </div>

      <div
        style={{
          background: t.surface,
          borderRadius: 20,
          padding: 20,
          border: `1px solid ${t.border}`,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div>
          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Nome do indicado
          </label>

          <div style={{ position: "relative", marginTop: 8 }}>
            <User
              size={18}
              style={{
                position: "absolute",
                left: 14,
                top: 14,
                color: t.sub,
              }}
            />

            <input
              style={{
                ...inputStyle(t, A),
                paddingLeft: 44,
              }}
              placeholder="Nome completo"
              value={form.nome}
              onChange={(e) =>
                setForm({ ...form, nome: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Contato do indicado
          </label>

          <div style={{ position: "relative", marginTop: 8 }}>
            <Phone
              size={18}
              style={{
                position: "absolute",
                left: 14,
                top: 14,
                color: t.sub,
              }}
            />

            <input
              style={{
                ...inputStyle(t, A),
                paddingLeft: 44,
              }}
              placeholder="Telefone ou WhatsApp"
              value={form.contato}
              onChange={(e) =>
                setForm({ ...form, contato: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Mensagem
          </label>

          <div style={{ position: "relative", marginTop: 8 }}>
            <MessageSquare
              size={18}
              style={{
                position: "absolute",
                left: 14,
                top: 14,
                color: t.sub,
              }}
            />

            <textarea
              rows={5}
              style={{
                ...inputStyle(t, A),
                paddingLeft: 44,
                resize: "none",
              }}
              placeholder="Escreva uma mensagem (opcional)"
              value={form.mensagem}
              onChange={(e) =>
                setForm({ ...form, mensagem: e.target.value })
              }
            />
          </div>
        </div>

        <button
          onClick={enviar}
          style={{
            ...btnPrimary(A),
            marginTop: 8,
          }}
        >
          <Send size={18} />
          Enviar indicação
        </button>
      </div>
    </div>
  );
}