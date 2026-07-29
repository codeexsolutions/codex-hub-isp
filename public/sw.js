self.addEventListener("install", () => {
    console.log("Service Worker instalado");
});

self.addEventListener("activate", () => {
    console.log("Service Worker ativo");
});

self.addEventListener("push", (event) => {

    event.waitUntil(
        self.registration.showNotification("CHEGOU", {
            body: "Android recebeu o push",
            requireInteraction: true,
            badge: "/logo192.png",
            icon: "/logo192.png"
        })
    );

});
/* self.addEventListener("push", (event) => {

    const data = event.data.json();
  console.log(data);
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "/logo192.png"
        })

    );

}); */