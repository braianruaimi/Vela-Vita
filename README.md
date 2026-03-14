# Vela-Vita

Landing page de una marca de velas decorativas y aromaticas, creada como una single-page web app responsive en HTML, CSS y JavaScript, con integracion opcional a Supabase para reservas y metricas.

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
- Panel CEO con metricas
- Integracion opcional con Supabase para reservas y metricas
- Despliegue automatico con GitHub Pages

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Supabase
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
|  |- app-icon.svg
|  |- vela-aromatica.svg
|  |- vela-decorativa.svg
|  \- vela-eventos.svg
|- js/
|  |- app.js
|  \- supabase-config.js
|- index.html
|- manifest.webmanifest
|- service-worker.js
|- supabase/
|  \- schema.sql
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

### Supabase

- La configuracion publica se completa en js/supabase-config.js.
- Si enabled queda en false, la web sigue funcionando con fallback local para metricas y reservas por WhatsApp.
- Para activar Supabase debes completar url y anonKey.

## Uso local

### Solo frontend

Puedes abrir index.html directamente en el navegador o usar un servidor local simple.

Ejemplo con VS Code Live Server o cualquier servidor estatico.

## Configuracion de Supabase

1. Crea un proyecto en Supabase.
2. Abre el SQL editor y ejecuta el contenido de supabase/schema.sql.
3. Copia tu Project URL y tu anon public key.
4. Completa js/supabase-config.js:

```javascript
window.VELA_VITA_SUPABASE = {
	enabled: true,
	url: "https://TU-PROYECTO.supabase.co",
	anonKey: "TU_ANON_KEY",
	metricsTable: "site_metrics",
	reservationsTable: "reservations"
};
```

5. Publica nuevamente la web.

Con eso quedaran persistidas en Supabase:

- Views
- Clicks a WhatsApp
- Formularios iniciados
- Formularios enviados
- Reservas

## Despliegue

El proyecto usa GitHub Actions para desplegar automaticamente en GitHub Pages cuando hay cambios en la rama main.

Workflow:

- .github/workflows/deploy-pages.yml

Publicacion:

- Cada push a main dispara el workflow.
- El artefacto publicado es el contenido del repositorio.
- La URL final es la de GitHub Pages del repositorio.

Importante:

- GitHub Pages funciona bien con Supabase porque no necesita ejecutar backend propio.
- La clave 1234 del panel CEO sigue siendo una barrera visual local en el frontend, no una seguridad real de servidor.
- Si quieres un panel CEO realmente seguro, el siguiente paso correcto es usar Supabase Auth y politicas mas cerradas, o una Edge Function.

## Contacto configurado

- WhatsApp: 2215047962
- Instagram: https://www.instagram.com/vela__vita?utm_source=qr&igsh=NDNndmRha3pibHZo

## Proximos pasos sugeridos

- Reemplazar ilustraciones SVG por fotos reales del producto
- Agregar testimonios reales
- Activar Supabase con tus credenciales reales
- Agregar autenticacion real al panel CEO
- Configurar un dominio propio