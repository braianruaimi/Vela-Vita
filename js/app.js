const form = document.getElementById("reservation-form");
const successMessage = document.getElementById("form-success");
const productButtons = document.querySelectorAll("[data-producto]");
const productAddButtons = document.querySelectorAll("[data-add-product]");
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
const floatingCartButton = document.getElementById("floating-cart-button");
const floatingCartCount = document.getElementById("floating-cart-count");
const cartPanel = document.getElementById("cart-panel");
const cartClose = document.getElementById("cart-close");
const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartTotalCount = document.getElementById("cart-total-count");
const cartClear = document.getElementById("cart-clear");
const cartSend = document.getElementById("cart-send");

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
let cart = [];

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
        "Hola, quiero solicitar una propuesta para velas Vela-Vita.",
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

const buildProductInquiryMessage = (productName) => {
    const lines = [
        "Hola, quiero consultar la disponibilidad de esta pieza de Vela-Vita.",
        "",
        `Producto: ${productName}`
    ];

    return `${whatsappBaseUrl}${encodeURIComponent(lines.join("\n"))}`;
};

const buildCartMessage = () => {
    const lines = ["Hola, quiero confirmar esta seleccion de Vela-Vita.", ""];

    cart.forEach((item, index) => {
        lines.push(`${index + 1}. ${item.name} x ${item.quantity}`);
    });

    lines.push("");
    lines.push(`Total de piezas: ${cart.reduce((total, item) => total + item.quantity, 0)}`);

    return `${whatsappBaseUrl}${encodeURIComponent(lines.join("\n"))}`;
};

const openCartPanel = () => {
    if (!cartPanel) {
        return;
    }

    cartPanel.hidden = false;
};

const closeCartPanel = () => {
    if (!cartPanel) {
        return;
    }

    cartPanel.hidden = true;
};

const updateCartCount = () => {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (floatingCartCount) {
        floatingCartCount.textContent = String(total);
    }

    if (cartTotalCount) {
        cartTotalCount.textContent = String(total);
    }
};

const renderCart = () => {
    if (!cartItems || !cartEmpty) {
        return;
    }

    const previousItems = cartItems.querySelectorAll(".cart-item");
    previousItems.forEach((item) => item.remove());

    if (!cart.length) {
        cartEmpty.hidden = false;
        updateCartCount();
        return;
    }

    cartEmpty.hidden = true;

    cart.forEach((item) => {
        const row = document.createElement("article");
        row.className = "cart-item";

        const content = document.createElement("div");
        const name = document.createElement("strong");
        name.textContent = item.name;
        const detail = document.createElement("p");
        detail.textContent = "Puedes seguir sumando piezas o enviar tu pedido por WhatsApp.";
        content.append(name, detail);

        const actions = document.createElement("div");
        actions.className = "cart-item-actions";

        const subtractButton = document.createElement("button");
        subtractButton.className = "cart-qty-button";
        subtractButton.type = "button";
        subtractButton.textContent = "-";
        subtractButton.addEventListener("click", () => {
            item.quantity -= 1;

            if (item.quantity <= 0) {
                cart = cart.filter((cartItem) => cartItem.name !== item.name);
            }

            renderCart();
        });

        const value = document.createElement("span");
        value.className = "cart-qty-value";
        value.textContent = String(item.quantity);

        const addButton = document.createElement("button");
        addButton.className = "cart-qty-button";
        addButton.type = "button";
        addButton.textContent = "+";
        addButton.addEventListener("click", () => {
            item.quantity += 1;
            renderCart();
        });

        actions.append(subtractButton, value, addButton);
        row.append(content, actions);
        cartItems.appendChild(row);
    });

    updateCartCount();
};

