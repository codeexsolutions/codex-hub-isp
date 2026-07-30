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
        }).then((clientsArr) => {

            for (const client of clientsArr) {
                if (client.url.includes(self.location.origin)) {
                    client.postMessage({
                        type: "OPEN_NOTIFICATION",
                        url
                    });

                    return client.focus();
                }
            }

            return clients.openWindow(url);
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