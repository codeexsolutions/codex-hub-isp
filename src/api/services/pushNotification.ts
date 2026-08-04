import { request } from "../client";

export async function registrarServiceWorker() {

    if (!("serviceWorker" in navigator))
        return null;

    return await navigator.serviceWorker.register("/sw.js");

}

export async function solicitarPermissao() {

    const permissao = await Notification.requestPermission();

    return permissao === "granted";

}


export async function registrarPushNotification(dados:any) {

    const registration = await registrarServiceWorker();

    const permission = await solicitarPermissao();

    if (!permission)
        return;

    // Busca a chave pública da sua API
    const { data } = await request("/notificacoes/public-key");

    let subscription = await registration?.pushManager.getSubscription();

    if (!subscription) {

        subscription = await registration?.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(data)
        });

    }

    const p256dh = subscription?.getKey("p256dh");
    const auth = subscription?.getKey("auth");
    

    const cpf = dados.dadosToken.cpfCnpj;
    const codigoProvedor = dados.dadosToken.codigoProvedor

    const payload = {
        cpf: cpf === undefined ? dados.dadosCliente.dadosCadastrais.cpfCnpj : cpf,
        codigoProvedor: codigoProvedor,
        device:"",
        endpoint: subscription?.endpoint,
        expirationTime: subscription?.expirationTime,
        keys: {
            p256dh: p256dh ? arrayBufferToBase64(p256dh) : "",
            auth: auth ? arrayBufferToBase64(auth) : ""
        }
    };
    
    await request("/notificacoes/salvar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    return btoa(
        String.fromCharCode(...new Uint8Array(buffer))
    );
}

function urlBase64ToUint8Array(base64String: string) {

    const padding = "=".repeat((4 - base64String.length % 4) % 4);

    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = atob(base64);

    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));

}