const addToCart = (productName) => {
    const existingItem = cart.find((item) => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            quantity: 1
        });
    }

    renderCart();
    openCartPanel();
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
        answer: "Los valores dependen del modelo, la cantidad y el tipo de pedido. Puedes completar el formulario o escribirnos por WhatsApp para recibir una propuesta personalizada."
    },
    {
        keywords: ["evento", "eventos", "casamiento", "boda", "cumpleanos", "cumpleanos"],
        answer: "Si, realizamos pedidos especiales para cumpleanos, casamientos, bautismos y celebraciones con una propuesta a medida. Podemos ayudarte a crear una ambientacion delicada, memorable y alineada con el estilo de tu evento."
    },
    {
        keywords: ["souvenir", "souvenirs", "recuerdo", "recuerdos"],
        answer: "Si buscas souvenirs, en Vela-Vita podemos preparar piezas delicadas y personalizadas que dejen un recuerdo especial en tus invitados. Son ideales para celebraciones elegantes y detalles con identidad propia."
    },
    {
        keywords: ["decoracion", "deco", "ambientacion", "hogar"],
        answer: "Nuestras velas tambien estan pensadas para decoracion y ambientacion. Podemos ayudarte a elegir piezas que aporten calidez, estilo y una presencia sutil pero inolvidable en cualquier espacio."
    },
    {
        keywords: ["centro de mesa", "centros de mesa", "mesa dulce", "mesas"],
        answer: "Trabajamos propuestas para centros de mesa y mesas dulces con velas que elevan la presentacion de cada evento. Si quieres, puedes contarnos tu idea y te orientamos con una seleccion armoniosa y elegante."
    },
    {
        keywords: ["regalo", "regalos", "obsequio", "detalle"],
        answer: "Si estas buscando un regalo especial, nuestras velas son una opcion delicada, elegante y con mucha personalidad. Podemos recomendarte modelos ideales para obsequios, fechas especiales o detalles unicos."
    },
    {
        keywords: ["reserva", "reservar", "pedido", "personalizadas"],
        answer: "Puedes solicitar tu pedido desde el formulario de esta pagina. Indicanos tipo de evento, cantidad estimada y detalles para preparar una propuesta personalizada."
    },
    {
        keywords: ["entrega", "envio", "zona", "retirar"],
        answer: "La disponibilidad de entrega depende de la zona y del volumen del pedido. Tambien podemos coordinar retiro segun cada propuesta."
    },
    {
        keywords: ["producto", "productos", "vela", "velas", "aromatica", "decorativa"],
        answer: "Contamos con piezas decorativas, aromaticas y colecciones pensadas para eventos, regalos y ambientaciones especiales. Si buscas algo puntual, cuentanos tu idea y te orientamos con una recomendacion acorde a tu necesidad."
    }
];

const defaultResponse = "Puedo ayudarte con velas para cumpleanos, casamientos, souvenirs, decoracion, centros de mesa, regalos y pedidos personalizados. Si quieres, cuentame para que ocasion estas buscando y te recomiendo una propuesta ideal.";

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
        const whatsappInquiryUrl = buildProductInquiryMessage(productName);
        void incrementFirebaseMetric("whatsappClicks");
        window.open(whatsappInquiryUrl, "_blank", "noopener,noreferrer");
    });
});

productAddButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const productName = button.getAttribute("data-add-product");
        addToCart(productName);
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
floatingCartButton?.addEventListener("click", openCartPanel);
cartClose?.addEventListener("click", closeCartPanel);
cartClear?.addEventListener("click", () => {
    cart = [];
    renderCart();
});
cartSend?.addEventListener("click", () => {
    if (!cart.length) {
        window.alert("Agrega al menos una pieza a tu seleccion.");
        return;
    }

    void incrementFirebaseMetric("whatsappClicks");
    window.open(buildCartMessage(), "_blank", "noopener,noreferrer");
});

ceoLogin?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!ceoPassword || !ceoContent || !ceoLogin) {
        return;
    }

    if (ceoPassword.value !== ceoAccessKey) {
        window.alert("Clave incorrecta. Intenta nuevamente.");
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
        window.alert("Primero debes abrir el panel de gestion.");
        return;
    }

    const confirmationPassword = window.prompt("Ingresa la clave para confirmar el reinicio de metricas:");

    if (confirmationPassword !== ceoAccessKey) {
        window.alert("Clave incorrecta. Las metricas no fueron reiniciadas.");
        return;
    }

    try {
        await resetFirebaseMetrics();
        window.alert("Metricas reiniciadas correctamente.");
    } catch {
        window.alert("No fue posible reiniciar las metricas.");
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

    if (event.key === "Escape" && cartPanel && !cartPanel.hidden) {
        closeCartPanel();
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
    renderCart();
});