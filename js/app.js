const form = document.getElementById("reservation-form");
const successMessage = document.getElementById("form-success");
const productButtons = document.querySelectorAll("[data-producto]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const eventSelect = form?.querySelector("select[name='evento']");
const notesField = form?.querySelector("textarea[name='notas']");
const formInputs = form?.querySelectorAll("input, select, textarea") ?? [];

const chatToggle = document.getElementById("chat-toggle");
const chatClose = document.getElementById("chat-close");
const chatPanel = document.getElementById("chat-panel");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const installAppButton = document.getElementById("install-app-button");

const ceoAccessButton = document.getElementById("ceo-access-button");
const ceoPanel = document.getElementById("ceo-panel");
const ceoClose = document.getElementById("ceo-close");
const ceoLogin = document.getElementById("ceo-login");
const ceoPassword = document.getElementById("ceo-password");
const ceoContent = document.getElementById("ceo-content");
const ceoRefresh = document.getElementById("ceo-refresh");
const ceoReset = document.getElementById("ceo-reset");
const testimonialSlides = Array.from(document.querySelectorAll(".testimonial-slide"));
const testimonialsDots = document.getElementById("testimonials-dots");

const metricsElements = {
    views: document.getElementById("metric-views"),
    whatsappClicks: document.getElementById("metric-whatsapp"),
    formSubmissions: document.getElementById("metric-forms"),
    formStarts: document.getElementById("metric-form-starts"),
    whatsappRate: document.getElementById("metric-whatsapp-rate"),
    formRate: document.getElementById("metric-form-rate"),
    dailyViews: document.getElementById("metric-daily-views"),
    activeDays: document.getElementById("metric-active-days")
};

const whatsappBaseUrl = "https://wa.me/5492215047962?text=";
const metricsStorageKey = "velaVitaMetrics";
const ceoAccessKey = "1234";
const firebaseSettings = window.VELA_VITA_FIREBASE ?? {};
const canUseFirebase = Boolean(
    firebaseSettings.enabled &&
    firebaseSettings.config?.apiKey &&
    firebaseSettings.config?.projectId &&
    window.firebase?.initializeApp &&
    window.firebase?.firestore
);

const firebaseApp = canUseFirebase
    ? (window.firebase.apps.length ? window.firebase.app() : window.firebase.initializeApp(firebaseSettings.config))
    : null;

const firestore = firebaseApp ? window.firebase.firestore(firebaseApp) : null;
const metricsCollection = firebaseSettings.metricsCollection || "siteMetrics";
const metricsDocId = firebaseSettings.metricsDocId || "global";
const reservationsCollection = firebaseSettings.reservationsCollection || "reservations";

const defaultMetrics = {
    views: 0,
    whatsappClicks: 0,
    formSubmissions: 0,
    formStarts: 0,
    createdAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString()
};

let formStarted = false;
let ceoUnlocked = false;
let deferredInstallPrompt = null;

const loadMetrics = () => {
    try {
        const savedMetrics = window.localStorage.getItem(metricsStorageKey);

        if (!savedMetrics) {
            return { ...defaultMetrics };
        }

        return {
            ...defaultMetrics,
            ...JSON.parse(savedMetrics)
        };
    } catch {
        return { ...defaultMetrics };
    }
};

let metrics = loadMetrics();

const saveMetrics = () => {
    metrics.lastUpdatedAt = new Date().toISOString();
    window.localStorage.setItem(metricsStorageKey, JSON.stringify(metrics));
};

const syncMetrics = (nextMetrics) => {
    metrics = {
        ...defaultMetrics,
        ...nextMetrics
    };
    saveMetrics();
    renderMetrics();
};

const incrementMetric = (key) => {
    metrics[key] += 1;
    saveMetrics();
    renderMetrics();
};

const normalizeTimestamp = (value) => {
    if (value?.toDate) {
        return value.toDate().toISOString();
    }

    if (typeof value === "string") {
        return value;
    }

    return new Date().toISOString();
};

const normalizeMetricsDoc = (data) => ({
    views: Number(data?.views ?? 0),
    whatsappClicks: Number(data?.whatsappClicks ?? 0),
    formSubmissions: Number(data?.formSubmissions ?? 0),
    formStarts: Number(data?.formStarts ?? 0),
    createdAt: normalizeTimestamp(data?.createdAt ?? defaultMetrics.createdAt),
    lastUpdatedAt: normalizeTimestamp(data?.lastUpdatedAt ?? defaultMetrics.lastUpdatedAt)
});

const getMetricsDocRef = () => firestore?.collection(metricsCollection).doc(metricsDocId);

const ensureFirebaseMetricsDoc = async () => {
    if (!firestore) {
        return;
    }

    const metricsRef = getMetricsDocRef();
    const snapshot = await metricsRef.get();

    if (!snapshot.exists) {
        const now = window.firebase.firestore.Timestamp.now();
        await metricsRef.set({
            views: 0,
            whatsappClicks: 0,
            formSubmissions: 0,
            formStarts: 0,
            createdAt: now,
            lastUpdatedAt: now
        });
    }
};

const refreshMetrics = async () => {
    if (!firestore) {
        renderMetrics();
        return;
    }

    try {
        await ensureFirebaseMetricsDoc();
        const metricsRef = getMetricsDocRef();
        const snapshot = await metricsRef.get();

        if (snapshot.exists) {
            syncMetrics(normalizeMetricsDoc(snapshot.data()));
            return;
        }
    } catch {
        renderMetrics();
        return;
    }

    renderMetrics();
};

const incrementFirebaseMetric = async (metricKey) => {
    if (!firestore) {
        incrementMetric(metricKey);
        return;
    }

    try {
        const metricsRef = getMetricsDocRef();
        const nextDoc = await firestore.runTransaction(async (transaction) => {
            const snapshot = await transaction.get(metricsRef);
            const now = window.firebase.firestore.Timestamp.now();
            const currentDoc = snapshot.exists
                ? normalizeMetricsDoc(snapshot.data())
                : {
                    ...defaultMetrics,
                    createdAt: now.toDate().toISOString(),
                    lastUpdatedAt: now.toDate().toISOString()
                };

            const updatedDoc = {
                views: currentDoc.views,
                whatsappClicks: currentDoc.whatsappClicks,
                formSubmissions: currentDoc.formSubmissions,
                formStarts: currentDoc.formStarts,
                createdAt: snapshot.exists ? snapshot.data().createdAt : now,
                lastUpdatedAt: now
            };

            updatedDoc[metricKey] += 1;
            transaction.set(metricsRef, updatedDoc, { merge: true });
            return updatedDoc;
        });

        syncMetrics(normalizeMetricsDoc(nextDoc));
    } catch {
        incrementMetric(metricKey);
    }
};

const resetFirebaseMetrics = async () => {
    if (!firestore) {
        metrics = {
            ...defaultMetrics,
            createdAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString()
        };
        saveMetrics();
        renderMetrics();
        return;
    }

    const now = window.firebase.firestore.Timestamp.now();
    await getMetricsDocRef().set({
        views: 0,
        whatsappClicks: 0,
        formSubmissions: 0,
        formStarts: 0,
        createdAt: now,
        lastUpdatedAt: now
    });

    syncMetrics({
        views: 0,
        whatsappClicks: 0,
        formSubmissions: 0,
        formStarts: 0,
        createdAt: now.toDate().toISOString(),
        lastUpdatedAt: now.toDate().toISOString()
    });
};

const saveReservationToFirebase = async (payload) => {
    if (!firestore) {
        return;
    }

    await firestore.collection(reservationsCollection).add({
        nombre: String(payload.nombre || "").trim(),
        apellido: String(payload.apellido || "").trim(),
        email: String(payload.email || "").trim(),
        telefono: String(payload.telefono || "").trim(),
        evento: String(payload.evento || "").trim(),
        cantidad: Number(payload.cantidad || 0),
        notas: String(payload.notas || "").trim(),
        createdAt: window.firebase.firestore.Timestamp.now()
    });
};

const getActiveDays = () => {
    const createdAt = new Date(metrics.createdAt).getTime();
    const now = Date.now();
    return Math.max(1, Math.ceil((now - createdAt) / (1000 * 60 * 60 * 24)));
};

const formatRate = (value, total) => {
    if (!total) {
        return "0%";
    }

    return `${((value / total) * 100).toFixed(1)}%`;
};

const renderMetrics = () => {
    const activeDays = getActiveDays();
    const dailyViews = (metrics.views / activeDays).toFixed(1);

    if (metricsElements.views) {
        metricsElements.views.textContent = String(metrics.views);
        metricsElements.whatsappClicks.textContent = String(metrics.whatsappClicks);
        metricsElements.formSubmissions.textContent = String(metrics.formSubmissions);
        metricsElements.formStarts.textContent = String(metrics.formStarts);
        metricsElements.whatsappRate.textContent = formatRate(metrics.whatsappClicks, metrics.views);
        metricsElements.formRate.textContent = formatRate(metrics.formSubmissions, metrics.views);
        metricsElements.dailyViews.textContent = String(dailyViews);
        metricsElements.activeDays.textContent = String(activeDays);
    }
};

const buildReservationMessage = (formData) => {
    const lines = [
        "Hola, quiero reservar velas Vela-Vita.",
        "",
        `Nombre: ${formData.get("nombre")}`,
        `Apellido: ${formData.get("apellido")}`,
        `Email: ${formData.get("email")}`,
        `Telefono: ${formData.get("telefono")}`,
        `Tipo de evento: ${formData.get("evento")}`,
        `Cantidad aproximada de velas: ${formData.get("cantidad")}`,
        `Notas: ${formData.get("notas") || "Sin notas adicionales."}`
    ];

    return `${whatsappBaseUrl}${encodeURIComponent(lines.join("\n"))}`;
};

const openCeoPanel = () => {
    if (!ceoPanel) {
        return;
    }

    ceoPanel.hidden = false;
    ceoPassword?.focus();
};

const closeCeoPanel = () => {
    if (!ceoPanel) {
        return;
    }

    ceoPanel.hidden = true;
};

const hideInstallButton = () => {
    if (!installAppButton) {
        return;
    }

    installAppButton.hidden = true;
};

const showInstallButton = () => {
    if (!installAppButton) {
        return;
    }

    installAppButton.hidden = false;
};

renderMetrics();

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

const setupTestimonialsCarousel = () => {
    if (!testimonialSlides.length || !testimonialsDots) {
        return;
    }

    let activeIndex = 0;
    const dots = testimonialSlides.map((_slide, index) => {
        const dot = document.createElement("span");
        dot.className = `testimonial-dot${index === 0 ? " is-active" : ""}`;
        testimonialsDots.appendChild(dot);
        return dot;
    });

    window.setInterval(() => {
        testimonialSlides[activeIndex].classList.remove("is-active");
        dots[activeIndex].classList.remove("is-active");

        activeIndex = (activeIndex + 1) % testimonialSlides.length;

        testimonialSlides[activeIndex].classList.add("is-active");
        dots[activeIndex].classList.add("is-active");
    }, 1000);
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

whatsappLinks.forEach((link) => {
    link.addEventListener("click", () => {
        void incrementFirebaseMetric("whatsappClicks");
    });
});

formInputs.forEach((input) => {
    input.addEventListener("input", () => {
        if (formStarted) {
            return;
        }

        formStarted = true;
        void incrementFirebaseMetric("formStarts");
    });
});

form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const whatsappReservationUrl = buildReservationMessage(formData);

    try {
        await saveReservationToFirebase(payload);
        await incrementFirebaseMetric("formSubmissions");
    } catch {
        incrementMetric("formSubmissions");
    }

    successMessage?.removeAttribute("hidden");
    form.reset();
    formStarted = false;

    if (eventSelect) {
        eventSelect.selectedIndex = 0;
    }

    window.open(whatsappReservationUrl, "_blank", "noopener,noreferrer");
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

ceoAccessButton?.addEventListener("click", openCeoPanel);
ceoClose?.addEventListener("click", closeCeoPanel);

ceoLogin?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!ceoPassword || !ceoContent || !ceoLogin) {
        return;
    }

    if (ceoPassword.value !== ceoAccessKey) {
        window.alert("Clave incorrecta.");
        ceoPassword.select();
        return;
    }

    ceoUnlocked = true;
    ceoLogin.hidden = true;
    ceoContent.hidden = false;
    void refreshMetrics();
});

