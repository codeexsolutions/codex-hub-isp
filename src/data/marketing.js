// Conteúdo de marketing exibido na home. Na API real, estes vêm por provedor
// (getBanners/getParcerias), permitindo cada operadora ter suas próprias ofertas.

export const MOCK_BANNERS = [
  { id: 1, selo: "INDIQUE E GANHE", titulo: "Indique um amigo e ganhe desconto", subtitulo: "R$ 30 off na sua próxima fatura por indicação.", cta: "Indicar agora", cor1: "#6C4CF1", cor2: "#9B7BFF", emoji: "🎁", link: "www.google.com.br" },
  { id: 2, selo: "UPGRADE", titulo: "Turbine para 500 Mega", subtitulo: "Mais velocidade pelo mesmo preço no 1º mês.", cta: "Quero turbinar", cor1: "#2563EB", cor2: "#22B8CF", emoji: "⚡", link: "" },
  { id: 3, selo: "STREAMING", titulo: "Seu app de streaming incluso", subtitulo: "Ative a cortesia que já vem no seu plano.", cta: "Ativar cortesia", cor1: "#FF6A2C", cor2: "#F7415A", emoji: "🎬", link: "" },
  { id: 4, selo: "PIX", titulo: "Pague no Pix e concorra", subtitulo: "Faturas via Pix concorrem a prêmios mensais.", cta: "Saiba mais", cor1: "#00A870", cor2: "#4BD8A0", emoji: "🎉", link: "" },
];

export const MOCK_PARCERIAS = [
  { id: 1, nome: "Streaming+", beneficio: "Filmes e séries inclusos", emoji: "🎬", cor: "#F7415A", link: "" },
  { id: 2, nome: "Deezer", beneficio: "3 meses de música grátis", emoji: "🎧", cor: "#6C4CF1", link: "" },
  { id: 3, nome: "Telemedicina", beneficio: "Consultas online 24h", emoji: "🩺", cor: "#00A870", link: "" },
  { id: 4, nome: "Clube de descontos", beneficio: "Ofertas em lojas parceiras", emoji: "🎟️", cor: "#FF6A2C", link: "" },
  { id: 5, nome: "Segurança digital", beneficio: "Antivírus para seus aparelhos", emoji: "🛡️", cor: "#2563EB", link: "" },
];

export const MOCK_ANUNCIOS = [
  // Banner com imagem
  

  // Card somente texto
  {
    id: 2,
    subtitulo: "OFERTA EXCLUSIVA",
    titulo: "Indique um amigo e ganhe 1 mês grátis",
    descricao:
      "A cada amigo que contratar um plano utilizando seu convite, você recebe um desconto equivalente a uma mensalidade.",
    link: "/app/indicacoes",
    ativo: true,
  },

  // Outro banner
  {
    id: 3,
    titulo: "Streaming incluso",
    descricao: "Assine agora e receba acesso gratuito ao Stream+ por 6 meses.",
    imagem: "https://picsum.photos/1200/500?random=2",
    link: "https://example.com",
    ativo: true,
  },

  // Outro card de texto
  {
    id: 4,
    subtitulo: "NOVIDADE",
    titulo: "Aplicativo totalmente renovado",
    descricao:
      "Agora ficou mais fácil consultar faturas, abrir chamados e acompanhar seu consumo em tempo real.",
    link: "/app/novidades",
    ativo: true,
  },

  // Banner
  {
    id: 5,
    titulo: "Fibra Gamer",
    descricao: "Menor latência e máxima estabilidade para seus jogos online.",
    imagem: "https://picsum.photos/1200/500?random=3",
    link: "https://google.com",
    ativo: true,
  },
];