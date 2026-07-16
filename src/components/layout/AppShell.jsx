import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Header from "./Header";
import BottomNav from "./BottomNav";
import PaymentSheet from "../ui/PaymentSheet";

export default function AppShell() {
  const { isAuth } = useAuth();
  const { t } = useTheme();
  const [sheet, setSheet] = useState(null);

  if (!isAuth) return <Navigate to="/login" replace />;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: t.bg, minHeight: 0 }}>
      <Header />
      <main style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        <Outlet context={{ openPay: setSheet }} />
      </main>
      <BottomNav />
      {sheet && <PaymentSheet fatura={sheet} onClose={() => setSheet(null)} />}
    </div>
  );
}
