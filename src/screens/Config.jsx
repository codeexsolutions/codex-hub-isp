import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, ShieldCheck, RefreshCw, MessageSquareText, LogOut, Star } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { hexA } from "../theme/tokens";
import { card } from "../components/ui/styles";
import { Toggle, ConfigRow } from "../components/ui/widgets";

const NOTIFS = [
  ["faturas", "Vencimento de faturas", "Avisos de fatura próxima do vencimento"],
  ["suporte", "Atualizações de chamados", "Respostas aos seus chamados de suporte"],
  ["promo", "Ofertas e novidades", "Promoções e upgrades de plano"],
];

export default function Config() {
  const { A, provider, t, dark, setDark } = useTheme();
  const { sair } = useAuth();
  const { showToast } = useToast();
  const nav = useNavigate();
  const [notif, setNotif] = useState({ faturas: true, suporte: true, promo: false });

  const trocarProvedor = () => { sair(); nav("/provedor", { replace: true }); };
  const logout = () => { sair(); nav("/login", { replace: true }); };

  return (
    <div style={{ padding: "18px 18px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: t.sub, letterSpacing: 0.5 }}>APARÊNCIA</div>
      <div style={card(t)}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: hexA(A, 0.12), display: "grid", placeItems: "center" }}>
            {dark ? <Moon size={19} color={A} /> : <Sun size={19} color={A} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14.5, color: t.text }}>Tema escuro</div>
            <div style={{ fontSize: 12, color: t.sub }}>{dark ? "Ativado" : "Desativado"}</div>
          </div>
          <Toggle on={dark} onClick={() => setDark(!dark)} />
        </div>
      </div>

      {/* <div style={{ fontSize: 12.5, fontWeight: 700, color: t.sub, letterSpacing: 0.5, marginTop: 4 }}>NOTIFICAÇÕES</div>
      <div style={card(t)}>
        {NOTIFS.map(([k, tit, sub], i, arr) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : "none" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: t.text }}>{tit}</div>
              <div style={{ fontSize: 11.5, color: t.sub, marginTop: 1 }}>{sub}</div>
            </div>
            <Toggle on={notif[k]} onClick={() => setNotif({ ...notif, [k]: !notif[k] })} />
          </div>
        ))}
      </div> */}

      <div style={{ fontSize: 12.5, fontWeight: 700, color: t.sub, letterSpacing: 0.5, marginTop: 4 }}>CONTA</div>
      <div style={card(t)}>
        <ConfigRow icon={ShieldCheck} label="Privacidade e segurança" onClick={() => showToast("Em breve")} />
        <ConfigRow icon={RefreshCw} label="Trocar de provedor" onClick={trocarProvedor} />
        <ConfigRow icon={Star} label="Avaliar o app" onClick={() => nav("/app/avaliacao")} />
        <ConfigRow icon={MessageSquareText} label="Fale com a Codex" onClick={() => showToast("Suporte Codex")} last />
      </div>

      <button onClick={logout} style={{ ...card(t), display: "flex", alignItems: "center", gap: 10, justifyContent: "center", cursor: "pointer", color: "#F04438", fontWeight: 700, fontSize: 14 }}>
        <LogOut size={18} /> Sair da conta
      </button>

      <div style={{ textAlign: "center", fontSize: 11.5, color: t.sub, marginTop: 6 }}>
        HUB ISP · {provider.nome}
        <br />
        Desenvolvido por Codex Solutions· v1.0.0
      </div>
    </div>
  );
}
