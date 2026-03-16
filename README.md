# Vela-Vita

Sitio web responsive de Vela-Vita, una marca de velas artesanales orientada a regalos, decoracion y eventos. La app esta construida con HTML, CSS y JavaScript, se publica en GitHub Pages con dominio personalizado y puede usar Firebase Firestore de forma opcional para metricas y reservas.

## Demo

Sitio publicado:

https://velavita.site/

## Estado actual

La version actual incluye:

- Hero principal con imagen real y llamadas a la accion
- Seccion de marca y seccion Quienes somos
- Tres productos destacados en home
- Catalogo completo desplegable
- Consulta directa por producto a WhatsApp
- Carrito liviano con envio del pedido por WhatsApp
- Formulario de pedidos personalizados
- Testimonios en carrusel automatico
- Boton flotante de WhatsApp
- Asistente flotante con respuestas por tipo de ocasion
- Modal astral Vela-Vita con CTA a WhatsApp
- Panel CEO con metricas visibles bajo clave
- Soporte PWA con manifest y service worker
- Integracion opcional con Firebase Firestore

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Firebase Firestore
- GitHub Actions
- GitHub Pages

## Estructura del proyecto

```text
Vela-Vita/
|- .github/
|  \- workflows/
|     \- deploy-pages.yml
|- css/
|  \- styles.css
|- firebase/
|  \- firestore.rules
|- images/
|  |- app-icon.svg
|  |- beige.jpeg
|  |- Gemini_Generated_Image_og3c3aog3c3aog3c.png
|  |- ramo lila.jpeg
|  |- Ramo rojo.jpeg
|  |- Ramo rosa.jpeg
|  |- WhatsApp Image 2026-03-14 at 18.15.07.jpeg
|  \- imag productos/
|- js/
|  |- app.js
|  \- firebase-config.js
|- index.html
|- manifest.webmanifest
|- README.md
\- service-worker.js
```

## Archivos clave

- index.html: estructura principal del sitio, secciones, modales y paneles.
- css/styles.css: identidad visual, layout responsive, animaciones y estilos de componentes.
- js/app.js: carrito, chat, metricas, modal astral, formularios y comportamiento general.
- js/firebase-config.js: configuracion publica opcional para Firebase.
- service-worker.js: cache de assets para experiencia tipo app.
- manifest.webmanifest: configuracion de instalacion PWA.

## Funcionalidades principales

### Catalogo y ventas

- La home muestra solo las velas mas vendidas.
- El resto del catalogo se abre desde un bloque desplegable de productos.
- Cada producto permite consultar directo por WhatsApp.
- El carrito permite agrupar piezas y enviar el pedido por WhatsApp.

### Pedido personalizado

- El formulario solicita datos basicos del cliente y del evento.
- Al enviar, se prepara el mensaje y se redirige a WhatsApp.
- Si Firebase esta activo, tambien puede persistir reservas y metricas.

### Asistente y modal astral

- El asistente flotante responde consultas sobre regalos, eventos, souvenirs, decoracion y centros de mesa.
- El modal astral se activa desde el hero y tambien puede mostrarse por tiempo de permanencia.
- El modal se cierra con la x, tocando fuera del cartel o con la tecla Escape.

### Panel CEO

- El panel muestra visitas, clicks a WhatsApp, formularios y metricas del modal astral.
- La clave actual del acceso visual es 1234.
- Esa clave solo protege la interfaz en frontend; no reemplaza autenticacion real.

## Personalizacion rapida

### Textos e imagenes

- La mayor parte del contenido se edita en index.html.
- Las imagenes del catalogo y del hero se gestionan desde la carpeta images/.
- El bloque images/imag productos/ contiene la coleccion adicional del catalogo.

### Estilos

- La paleta, tipografia, espaciados y componentes viven en css/styles.css.
- Las variables de color estan declaradas al inicio del archivo.

### Logica

- Las respuestas del asistente, metricas, carrito y modales viven en js/app.js.
- Los enlaces a WhatsApp y comportamiento de CTA tambien se controlan desde ahi y desde index.html.

## Firebase opcional

Si no configuras Firebase, el sitio sigue funcionando con comportamiento local en frontend.

Para activarlo:

1. Crea un proyecto en Firebase.
2. Activa Firestore Database.
3. Crea una Web App.
4. Copia la configuracion publica.
5. Completa js/firebase-config.js con tus credenciales.
6. Usa las reglas de firebase/firestore.rules.
7. Vuelve a publicar el sitio.

Ejemplo de configuracion:

```javascript
window.VELA_VITA_FIREBASE = {
    enabled: true,
    config: {
        apiKey: "TU_API_KEY",
        authDomain: "TU_PROYECTO.firebaseapp.com",
        projectId: "TU_PROJECT_ID",
        storageBucket: "TU_PROYECTO.firebasestorage.app",
        messagingSenderId: "TU_MESSAGING_SENDER_ID",
        appId: "TU_APP_ID"
    },
    metricsCollection: "siteMetrics",
    metricsDocId: "global",
    reservationsCollection: "reservations"
};
```

## Publicacion

El despliegue se hace con GitHub Pages mediante GitHub Actions y dominio personalizado.

- Workflow: .github/workflows/deploy-pages.yml
- Rama de publicacion: main
- Cada push a main dispara una nueva publicacion
- Dominio principal: https://velavita.site/

## Contacto configurado

- WhatsApp: 2215965021
- Instagram: https://www.instagram.com/vela__vita?utm_source=qr&igsh=NDNndmRha3pibHZo

## Notas

- El proyecto es un frontend estatico, pensado para correr sin backend propio.
- Si en algun navegador no se ve una version nueva, normalmente es cache del service worker o del navegador.
- Para endurecer el panel CEO, el siguiente paso correcto es agregar autenticacion real con Firebase Authentication.