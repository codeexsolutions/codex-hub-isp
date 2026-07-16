import { createContext, useContext, useMemo, useState } from "react";
import { loginCliente, getContratoCliente } from "../api/client";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

const loadCliente = () => {
  try { const v = sessionStorage.getItem("ca:cliente"); return v ? JSON.parse(v) : null; } catch { return null; }
};
const loadToken = () => {
  try { const v = sessionStorage.getItem("ca:token"); return v ? JSON.parse(v) : null; } catch { return null; }
};

export function AuthProvider({ children }) {
  const [cliente, setCliente] = useState(loadCliente);
  const [token, setToken] = useState(loadToken);

  const aplicarCliente = (data) => {
    setCliente(data.dadosCliente);
    sessionStorage.setItem("ca:cliente", JSON.stringify(data.dadosCliente));
    setToken(data.dadosToken);
    sessionStorage.setItem("ca:token", JSON.stringify(data.dadosToken))
    return data;
  };

  // Retorna { contratos } quando o cliente precisa escolher,
  // ou { cliente } quando o login já libera o acesso direto (token).
  const entrar = async ({ codigoProvedor, cpfCnpj }) => {
    const res = await loginCliente({ codigoProvedor, cpfCnpj });

    // caso a API devolva uma LISTA de contratos

    const contratos = res?.dadosToken.multiploCadastro ? res.dadosToken.contratos : null; 

    if (contratos) 
      return { contratos };

    // caso devolva o cliente/token -> acessa direto
    return { cliente: aplicarCliente(res) };

    throw new Error(res?.message || "Não foi possível entrar.");
  };

  // usado pela tela de escolha de contrato
  const selecionarContrato = async ({ codigoProvedor, cpfCnpj, contratoId }) => {
    const resContrato = await getContratoCliente({ codigoProvedor, cpfCnpj, contratoId });
    if (resContrato?.dadosToken && resContrato?.dadosCliente) {
      //const token = await loginCliente(codigoProvedor, cpfCnpj);
      return aplicarCliente(resContrato);
    }
    throw new Error(res?.message || "Não foi possível carregar o contrato.");
  };

  const sair = () => { 
    setCliente(null); sessionStorage.removeItem("ca:cliente"); 
    setCliente(null); sessionStorage.removeItem("ca:token"); 
  };

  const value = useMemo(
    () => ({ cliente, token, isAuth: !!cliente, entrar, selecionarContrato, sair }),
    [cliente]
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