ceoRefresh?.addEventListener("click", () => {
    void refreshMetrics();
});

ceoReset?.addEventListener("click", async () => {
    if (!ceoUnlocked) {
        window.alert("Primero debes ingresar al panel CEO.");
        return;
    }

    const confirmationPassword = window.prompt("Ingresa la clave para confirmar la limpieza de metricas:");

    if (confirmationPassword !== ceoAccessKey) {
        window.alert("Clave incorrecta. No se limpiaron las metricas.");
        return;
    }

    try {
        await resetFirebaseMetrics();
        window.alert("Metricas reiniciadas.");
    } catch {
        window.alert("No se pudieron limpiar las metricas.");
    }
});

installAppButton?.addEventListener("click", async () => {
    if (!deferredInstallPrompt) {
        return;
    }

    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;

    if (outcome === "accepted") {
        hideInstallButton();
    }

    deferredInstallPrompt = null;
});

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

    if (event.key === "Escape" && ceoPanel && !ceoPanel.hidden) {
        closeCeoPanel();
    }
});

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    showInstallButton();
});

window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    hideInstallButton();
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js").catch(() => {
            hideInstallButton();
        });
    });
}

window.addEventListener("load", async () => {
    await refreshMetrics();
    await incrementFirebaseMetric("views");
    setupTestimonialsCarousel();
});