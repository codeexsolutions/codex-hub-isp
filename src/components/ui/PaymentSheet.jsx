import { useState } from "react";
import { Copy, Download, FileText, CheckCircle2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { STATUS } from "../../theme/tokens";
import { brl, dataBR, statusFatura } from "../../utils/format";
import { StatusPill } from "./widgets";
import { btnPrimary, inputStyle, lbl } from "./styles";

export default function PaymentSheet({ fatura, onClose }) {
  const { A, t } = useTheme();
  const { showToast } = useToast();
  const [tabPag, setTabPag] = useState(`${fatura.qrCode === null ? "boleto": "pix" }`);
  const emAberto = fatura.dataPagamento === null;
  const temPix = fatura.qrCode !== null;
  const tagButtons = [["boleto", "Boleto"]]
  if(temPix)
    tagButtons.push(["pix", "Pix"])



  const copy = async (text, label) => {
    try { await navigator.clipboard.writeText(text); showToast(`${label} copiado`); }
    catch { showToast("Não foi possível copiar", "alert"); }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ background: t.surface }}>
        <div className="grabber" style={{ background: t.border }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12.5, color: t.sub }}>Pagamento da fatura</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 26, color: t.text }}>{brl(fatura.valor)}</div>
          </div>
          <StatusPill status={statusFatura(fatura, new Date())} />
        </div>
        <div style={{ fontSize: 12.5, color: t.sub, marginTop: 2 }}>Vencimento {dataBR(fatura.dataVencimento)}</div>

        {emAberto ? (
          <>
            <div style={{ display: "flex", gap: 8, marginTop: 18, background: t.surface2, padding: 4, borderRadius: 14 }}>
              {tagButtons.map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setTabPag(k)}
                  style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13.5, background: tabPag === k ? t.surface : "transparent", color: tabPag === k ? A : t.sub, boxShadow: tabPag === k ? "0 2px 8px rgba(0,0,0,.08)" : "none" }}
                >
                  {label}
                </button>
              ))}
            </div>

            {(tabPag === "pix" && temPix) && (
              <div style={{ marginTop: 18, textAlign: "center" }}>
                <div style={{ background: "#fff", padding: 14, borderRadius: 20, display: "inline-block", boxShadow: "0 4px 20px rgba(0,0,0,.08)" }}>
                  <img src={fatura.qrCodeImg} alt="QR Code Pix" style={{ width: 172, height: 172, display: "block", imageRendering: "pixelated" }} />
                </div>
                <div style={{ fontSize: 13, color: t.sub, marginTop: 12 }}>Escaneie o QR Code no app do seu banco</div>
                <button className="btn-a" onClick={() => copy(fatura.qrCode, "Pix copia e cola")} style={{ ...btnPrimary(A), marginTop: 14 }}>
                  <Copy size={17} /> Copiar código Pix
                </button>
              </div>
            )}

            {tabPag === "boleto" && (
              <div style={{ marginTop: 18 }}>
                <div style={lbl(t)}>Linha digitável</div>
                <div style={{ ...inputStyle(t), fontSize: 13, wordBreak: "break-all", lineHeight: 1.5, padding: "12px 14px", height: "auto" }}>
                  {fatura.linhaDigitavel}
                </div>
                <button className="btn-a" onClick={() => copy(fatura.linhaDigitavel , "Linha digitável")} style={{ ...btnPrimary(A), marginTop: 12 }}>
                  <Copy size={17} /> Copiar código de barras
                </button>
                {fatura.linkFaturaPdf && (
                  <a href={fatura.linkFaturaPdf } target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10, padding: 14, borderRadius: 14, border: `1.5px solid ${t.border}`, color: t.text, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                    <Download size={17} /> Baixar boleto (PDF)
                  </a>
                )}
              </div>
            )}

            {fatura.linkRecibo && (
              <a href={fatura.link_recibo} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16, color: t.sub, fontSize: 12.5, textDecoration: "none" }}>
                <FileText size={14} /> Ver detalhes / recibo
              </a>
            )}
          </>
        ) : (
          <div style={{ marginTop: 20, textAlign: "center", color: t.sub, fontSize: 14, padding: "20px 0" }}>
            <CheckCircle2 size={40} color={STATUS.ok} style={{ marginBottom: 10 }} />
            <div>Esta fatura já foi paga.</div>
          </div>
        )}
      </div>
    </div>
  );
}
