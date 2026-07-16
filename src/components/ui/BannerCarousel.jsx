import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function Slide({ b, onOpen }) {
  const bg = b.imagemUrl
    ? `linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.45)), url(${b.imagemUrl}) center/cover`
    : `linear-gradient(130deg, ${b.cor1}, ${b.cor2})`;
  return (
    <div style={{ flex: "0 0 100%", minWidth: "100%" }}>
      <div
        onClick={() => onOpen?.(b)}
        style={{ height: 152, borderRadius: 20, background: bg, color: "#fff", padding: 20, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden", cursor: "pointer" }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.9, letterSpacing: 1 }}>{b.selo}</div>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 19, lineHeight: 1.15, marginTop: 6, maxWidth: 230 }}>{b.titulo}</div>
        <div style={{ fontSize: 12.5, opacity: 0.92, marginTop: 4, maxWidth: 240 }}>{b.subtitulo}</div>
        {b.cta && (
          <span style={{ marginTop: 12, alignSelf: "flex-start", background: "rgba(255,255,255,.22)", padding: "7px 13px", borderRadius: 20, fontSize: 12.5, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
            {b.cta} <ArrowRight size={14} />
          </span>
        )}
        <span style={{ position: "absolute", right: -8, bottom: -18, fontSize: 96, opacity: 0.16, lineHeight: 1 }}>{b.emoji}</span>
      </div>
    </div>
  );
}

export default function BannerCarousel({ items = [], onOpen }) {
  const { A, t } = useTheme();
  const [i, setI] = useState(0);
  const touchX = useRef(null);
  const paused = useRef(false);
  const n = items.length;

  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) setI((p) => (p + 1) % n);
    }, 4500);
    return () => clearInterval(id);
  }, [n]);

  if (!n) return null;
  const go = (idx) => setI(((idx % n) + n) % n);

  return (
    <div>
      <div
        style={{ overflow: "hidden", borderRadius: 20 }}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; paused.current = true; }}
        onTouchEnd={(e) => {
          const d = (touchX.current ?? 0) - e.changedTouches[0].clientX;
          if (Math.abs(d) > 40) go(i + (d > 0 ? 1 : -1));
          paused.current = false;
        }}
      >
        <div style={{ display: "flex", transform: `translateX(-${i * 100}%)`, transition: "transform .45s cubic-bezier(.2,.8,.2,1)" }}>
          {items.map((b) => <Slide key={b.id} b={b} onOpen={onOpen} />)}
        </div>
      </div>

      {n > 1 && (
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10 }}>
          {items.map((_, k) => (
            <button
              key={k}
              onClick={() => go(k)}
              aria-label={`Banner ${k + 1}`}
              style={{ width: k === i ? 18 : 7, height: 7, borderRadius: 6, border: "none", cursor: "pointer", padding: 0, background: k === i ? A : t.border, transition: "width .25s, background .25s" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
