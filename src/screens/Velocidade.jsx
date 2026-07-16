// src/screens/Velocidade.jsx
// Teste de velocidade (download, upload e ping) — drop-in.
//
// COMO LIGAR:
// 1) Rota (dentro do <Route path="/app"> no App.jsx, para herdar header/bottom nav):
//        import Velocidade from "./screens/Velocidade";
//        <Route path="velocidade" element={<Velocidade />} />
// 2) Atalho no Dashboard (grid de atalhos):
//        import { Gauge } from "lucide-react";
//        <Atalho icon={Gauge} label="Teste de velocidade" onClick={() => nav("/app/velocidade")} />
// 3) (opcional) título no Header.jsx, no objeto TITULOS:
//        "/app/velocidade": "Teste de velocidade",

import { useRef, useState } from "react";
import { Play, RefreshCw, Download, Upload, Activity } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { hexA } from "../theme/tokens";
import { card, btnPrimary } from "../components/ui/styles";

const DOWN_URL = import.meta.env.VITE_SPEEDTEST_DOWN_URL || "https://speed.cloudflare.com/__down";
const UP_URL = import.meta.env.VITE_SPEEDTEST_UP_URL || "https://speed.cloudflare.com/__up";
const SIM = String(import.meta.env.VITE_SPEEDTEST_SIM ?? "false") === "true";
const DOWN_BYTES = 20_000_000; // ~20 MB
const UP_BYTES = 8_000_000; //  ~8 MB

const hostDe = (u) => { try { return new URL(u).hostname; } catch { return "servidor"; } };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* -------------------- medições reais -------------------- */
async function medirPing(url, n = 5) {
  const tempos = [];
  for (let k = 0; k < n; k++) {
    const t0 = performance.now();
    await fetch(`${url}?bytes=0&r=${Math.random()}`, { cache: "no-store" });
    tempos.push(performance.now() - t0);
  }
  return Math.min(...tempos);
}

async function medirDownload(url, bytes, onProgress) {
  const t0 = performance.now();
  const res = await fetch(`${url}?bytes=${bytes}&r=${Math.random()}`, { cache: "no-store" });
  let recebido = 0;
  if (res.body && res.body.getReader) {
    const reader = res.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      recebido += value.length;
      const seg = (performance.now() - t0) / 1000;
      if (seg > 0) onProgress((recebido * 8) / seg / 1e6);
    }
  } else {
    const buf = await res.arrayBuffer();
    recebido = buf.byteLength;
  }
  const seg = (performance.now() - t0) / 1000;
  return (recebido * 8) / seg / 1e6;
}

function medirUpload(url, bytes, onProgress) {
  return new Promise((resolve, reject) => {
    const dados = new Blob([new Uint8Array(bytes)]);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    const t0 = performance.now();
    xhr.upload.onprogress = (e) => {
      const seg = (performance.now() - t0) / 1000;
      if (seg > 0) onProgress((e.loaded * 8) / seg / 1e6);
    };
    xhr.onload = () => { const seg = (performance.now() - t0) / 1000; resolve((bytes * 8) / seg / 1e6); };
    xhr.onerror = () => reject(new Error("Falha no upload"));
    xhr.send(dados);
  });
}

/* -------------------- modo simulado -------------------- */
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
async function simularRampa(alvo, dur, onProgress) {
  const passos = 30, dt = dur / passos;
  for (let s = 1; s <= passos; s++) {
    const base = alvo * (s / passos);
    const ruido = alvo * 0.06 * (Math.random() - 0.5);
    onProgress(Math.max(0, base + ruido));
    await espera(dt);
  }
  onProgress(alvo);
  return alvo;
}

