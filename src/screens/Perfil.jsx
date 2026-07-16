import { useNavigate } from "react-router-dom";
import {
  CreditCard, Calendar, FileText, Mail, MapPin, Zap, Settings, LogOut, ChevronRight, Star
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { brl, iniciais, nomeCapitalizado } from "../utils/format";
import { card } from "../components/ui/styles";
import { ConfigRow, InfoRow } from "../components/ui/widgets";

export default function Perfil() {
  const { A, provider, t } = useTheme();
  const { cliente, sair } = useAuth();
  const nav = useNavigate();

  const { dadosCadastrais: d, endereco: e, plano } = cliente;
  const endereco = `${e.logradouro}${e.complemento ? " · " + e.complemento : ""} — ${e.bairro}, ${e.cidade}/${e.uf}`;

  const logout = () => { sair(); nav("/login", { replace: true }); };

  return (
    <div style={{ padding: "18px 18px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...card(t), display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 62, height: 62, borderRadius: 20, background: `linear-gradient(135deg,${A},${provider.accent2})`, display: "grid", placeItems: "center", color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 22 }}>
          {iniciais(d.nome)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16.5, color: t.text }}>{nomeCapitalizado(d.nome)}</div>
          <div style={{ fontSize: 12.5, color: t.sub, marginTop: 2 }}>Assinante {provider.nome}</div>
        </div>
      </div>
      <div>
        <ConfigRow icon={Star} label="Avaliar nossos serviços." onClick={() => nav("/app/satisfacao")} />
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: t.sub, letterSpacing: 0.5, marginTop: 4 }}>DADOS CADASTRAIS</div>
      <div style={card(t)}>
        <InfoRow icon={CreditCard} label="CPF/CNPJ" value={d.cpfCnpj} />
        <InfoRow icon={Calendar} label="Nascimento" value={d.dataNascimento} />
        <InfoRow icon={FileText} label="Inscrição" value={d.inscricao} />
        <InfoRow icon={Mail} label="E-mail" value={d.email || "Não cadastrado"} last />
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 700, color: t.sub, letterSpacing: 0.5, marginTop: 4 }}>ENDEREÇO</div>
      <div style={card(t)}>
        <InfoRow icon={MapPin} label="Instalação" value={endereco} last />
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 700, color: t.sub, letterSpacing: 0.5, marginTop: 4 }}>PLANO CONTRATADO</div>
      <div style={card(t)}>
        <InfoRow icon={Zap} label={plano[0].descricao} value={`${brl(plano[0].valor)}/mês`} last />
      </div>

      <button onClick={() => nav("/app/config")} style={{ ...card(t), display: "flex", alignItems: "center", gap: 12, cursor: "pointer", width: "100%", textAlign: "left" }}>
        <Settings size={19} color={A} />
        <span style={{ flex: 1, color: t.text, fontWeight: 600, fontSize: 14 }}>Configurações</span>
        <ChevronRight size={18} color={t.sub} />
      </button>

      <button onClick={logout} style={{ ...card(t), display: "flex", alignItems: "center", gap: 10, justifyContent: "center", cursor: "pointer", color: "#F04438", fontWeight: 700, fontSize: 14 }}>
        <LogOut size={18} /> Sair da conta
      </button>
    </div>
  );
}
