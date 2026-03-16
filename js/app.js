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
const heroHoroscopeTrigger = document.getElementById("hero-horoscope-trigger");
const horoscopeModal = document.getElementById("horoscope-modal");
const horoscopeClose = document.getElementById("horoscope-close");
const horoscopeCta = document.getElementById("horoscope-cta");
const cartPanel = document.getElementById("cart-panel");
const cartClose = document.getElementById("cart-close");
const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartTotalCount = document.getElementById("cart-total-count");
const cartClear = document.getElementById("cart-clear");
const cartSend = document.getElementById("cart-send");
const specialTrack = document.getElementById("special-track");
const specialPrev = document.getElementById("special-prev");
const specialNext = document.getElementById("special-next");
const specialDots = document.getElementById("special-dots");
const bouquetLineTrack = document.getElementById("bouquet-line-track");
const bouquetLinePrev = document.getElementById("bouquet-line-prev");
const bouquetLineNext = document.getElementById("bouquet-line-next");
const bouquetLineDots = document.getElementById("bouquet-line-dots");
const gourmetTrack = document.getElementById("gourmet-track");
const gourmetPrev = document.getElementById("gourmet-prev");
const gourmetNext = document.getElementById("gourmet-next");
const gourmetDots = document.getElementById("gourmet-dots");
const bouquetZoomButtons = Array.from(document.querySelectorAll("[data-bouquet-zoom]"));
const bouquetLightbox = document.getElementById("bouquet-lightbox");
const bouquetLightboxImage = document.getElementById("bouquet-lightbox-image");
const bouquetLightboxClose = document.getElementById("bouquet-lightbox-close");

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
    horoscopeClicks: document.getElementById("metric-horoscope-clicks"),
    horoscopeOpens: document.getElementById("metric-horoscope-opens"),
    whatsappRate: document.getElementById("metric-whatsapp-rate"),
    formRate: document.getElementById("metric-form-rate"),
    dailyViews: document.getElementById("metric-daily-views"),
    activeDays: document.getElementById("metric-active-days")
};

const whatsappBaseUrl = "https://wa.me/5492215047962?text=";
const metricsStorageKey = "velaVitaMetrics";
const ceoAccessKey = "1234";
const horoscopeModalStorageKey = "velaVitaHoroscopeModalSeen";
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
    horoscopeClicks: 0,
    horoscopeOpens: 0,
    createdAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString()
};

