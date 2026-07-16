import { NavLink } from "react-router-dom";
import { Home, FileText, LifeBuoy, User } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { hexA } from "../../theme/tokens";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

const ITENS = [
 
];

export default function BottomNav() {
  const {token} = useAuth()
  const [itens, setItens] = useState([])
  const { A, t } = useTheme();
  
  useEffect(() => {
    if(token.gerenciador === "IXCSOFT"){
        setItens([{ to: "/app", end: true, label: "Início", icon: Home },
                  { to: "/app/faturas", label: "Faturas", icon: FileText },
                  { to: "/app/perfil", label: "Perfil", icon: User },
                ])
    }else{
       setItens([{ to: "/app", end: true, label: "Início", icon: Home },
                  { to: "/app/faturas", label: "Faturas", icon: FileText },
                  { to: "/app/perfil", label: "Perfil", icon: User },
                  { to: "/app/suporte", label: "Suporte", icon: LifeBuoy },
                ])
    }
  },[])


  return (
    <nav style={{ display: "flex", background: t.surface, borderTop: `1px solid ${t.border}`, padding: "8px 8px calc(8px + env(safe-area-inset-bottom))" }}>
      {itens.map(({ to, end, label, icon: Icon }) => (
        <NavLink key={to} to={to} end={end} style={{ flex: 1, textDecoration: "none" }}>
          {({ isActive }) => (
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: isActive ? A : t.sub }}>
              <span style={{ width: 46, height: 32, borderRadius: 12, display: "grid", placeItems: "center", background: isActive ? hexA(A, 0.12) : "transparent", transition: "background .2s" }}>
                <Icon size={21} strokeWidth={isActive ? 2.5 : 2} />
              </span>
              <span style={{ fontSize: 10.5, fontWeight: isActive ? 700 : 500 }}>{label}</span>
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