export default function Velocidade() {
  const { A, provider, t } = useTheme();
  const [fase, setFase] = useState("idle"); // idle | ping | download | upload | done | erro
  const [atual, setAtual] = useState(0);
  const [escala, setEscala] = useState(200);
  const [res, setRes] = useState({ ping: null, download: null, upload: null });
  const [erro, setErro] = useState("");
  const rodando = useRef(false);

  const prog = (v) => {
    setAtual(v);
    setEscala((e) => (v > e ? Math.ceil(v / 50) * 50 : e));
  };

  const iniciar = async () => {
    if (rodando.current) return;
    rodando.current = true;
    setErro(""); setRes({ ping: null, download: null, upload: null });
    setAtual(0); setEscala(200);
    try {
      // PING
      setFase("ping");
      const ping = SIM ? 8 + Math.random() * 20 : await medirPing(DOWN_URL);
      setRes((r) => ({ ...r, ping }));

      // DOWNLOAD
      setFase("download"); setAtual(0);
      const download = SIM
        ? await simularRampa(180 + Math.random() * 60, 2600, prog)
        : await medirDownload(DOWN_URL, DOWN_BYTES, prog);
      setAtual(download);
      setRes((r) => ({ ...r, download }));

      // UPLOAD
      setFase("upload"); setAtual(0);
      const upload = SIM
        ? await simularRampa(80 + Math.random() * 40, 2400, prog)
        : await medirUpload(UP_URL, UP_BYTES, prog);
      setAtual(upload);
      setRes((r) => ({ ...r, upload }));

      setFase("done");
    } catch (e) {
      setErro(e.message || "Não foi possível concluir o teste.");
      setFase("erro");
    } finally {
      rodando.current = false;
    }
  };

  // geometria do medidor (arco de 270°)
  const R = 80, C = 2 * Math.PI * R, ARCO = 0.75 * C;
  const emMbps = fase === "download" || fase === "upload" || fase === "done";
  const frac = emMbps ? clamp(atual / escala, 0, 1) : 0;

  const centro =
    fase === "ping" ? { v: res.ping != null ? Math.round(res.ping) : "—", u: "ms" }
    : fase === "done" ? { v: (res.download ?? 0).toFixed(1), u: "Mbps ↓" }
    : { v: atual.toFixed(1), u: "Mbps" };

  const labelFase = { idle: "Pronto para testar", ping: "Medindo latência…", download: "Baixando…", upload: "Enviando…", done: "Teste concluído", erro: "Falhou" }[fase];

  return (
    <div style={{ padding: "22px 18px 28px", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
      <div style={{ fontSize: 12.5, color: t.sub, textAlign: "center" }}>
        {labelFase} · {hostDe(DOWN_URL)}{SIM ? " (simulado)" : ""}
      </div>

      {/* medidor */}
      <div style={{ position: "relative", width: 240, height: 240 }}>
        <svg viewBox="0 0 200 200" width="240" height="240">
          <circle cx="100" cy="100" r={R} fill="none" stroke={t.border} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${ARCO} ${C}`} transform="rotate(135 100 100)" />
          <circle cx="100" cy="100" r={R} fill="none" stroke={A} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${ARCO * frac} ${C}`} transform="rotate(135 100 100)" style={{ transition: "stroke-dasharray .25s ease" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 44, color: t.text, lineHeight: 1 }}>{centro.v}</div>
          <div style={{ fontSize: 13, color: t.sub, marginTop: 4, fontWeight: 600 }}>{centro.u}</div>
        </div>
      </div>

      {/* resultados */}
      <div style={{ ...card(t), width: "100%", display: "flex", padding: 0, overflow: "hidden" }}>
        <Resultado t={t} A={A} icon={Activity} label="Ping" valor={res.ping != null ? `${Math.round(res.ping)} ms` : "—"} ativo={fase === "ping"} />
        <div style={{ width: 1, background: t.border }} />
        <Resultado t={t} A={A} icon={Download} label="Download" valor={res.download != null ? `${res.download.toFixed(1)}` : "—"} sufixo="Mbps" ativo={fase === "download"} />
        <div style={{ width: 1, background: t.border }} />
        <Resultado t={t} A={A} icon={Upload} label="Upload" valor={res.upload != null ? `${res.upload.toFixed(1)}` : "—"} sufixo="Mbps" ativo={fase === "upload"} />
      </div>

      {erro && (
        <div style={{ fontSize: 12.5, color: "#F04438", textAlign: "center", lineHeight: 1.5 }}>
          {erro}<br />Verifique sua conexão e tente novamente.
        </div>
      )}

      {/* comparação com o plano contratado */}
      {fase === "done" && (
        <div style={{ fontSize: 12.5, color: t.sub, textAlign: "center", lineHeight: 1.5 }}>
          Seu plano {provider.nome} contrata até <strong style={{ color: t.text }}>200 Mega</strong>.
          {res.download >= 160 ? " Sua velocidade está ótima! ✅" : " Se estiver bem abaixo disso, fale com o suporte."}
        </div>
      )}

      <button className="btn-a" onClick={iniciar} disabled={rodando.current || ["ping", "download", "upload"].includes(fase)} style={{ ...btnPrimary(A), maxWidth: 300 }}>
        {["ping", "download", "upload"].includes(fase)
          ? <><RefreshCw size={18} className="spin" /> Testando…</>
          : fase === "done" || fase === "erro"
          ? <><RefreshCw size={18} /> Refazer teste</>
          : <><Play size={18} /> Iniciar teste</>}
      </button>

      <div style={{ fontSize: 11, color: t.sub, textAlign: "center", maxWidth: 300, lineHeight: 1.5 }}>
        Os resultados podem variar conforme Wi-Fi, aparelho e uso simultâneo da rede. Para maior precisão, conecte-se por cabo e feche outros apps.
      </div>
    </div>
  );
}

function Resultado({ t, A, icon: Icon, label, valor, sufixo, ativo }) {
  return (
    <div style={{ flex: 1, padding: "14px 8px", textAlign: "center", background: ativo ? hexA(A, 0.06) : "transparent" }}>
      <Icon size={16} color={ativo ? A : t.sub} style={{ marginBottom: 4 }} />
      <div style={{ fontSize: 11, color: t.sub }}>{label}</div>
      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: t.text, marginTop: 2 }}>
        {valor}{sufixo && valor !== "—" ? <span style={{ fontSize: 10, color: t.sub, fontWeight: 600 }}> {sufixo}</span> : ""}
      </div>
    </div>
  );
}