let formStarted = false;
let ceoUnlocked = false;
let deferredInstallPrompt = null;
let cart = [];
let horoscopeModalTimeout = null;

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
    horoscopeClicks: Number(data?.horoscopeClicks ?? 0),
    horoscopeOpens: Number(data?.horoscopeOpens ?? 0),
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
            horoscopeClicks: 0,
            horoscopeOpens: 0,
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
                horoscopeClicks: currentDoc.horoscopeClicks,
                horoscopeOpens: currentDoc.horoscopeOpens,
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
        horoscopeClicks: 0,
        horoscopeOpens: 0,
        createdAt: now,
        lastUpdatedAt: now
    });

    syncMetrics({
        views: 0,
        whatsappClicks: 0,
        formSubmissions: 0,
        formStarts: 0,
        horoscopeClicks: 0,
        horoscopeOpens: 0,
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
        metricsElements.horoscopeClicks.textContent = String(metrics.horoscopeClicks);
        metricsElements.horoscopeOpens.textContent = String(metrics.horoscopeOpens);
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

const chatIntentCatalog = [
    {
        id: "precio",
        keywords: ["precio", "precios", "costo", "costos", "cotizacion", "valor"],
        answer: "Los valores cambian segun modelo, cantidad y tipo de pedido. Si me compartes la ocasion y una cantidad aproximada, te oriento con una propuesta mas precisa."
    },
    {
        id: "cumpleanos",
        keywords: ["cumpleanos", "cumple", "cumpleanero"],
        answer: "Para cumpleanos recomendamos piezas con presencia visual para mesa principal, souvenirs o regalos. Podemos combinar estilos delicados y aromas suaves segun la tematica."
    },
    {
        id: "casamiento",
        keywords: ["casamiento", "boda", "novios"],
        answer: "Para casamientos solemos armar opciones elegantes para souvenirs, centros de mesa y ambientacion. La propuesta se ajusta a colores, estilo y cantidad de invitados."
    },
    {
        id: "celebracion",
        keywords: ["bautismo", "comunion", "baby shower", "evento", "celebracion", "celebraciones"],
        answer: "Para celebraciones especiales podemos preparar velas personalizadas con una estetica armoniosa para decoracion, recuerdos y regalos."
    },
    {
        id: "souvenirs",
        keywords: ["souvenir", "souvenirs", "recuerdo", "recuerdos"],
        answer: "Si buscas souvenirs, te podemos recomendar formatos delicados y practicos para invitados, cuidando presentacion y coherencia visual del evento."
    },
    {
        id: "decoracion",
        keywords: ["decoracion", "deco", "ambientacion", "hogar", "centro", "mesa", "mesas", "mesa dulce"],
        answer: "Si es para decoracion o centros de mesa, podemos sugerirte modelos con buen impacto visual y una combinacion de aromas suave para no saturar el ambiente."
    },
    {
        id: "regalo",
        keywords: ["regalo", "regalos", "obsequio", "detalle"],
        answer: "Para regalo, una muy buena opcion es elegir velas bouquet o gourmet segun el estilo de la persona. Si me dices para quien es, te propongo una seleccion concreta."
    },
    {
        id: "pedido",
        keywords: ["reserva", "reservar", "pedido", "personalizadas", "personalizado", "encargo"],
        answer: "Puedes iniciar tu pedido desde el formulario de esta pagina o por WhatsApp. Con ocasion, cantidad y fecha aproximada ya te armamos propuesta."
    },
    {
        id: "entrega",
        keywords: ["entrega", "envio", "zona", "retirar", "retiro"],
        answer: "La entrega depende de la zona y del volumen del pedido. Tambien podemos coordinar retiro segun disponibilidad."
    },
    {
        id: "productos",
        keywords: ["producto", "productos", "vela", "velas", "aromatica", "decorativa", "bouquet", "gourmet"],
        answer: "Tenemos lineas bouquet, gourmet, souvenirs y modelos especiales para eventos, regalos y ambientaciones. Si quieres, te recomiendo una opcion segun tu ocasion."
    }
];

const defaultResponse = "Puedo ayudarte con precios, recomendaciones por tipo de evento, souvenirs, decoracion, regalos, entregas y pedidos personalizados. Cuentame que necesitas y te respondo puntual.";
const chatConversationState = {
    lastIntentId: null,
    lastOccasion: null,
    lastQuantity: null
};

const normalizeChatText = (value) => value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

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

const extractConversationDetails = (normalizedInput) => {
    const quantityMatch = normalizedInput.match(/\b(\d{1,4})\b/);
    const occasionTerms = [
        "cumpleanos",
        "casamiento",
        "boda",
        "bautismo",
        "comunion",
        "baby shower",
        "evento",
        "regalo",
        "hogar"
    ];

    const occasionMatch = occasionTerms.find((term) => normalizedInput.includes(term));

    return {
        quantity: quantityMatch ? Number(quantityMatch[1]) : null,
        occasion: occasionMatch ?? null
    };
};

const getIntentScore = (normalizedInput, intent) => {
    return intent.keywords.reduce((score, keyword) => {
        const normalizedKeyword = normalizeChatText(keyword);

        if (!normalizedInput.includes(normalizedKeyword)) {
            return score;
        }

        if (normalizedKeyword.includes(" ")) {
            return score + 2;
        }

        return score + 1;
    }, 0);
};

const getBotReply = (input) => {
    const normalizedInput = normalizeChatText(input);
    const { quantity, occasion } = extractConversationDetails(normalizedInput);
    const scoredIntents = chatIntentCatalog
        .map((intent) => ({ intent, score: getIntentScore(normalizedInput, intent) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score);

    let selectedIntents = scoredIntents.slice(0, 2);

    if (!selectedIntents.length && chatConversationState.lastIntentId) {
        const previousIntent = chatIntentCatalog.find((intent) => intent.id === chatConversationState.lastIntentId);

        if (previousIntent) {
            selectedIntents = [{ intent: previousIntent, score: 1 }];
        }
    }

    if (quantity) {
        chatConversationState.lastQuantity = quantity;
    }

    if (occasion) {
        chatConversationState.lastOccasion = occasion;
    }

    if (selectedIntents.length) {
        chatConversationState.lastIntentId = selectedIntents[0].intent.id;
    }

    const detailLine = [];

    if (chatConversationState.lastOccasion) {
        detailLine.push(`ocasion: ${chatConversationState.lastOccasion}`);
    }

    if (chatConversationState.lastQuantity) {
        detailLine.push(`cantidad estimada: ${chatConversationState.lastQuantity}`);
    }

    if (!selectedIntents.length) {
        return `${defaultResponse} ${detailLine.length ? `Tambien tome nota de ${detailLine.join(" | ")}.` : ""}`.trim();
    }

    const primaryAnswer = selectedIntents[0].intent.answer;
    const secondaryAnswer = selectedIntents[1] ? ` ${selectedIntents[1].intent.answer}` : "";
    const contextPrompt = detailLine.length
        ? ` Si quieres, te armo una recomendacion basada en ${detailLine.join(" y ")}.`
        : " Si me dices ocasion y cantidad estimada, te doy una recomendacion mas puntual.";

    return `${primaryAnswer}${secondaryAnswer}${contextPrompt}`;
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

const setupProductCarousel = (trackElement, prevButton, nextButton, dotsElement) => {
    if (!trackElement || !dotsElement) {
        return;
    }

    const slides = Array.from(trackElement.querySelectorAll(".bouquet-slide"));
    const viewportElement = trackElement.parentElement;

    if (!slides.length) {
        return;
    }

    let activeIndex = 0;
    const dots = slides.map((_slide, index) => {
        const dot = document.createElement("span");
        dot.className = `bouquet-dot${index === 0 ? " is-active" : ""}`;
        dotsElement.appendChild(dot);
        return dot;
    });

    const render = () => {
        trackElement.style.transform = `translateX(-${activeIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle("is-active", index === activeIndex);
        });
    };

    prevButton?.addEventListener("click", () => {
        activeIndex = (activeIndex - 1 + slides.length) % slides.length;
        render();
    });

    nextButton?.addEventListener("click", () => {
        activeIndex = (activeIndex + 1) % slides.length;
        render();
    });

    if (viewportElement) {
        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 45;

        viewportElement.addEventListener("touchstart", (event) => {
            touchStartX = event.changedTouches[0]?.clientX ?? 0;
            touchEndX = touchStartX;
        }, { passive: true });

        viewportElement.addEventListener("touchmove", (event) => {
            touchEndX = event.changedTouches[0]?.clientX ?? touchEndX;
        }, { passive: true });

        viewportElement.addEventListener("touchend", () => {
            const deltaX = touchEndX - touchStartX;

            if (Math.abs(deltaX) < swipeThreshold) {
                return;
            }

            if (deltaX < 0) {
                activeIndex = (activeIndex + 1) % slides.length;
            } else {
                activeIndex = (activeIndex - 1 + slides.length) % slides.length;
            }

            render();
        });
    }

    render();
};

const openBouquetLightbox = (imageSrc, imageAlt) => {
    if (!bouquetLightbox || !bouquetLightboxImage) {
        return;
    }

    bouquetLightboxImage.src = imageSrc;
    bouquetLightboxImage.alt = imageAlt || "Vista ampliada de Vela bouquet";
    bouquetLightbox.hidden = false;
};

const closeBouquetLightbox = () => {
    if (!bouquetLightbox || !bouquetLightboxImage) {
        return;
    }

    bouquetLightbox.hidden = true;
    bouquetLightboxImage.src = "";
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

const canShowHoroscopeModal = () => {
    try {
        return window.sessionStorage.getItem(horoscopeModalStorageKey) !== "true";
    } catch {
        return true;
    }
};

const markHoroscopeModalAsSeen = () => {
    try {
        window.sessionStorage.setItem(horoscopeModalStorageKey, "true");
    } catch {
        // Ignore storage access failures and allow the modal to remain ephemeral.
    }
};

const openHoroscopeModal = () => {
    if (!horoscopeModal || !canShowHoroscopeModal()) {
        return;
    }

    horoscopeModal.hidden = false;
    void incrementFirebaseMetric("horoscopeOpens");
    markHoroscopeModalAsSeen();
};

const showHoroscopeModalDirectly = () => {
    if (!horoscopeModal) {
        return;
    }

    horoscopeModal.hidden = false;
    void incrementFirebaseMetric("horoscopeOpens");
    markHoroscopeModalAsSeen();
    horoscopeModal.scrollIntoView({ behavior: "smooth", block: "center" });
};

const closeHoroscopeModal = () => {
    if (!horoscopeModal) {
        return;
    }

    horoscopeModal.hidden = true;
    markHoroscopeModalAsSeen();
};

horoscopeModal?.addEventListener("click", (event) => {
    if (event.target === horoscopeModal) {
        closeHoroscopeModal();
    }
});

horoscopeModal?.addEventListener("pointerdown", (event) => {
    if (event.target === horoscopeModal) {
        closeHoroscopeModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && horoscopeModal && !horoscopeModal.hidden) {
        closeHoroscopeModal();
    }
});

chatToggle?.addEventListener("click", () => {
    if (chatPanel?.hidden) {
        openChat();
        return;
    }

    closeChat();
});

chatClose?.addEventListener("click", closeChat);
horoscopeClose?.addEventListener("click", closeHoroscopeModal);
horoscopeClose?.addEventListener("pointerdown", closeHoroscopeModal);
bouquetLightboxClose?.addEventListener("click", closeBouquetLightbox);
bouquetZoomButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const imageSrc = button.getAttribute("data-image");
        const imageAlt = button.getAttribute("data-alt");

        if (!imageSrc) {
            return;
        }

        openBouquetLightbox(imageSrc, imageAlt);
    });
});

bouquetLightbox?.addEventListener("click", (event) => {
    if (event.target === bouquetLightbox) {
        closeBouquetLightbox();
    }
});

bouquetLightbox?.addEventListener("pointerdown", (event) => {
    if (event.target === bouquetLightbox) {
        closeBouquetLightbox();
    }
});

horoscopeCta?.addEventListener("click", () => {
    void incrementFirebaseMetric("horoscopeClicks");
    closeHoroscopeModal();
});
heroHoroscopeTrigger?.addEventListener("click", showHoroscopeModalDirectly);

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

    if (event.key === "Escape" && horoscopeModal && !horoscopeModal.hidden) {
        closeHoroscopeModal();
    }

    if (event.key === "Escape" && bouquetLightbox && !bouquetLightbox.hidden) {
        closeBouquetLightbox();
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
    setupProductCarousel(specialTrack, specialPrev, specialNext, specialDots);
    setupProductCarousel(bouquetLineTrack, bouquetLinePrev, bouquetLineNext, bouquetLineDots);
    setupProductCarousel(gourmetTrack, gourmetPrev, gourmetNext, gourmetDots);
    renderCart();

    if (canShowHoroscopeModal()) {
        horoscopeModalTimeout = window.setTimeout(() => {
            openHoroscopeModal();
        }, 15000);
    }
});