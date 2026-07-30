self.addEventListener("push", (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            data: data.data
        };

        event.waitUntil(self.registration.showNotification(data.title || "", options));
    }
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const url = event.notification.data?.url || "/";

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        }).then((clientList) => {
            // Verifica se o usuário está autenticado
            return clients.openWindow('/login').then(client => {
                return client.postMessage({
                    type: 'CHECK_AUTH',
                    url: url
                });
            });
        })
    );
});

// Ouve as mensagens enviadas pela página de login
self.addEventListener('message', (event) => {
    if (event.data.type === 'AUTH_STATUS') {
        const isAuthenticated = event.data.isAuthenticated;
        const url = event.data.url;

        if (isAuthenticated) {
            // Se o usuário estiver autenticado, abre a URL
            clients.openWindow(url);
        } else {
            // Se o usuário não estiver autenticado, mantém na página de login
            console.log('Usuário não autenticado. Permanecendo na página de login.');
        }
    }
});