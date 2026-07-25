const API = import.meta.env.VITE_USE_NET ?? "true" ? import.meta.env.VITE_API_URL_NET : import.meta.env.VITE_API_URL;

export function carregarManifest(provedor) {

    const link = document.querySelector(
        'link[rel="manifest"]'
    );

    if (!link) return;

    // evita cache
    link.href = `${API}/provedores/manifest/${provedor.codigo}?t=${Date.now()}`;
     document.title = provedor.nome;

    (document.querySelector('meta[name="theme-color"]'))
        .content = provedor.accent;

    (document.querySelector('link[rel="icon"]'))
        .href = provedor.favicon;
}