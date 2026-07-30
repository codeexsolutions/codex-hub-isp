self.addEventListener("install", () => {
    console.log("Service Worker instalado");
});

self.addEventListener("activate", () => {
    console.log("Service Worker ativo");
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const url = event.notification.data?.url || "/";

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        }).then((clientList) => {
            if (clientList.length > 0) {
                // Se já houver uma janela aberta, foca nela e navega para a URL
                const client = clientList[0];
                client.focus();
                return client.navigate(url);
            } else {
                // Se não houver janela aberta, abre uma nova
                return clients.openWindow(url);
            }
        })
    );
});


self.addEventListener("push", (event) => {

    const data = event.data.json();

    const options = {
        body: data.body,
        icon: data.icon,
        image: data.image,
        badge: data.badge,
        data: data.data,
        actions: data.actions
    };

    event.waitUntil(self.registration.showNotification(data.title, options) );

});