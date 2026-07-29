self.addEventListener("install", () => {
    console.log("Service Worker instalado");
});

self.addEventListener("activate", () => {
    console.log("Service Worker ativo");
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