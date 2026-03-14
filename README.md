# Vela-Vita

Landing page de una marca de velas decorativas y aromaticas, creada como una single-page web app responsive en HTML, CSS y JavaScript.

## Demo

Sitio publicado en GitHub Pages:

https://braianruaimi.github.io/Vela-Vita/

## Descripcion

Vela-Vita es una web promocional en espanol para una marca de velas orientada a hogares, eventos y celebraciones especiales. El sitio fue pensado con una estetica calida, elegante y vibrante, con una experiencia mobile-first y componentes faciles de editar.

Incluye:

- Hero principal con identidad visual de marca
- Seccion sobre la marca
- Tarjetas de productos editables
- Formulario de reserva de pedidos
- Testimonios
- CTA final con enlace a WhatsApp
- Boton flotante de WhatsApp
- Chatbot flotante con respuestas basicas
- Despliegue automatico con GitHub Pages

## Tecnologias

- HTML5
- CSS3
- JavaScript
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
|- images/
|  |- vela-aromatica.svg
|  |- vela-decorativa.svg
|  \- vela-eventos.svg
|- js/
|  \- app.js
|- index.html
\- README.md
```

## Personalizacion rapida

### Contenido

- Los textos principales estan en index.html.
- Los enlaces de WhatsApp e Instagram tambien se editan en index.html.
- Las tarjetas de productos pueden duplicarse o modificarse facilmente dentro de la seccion Productos.

### Estilos

- Toda la identidad visual vive en css/styles.css.
- Las variables de color estan definidas al inicio del archivo en :root.
- El sitio ya incluye animaciones suaves, sombras, layout responsive y detalles decorativos.

### Chatbot

- La logica del asistente esta en js/app.js.
- Las respuestas se pueden ampliar modificando el arreglo botResponses.

## Uso local

Como es un sitio estatico, puedes abrir index.html directamente en el navegador o usar un servidor local simple.

Ejemplo con VS Code Live Server o cualquier servidor estatico.

## Despliegue

El proyecto usa GitHub Actions para desplegar automaticamente en GitHub Pages cuando hay cambios en la rama main.

Workflow:

- .github/workflows/deploy-pages.yml

Publicacion:

- Cada push a main dispara el workflow.
- El artefacto publicado es el contenido del repositorio.
- La URL final es la de GitHub Pages del repositorio.

## Contacto configurado

- WhatsApp: 2215047962
- Instagram: https://www.instagram.com/vela__vita?utm_source=qr&igsh=NDNndmRha3pibHZo

## Proximos pasos sugeridos

- Reemplazar ilustraciones SVG por fotos reales del producto
- Agregar testimonios reales
- Conectar el formulario a un backend o servicio de email
- Configurar un dominio propio