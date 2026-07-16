import { createContext, useCallback, useContext, useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { STATUS } from "../theme/tokens";

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, tipo = "ok") => {
    setToast({ msg, tipo, id: Date.now() });
    setTimeout(() => setToast(null), 1900);
  }, []);

  const Icon = toast?.tipo === "alert" ? AlertCircle : Check;

  return (
    <ToastCtx.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast">
          <Icon size={16} color={toast.tipo === "alert" ? STATUS.danger : STATUS.ok} />
          {toast.msg}
        </div>
      )}
    </ToastCtx.Provider>
  );
}
