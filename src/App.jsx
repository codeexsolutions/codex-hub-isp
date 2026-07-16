import { Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import Splash from "./screens/Splash";
import ProviderCode from "./screens/ProviderCode";
import Login from "./screens/Login";
import EscolhaContrato from "./screens/EscolhaContrato";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./screens/Dashboard";
import Faturas from "./screens/Faturas";
import Suporte from "./screens/Suporte";
import Perfil from "./screens/Perfil";
import Config from "./screens/Config";
import Velocidade from "./screens/Velocidade";
import Indicacoes from "./screens/Indicacoes";
import Satisfacao from "./screens/Satisfacao";
import AvaliacaoApp from "./screens/AvaliacaoApp";

export default function App() {
  const { dark, t } = useTheme();

  return (
    <div className="stage" style={{ background: dark ? "#05070B" : "#DDE3EC" }}>
      <div className="device" style={{ background: t.bg, borderColor: dark ? "#1C2431" : "#CBD3DF", boxShadow: dark ? "0 30px 80px rgba(0,0,0,.6)" : "0 30px 80px rgba(30,41,59,.28)" }}>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/provedor" element={<ProviderCode />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contratos" element={<EscolhaContrato />} />
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="faturas" element={<Faturas />} />
            <Route path="suporte" element={<Suporte />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="velocidade" element={<Velocidade />} />
            <Route path="config" element={<Config />} />
            <Route path="indicacoes" element={<Indicacoes />} />
            <Route path="satisfacao" element={<Satisfacao />} />
            <Route path="avaliacao" element={<AvaliacaoApp />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
