# Central do Assinante — PWA (HUB ISP · Codex)

PWA white-label da central do assinante para provedores de internet. Cada provedor
tem **tema (cor) e logo próprios**, carregados a partir de um código na entrada do app.

## Fluxo

1. **Splash** — marca Codex.
2. **Código do provedor** — o código consultado devolve o tema/logo do provedor.
3. **Login** — já com a marca do provedor aplicada; entrada por CPF ou CNPJ.
4. **App** — Dashboard, Faturas, Suporte, Perfil e Configurações.

Códigos demo: `1001` (NetFibra), `2002` (VeloNet), `3003` (GigaMais). Qualquer outro
código cai no tema padrão. CPF de demonstração: `116.324.333-70`.

## Rodando

```bash
npm install
cp .env.example .env      # ajuste se for consumir a API real
npm run dev               # http://localhost:5173
```

Build de produção (gera o service worker do PWA):

```bash
npm run build
npm run preview
```

> O service worker só é ativado no **build/preview** (não no `dev`). Para testar a
> instalação do PWA, use `npm run build && npm run preview` e abra em HTTPS ou localhost.

## Conectar à API real

Edite o `.env`:

```
VITE_API_URL=https://sua-api.com
VITE_USE_MOCK=false
```

Com `VITE_USE_MOCK=true` (padrão) o app roda sem backend, usando os dados de exemplo.
A camada de API fica em `src/api/client.js`, com três pontos de integração:

- `getProvider(codigo)` → deve devolver `{ codigo, nome, tag, accent, accent2, logoUrl }`.
- `loginCliente({ codigoProvedor, cpfCnpj })` → deve devolver o payload
  **"Dados Cliente RECEITANET"** (mesmo formato de `src/data/mockCliente.js`).
- `listarChamados()` / `abrirChamado(payload)` → suporte.

## Estrutura

```
src/
├─ api/client.js          camada de API (mock + real)
├─ context/
│  ├─ ThemeContext.jsx    tema do provedor + modo escuro (persistido)
│  ├─ AuthContext.jsx     sessão do cliente
│  └─ ToastContext.jsx    toasts globais
├─ theme/tokens.js        tokens claro/escuro + helpers de cor
├─ utils/format.js        moeda, datas, máscara CPF/CNPJ, status de fatura
├─ data/                  providers.js + mockCliente.js
├─ components/
│  ├─ ui/                 styles, widgets, PaymentSheet
│  └─ layout/             Header, BottomNav, AppShell
├─ screens/               Splash, ProviderCode, Login, Dashboard,
│                         Faturas, Suporte, Perfil, Config
├─ App.jsx                rotas
└─ main.jsx               providers + registro do service worker
```

## White-label do próprio manifest (importante)

O `manifest.webmanifest` gerado pelo `vite-plugin-pwa` é **estático** — o app instalado
usa sempre o ícone/nome do HUB ISP. Para que **cada provedor** instale um PWA com a
própria marca, sirva um manifest dinâmico por subdomínio no backend
(ex.: `provedor.seudominio.com/manifest.webmanifest`) e aponte o `<link rel="manifest">`
do `index.html` para ele. A configuração atual já deixa esse ponto isolado em
`vite.config.js`.

---
Desenvolvido para o projeto **HUB ISP** · Codex.
