// Resposta de exemplo — mesmo formato do endpoint "Dados Cliente RECEITANET".
export const MOCK_CLIENTE = {
  dadosCadastrais: {
    nome: "EVALDO MORAIS DOS SANTOS",
    cpfCnpj: "116.324.333-70",
    dataNascimento: "30/07/2002",
    email: "",
    inscricao: "0634017020171",
  },
  endereco: {
    logradouro: "TRAVESSA MESQUITA, 638",
    complemento: "",
    bairro: "GENIBAÚ",
    cidade: "FORTALEZA",
    uf: "CE",
    cep: null,
  },
  ultimasFaturas: [
    {
      id: 52287236,
      valor: 74.9,
      valorPago: null,
      dataVencimento: "2026-07-10",
      dataPagamento: null,
      linkFatura: "https://b.receitanet.net/5BZb5",
      linkFaturaPdf: "https://b.receitanet.net/_/52287236",
      linkRecibo: "https://link.receitanet.net/debitos/52287236",
      linhaDigitavel: "36490.00076 00057.246407 00000.050815 1 00000000007490",
      qrCode:
        "00020101021226940014BR.GOV.BCB.PIX2572qrcodespix.sejaefi.com.br/bolix/v2/cobv/6b8db56e0c7246dcbdd7d8d564e7668e5204000053039865802BR5905EFISA6008SAOPAULO62070503***6304B8C4",
      qrCodeImg:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQMAAACXljzdAAAABlBMVEUEAgT8/vxJvsdeAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACeklEQVRYhbWYbaokIQxFBbclZOuC2wpkcq42bxh4f4bb3RRleQrUePNhjfrtN34ne4x5as+MnP1Mow6dZnKqG2uNudc82Vc/TjrdpO+nu8ZaDUNzmHR+geyoHJEreol9cf8KyV7nlBmblEzqJ7Ioa6vewKVdrL9s7SJSyL+/H+3YCOLGlqkZjDXGlWSZyQ4k0RtH/2gy9Spz85IBiP63FntwVM8Ujpkg9u6TAldscGmpZsKYoc1ikW1YGni0mewn8x4YR8aFceZ0E3WxNmJeTyTOR/FmMlkcD3guhOX2g5lwQ4KTjSuiEdGpXzATMgVr07Ukxh7+lJ3coVObl7jZkm+FmexQfO2mIvh6rylSWAnto2FTim/aFu1I7iUHZ2IKm8yeuLISrpvkCxMD95ofxWe4Sae/QfQmoUuOUwXKCjPZNBVVMejHgTtEmYmspyhEA51M+stNtmqsC+q8uFRfIIu8t4h816L9G6RBM5H2mAMW7dKLRtuXXGIlOxS3k4Exac8icGg7aaWrTebrufBWcJkJsZWI2pFJyYJwLlmaSWuPAdm08WoICoftJvKikhiDkmhPPUSZyU1E9/nVXRLmMROCXKI+FXSdNXrFKu3MhBmMmzQGpl2qVuULVqJYd17G4Mg3iEwdl8xEu0WJikeF6iGVKcdNQgfIvIn9WRSndhM8eMqZEAapPVWpmInyqpb2CjzciuRuJhy22CmdH8Q/K/USDo8k9XiHSaI5nwDCTIgSpLytjN6mRIqs1U34gnG3jUI/ZVV8+Askb2X3SiJVDl8hdSuTo0qyJ0EpGW6iLxiUwKXjeKqhGtZKPl8wKn/EnuOeNZ3kP74N/gELkY1LWNlQgAAAAABJRU5ErkJggg==",
    },
    { id: 52180011, valor: 74.9, valorPago: 74.9, dataVencimento: "2026-06-10", dataPagamento: "2026-06-08" },
    { id: 52070022, valor: 74.9, valorPago: 74.9, dataVencimento: "2026-05-10", dataPagamento: "2026-05-09" },
    { id: 51960033, valor: 74.9, valorPago: 74.9, dataVencimento: "2026-04-10", dataPagamento: "2026-04-10" },
  ],
  plano: [
    { id: 71066, descricao: "PLANO 200 MEGA + STREAMING GRATÍS (aplicativo cortesia)", quantidade: 1, valor: "74.90", total: "74.90" },
  ],
  consumos: {
    consumoMensalLabels: ["04/2026", "05/2026", "06/2026", "07/2026"],
    consumoMensalDown: [119.63, 178.18, 152.22, 38.88],
    consumoMensalUp: [13.83, 10.36, 15.48, 2.5],
  },
};

export const MOCK_CHAMADOS = [
  { id: "#4821", descricao: "Lentidão à noite", protocolo: "20260710093137", status: "aberto", data: "05/07/2026" },
  { id: "#4790", descricao: "Segunda via de boleto", protocolo: "Financeiro", status: "resolvido", data: "28/06/2026" },
];

export const MOCK_CONTRATOS = [
  { id: 71066, nome: "EVALDO MORAIS DOS SANTOS", login: "evaldo.santos", endereco: "TRAVESSA MESQUITA, 638", complemento: "", bairro: "GENIBAÚ", cidade: "FORTALEZA", uf: "CE" },
  { id: 71067, nome: "EVALDO MORAIS DOS SANTOS", login: "evaldo.loja", endereco: "AV. BEZERRA DE MENEZES, 1200", complemento: "Loja 3", bairro: "SÃO GERARDO", cidade: "FORTALEZA", uf: "CE" },
];