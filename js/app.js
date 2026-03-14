const form = document.getElementById("reservation-form");
const successMessage = document.getElementById("form-success");
const productButtons = document.querySelectorAll("[data-producto]");
const eventSelect = form?.querySelector("select[name='evento']");
const notesField = form?.querySelector("textarea[name='notas']");

const chatToggle = document.getElementById("chat-toggle");
const chatClose = document.getElementById("chat-close");
const chatPanel = document.getElementById("chat-panel");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

const botResponses = [
    {
        keywords: ["precio", "precios", "costo", "costos", "cotizacion"],
        answer: "Los precios dependen del tipo de vela y la cantidad. Puedes completar el formulario de reserva o escribirnos por WhatsApp para recibir una cotizacion."
    },
    {
        keywords: ["evento", "eventos", "casamiento", "boda", "cumpleanos", "cumpleanos"],
        answer: "Si, realizamos pedidos especiales para cumpleanos, casamientos y celebraciones."
    },
    {
        keywords: ["reserva", "reservar", "pedido", "personalizadas"],
        answer: "Puedes reservar desde el formulario de esta pagina. Indicanos tipo de evento, cantidad estimada y detalles para preparar tu propuesta."
    },
    {
        keywords: ["entrega", "envio", "zona", "retirar"],
        answer: "Consulta disponibilidad de entrega segun tu zona. Tambien podemos coordinar retiro segun el tipo de pedido."
    },
    {
        keywords: ["producto", "productos", "vela", "velas", "aromatica", "decorativa"],
        answer: "Tenemos velas decorativas, aromaticas y opciones para eventos. Si buscas algo puntual, cuentanos tu idea y te orientamos."
    }
];

const defaultResponse = "Puedo ayudarte con consultas sobre productos, eventos, reservas y entregas. Si quieres una cotizacion, tambien puedes escribirnos por WhatsApp.";

const appendMessage = (text, type) => {
    if (!chatMessages) {
        return;
    }

    const message = document.createElement("div");
    message.className = `message ${type}-message`;
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

const getBotReply = (input) => {
    const normalizedInput = input.toLowerCase();
    const match = botResponses.find(({ keywords }) => keywords.some((keyword) => normalizedInput.includes(keyword)));
    return match ? match.answer : defaultResponse;
};

productButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const productName = button.getAttribute("data-producto");

        if (notesField) {
            const prefix = notesField.value.trim() ? `${notesField.value.trim()}\n` : "";
            notesField.value = `${prefix}Me interesa consultar disponibilidad para: ${productName}.`;
        }

        document.getElementById("reserva")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

form?.addEventListener("submit", (event) => {
    event.preventDefault();
    successMessage?.removeAttribute("hidden");
    form.reset();

    if (eventSelect) {
        eventSelect.selectedIndex = 0;
    }
});

const openChat = () => {
    if (!chatPanel || !chatToggle) {
        return;
    }

    chatPanel.hidden = false;
    chatToggle.setAttribute("aria-expanded", "true");
    chatInput?.focus();
};

const closeChat = () => {
    if (!chatPanel || !chatToggle) {
        return;
    }

    chatPanel.hidden = true;
    chatToggle.setAttribute("aria-expanded", "false");
};

chatToggle?.addEventListener("click", () => {
    if (chatPanel?.hidden) {
        openChat();
        return;
    }

    closeChat();
});

chatClose?.addEventListener("click", closeChat);

chatForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!chatInput) {
        return;
    }

    const userText = chatInput.value.trim();

    if (!userText) {
        return;
    }

    appendMessage(userText, "user");
    chatInput.value = "";

    window.setTimeout(() => {
        appendMessage(getBotReply(userText), "bot");
    }, 350);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && chatPanel && !chatPanel.hidden) {
        closeChat();
    }
});