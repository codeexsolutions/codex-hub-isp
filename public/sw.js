self.addEventListener("install", () => {
    console.log("Service Worker instalado");
});

self.addEventListener("activate", () => {
    console.log("Service Worker ativo");
});


self.addEventListener("push", (event) => {

    const data = event.data.json();
  console.log(data);
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "/logo192.png"
        })

    );

});