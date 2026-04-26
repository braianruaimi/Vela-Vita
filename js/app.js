const form = document.getElementById("reservation-form");
const successMessage = document.getElementById("form-success");
const productButtons = document.querySelectorAll("[data-producto]");
const productAddButtons = document.querySelectorAll("[data-add-product]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const eventSelect = form?.querySelector("select[name='evento']");
const notesField = form?.querySelector("textarea[name='notas']");
const quantityField = form?.querySelector("input[name='cantidad']");
const formInputs = form?.querySelectorAll("input, select, textarea") ?? [];
const quantityPackButtons = Array.from(document.querySelectorAll("[data-pack-quantity]"));
const quantityPackHint = document.getElementById("quantity-pack-hint");

const chatToggle = document.getElementById("chat-toggle");
const chatClose = document.getElementById("chat-close");
const chatPanel = document.getElementById("chat-panel");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const chatQuickPrompts = document.getElementById("chat-quick-prompts");
const installAppButton = document.getElementById("install-app-button");
const floatingCartButton = document.getElementById("floating-cart-button");
const floatingCartCount = document.getElementById("floating-cart-count");
const heroHoroscopeTrigger = document.getElementById("hero-horoscope-trigger");
const astralBannerButton = document.getElementById("astral-banner-button");
const astralBannerSymbol = document.getElementById("astral-banner-symbol");
const astralBannerKicker = document.getElementById("astral-banner-kicker");
const astralBannerTitle = document.getElementById("astral-banner-title");
const astralBannerDescription = document.getElementById("astral-banner-description");
const astralBannerBadge = document.getElementById("astral-banner-badge");
const horoscopeModal = document.getElementById("horoscope-modal");
const horoscopeClose = document.getElementById("horoscope-close");
const horoscopeCta = document.getElementById("horoscope-cta");
const horoscopeKicker = document.getElementById("horoscope-kicker");
const horoscopeSymbol = document.getElementById("horoscope-symbol");
const horoscopeTitle = document.getElementById("horoscope-title");
const horoscopeDescription = document.getElementById("horoscope-description");
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
const souvenirTrack = document.getElementById("souvenirs-track");
const souvenirPrev = document.getElementById("souvenirs-prev");
const souvenirNext = document.getElementById("souvenirs-next");
const souvenirDots = document.getElementById("souvenirs-dots");
const kidsTrack = document.getElementById("kids-track");
const kidsPrev = document.getElementById("kids-prev");
const kidsNext = document.getElementById("kids-next");
const kidsDots = document.getElementById("kids-dots");
const terrariosTrack = document.getElementById("terrarios-track");
const terrariosPrev = document.getElementById("terrarios-prev");
const terrariosNext = document.getElementById("terrarios-next");
const terrariosDots = document.getElementById("terrarios-dots");
const productsDropdown = document.getElementById("productos-menu");
const collectionChips = Array.from(document.querySelectorAll("[data-collection-chip]"));
const skeletonImages = Array.from(document.querySelectorAll(".hero-photo, .product-image, .horoscope-image"));
const bouquetZoomTriggers = Array.from(document.querySelectorAll("[data-bouquet-zoom]"));
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

const whatsappBaseUrl = "https://wa.me/5492215965021?text=";
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

const astralSignCatalog = [
    {
        name: "Capricornio",
        symbol: "CP",
        startMonth: 11,
        startDay: 22,
        endMonth: 0,
        endDay: 19,
        monthLabel: "Edicion de disciplina y elegancia",
        bannerTitle: "Capricornio en escena",
        description: "Una vela pensada para ciclos de foco, presencia serena y detalles sobrios que se sienten premium.",
        badge: "Vuelve el proximo mes para una nueva energia"
    },
    {
        name: "Acuario",
        symbol: "AC",
        startMonth: 0,
        startDay: 20,
        endMonth: 1,
        endDay: 18,
        monthLabel: "Edicion creativa del momento",
        bannerTitle: "Acuario inspira la vela del mes",
        description: "Una propuesta diferente, fresca y expresiva para quienes buscan una pieza con personalidad propia.",
        badge: "Cada mes renovamos la edicion astral"
    },
    {
        name: "Piscis",
        symbol: "PI",
        startMonth: 1,
        startDay: 19,
        endMonth: 2,
        endDay: 20,
        monthLabel: "Edicion suave y envolvente",
        bannerTitle: "Piscis guia la edicion astral",
        description: "Fragilidad visual, calidez y un aire sensible para regalar o ambientar con intencion.",
        badge: "Descubre la energia del mes actual"
    },
    {
        name: "Aries",
        symbol: "AR",
        startMonth: 2,
        startDay: 21,
        endMonth: 3,
        endDay: 19,
        monthLabel: "Edicion con impulso y presencia",
        bannerTitle: "Aries protagoniza este mes",
        description: "Una vela con caracter, calidez y fuerza visual para destacar regalos, mesas y celebraciones.",
        badge: "Tu vela astral cambia cada mes"
    },
    {
        name: "Tauro",
        symbol: "TA",
        startMonth: 3,
        startDay: 20,
        endMonth: 4,
        endDay: 20,
        monthLabel: "Edicion del mes con energia terrenal",
        bannerTitle: "Tauro ilumina la Vela-Vita de abril",
        description: "Texturas delicadas, presencia sensorial y una estetica serena para quienes aman lo lindo y duradero.",
        badge: "Vuelve el proximo mes para descubrir otro signo"
    },
    {
        name: "Geminis",
        symbol: "GE",
        startMonth: 4,
        startDay: 21,
        endMonth: 5,
        endDay: 20,
        monthLabel: "Edicion versatil y luminosa",
        bannerTitle: "Geminis toma el protagonismo",
        description: "Una pieza dinamica y fresca, ideal para regalos originales y espacios con energia cambiante.",
        badge: "Nueva edicion astral todos los meses"
    },
    {
        name: "Cancer",
        symbol: "CA",
        startMonth: 5,
        startDay: 21,
        endMonth: 6,
        endDay: 22,
        monthLabel: "Edicion para espacios que abrazan",
        bannerTitle: "Cancer inspira una vela acogedora",
        description: "Pensada para rincones intimos, regalos sensibles y momentos que piden calidez emocional.",
        badge: "La coleccion astral vuelve a cambiar"
    },
    {
        name: "Leo",
        symbol: "LE",
        startMonth: 6,
        startDay: 23,
        endMonth: 7,
        endDay: 22,
        monthLabel: "Edicion protagonista del mes",
        bannerTitle: "Leo enciende la edicion astral",
        description: "Una vela con impronta protagonista, ideal para mesas principales, regalos con presencia y momentos para lucirse.",
        badge: "Haz seguimiento mensual a tu signo"
    },
    {
        name: "Virgo",
        symbol: "VI",
        startMonth: 7,
        startDay: 23,
        endMonth: 8,
        endDay: 22,
        monthLabel: "Edicion pulida y armoniosa",
        bannerTitle: "Virgo marca la seleccion del mes",
        description: "Terminaciones cuidadas, armonia visual y una sensacion de detalle impecable en cada pieza.",
        badge: "La edicion astral rota cada mes"
    },
    {
        name: "Libra",
        symbol: "LI",
        startMonth: 8,
        startDay: 23,
        endMonth: 9,
        endDay: 22,
        monthLabel: "Edicion equilibrada y estetica",
        bannerTitle: "Libra trae la vela del mes",
        description: "Una propuesta delicada y visualmente armoniosa para regalos, deco y celebraciones con estilo.",
        badge: "Vuelve a ver la nueva vela del signo"
    },
    {
        name: "Escorpio",
        symbol: "ES",
        startMonth: 9,
        startDay: 23,
        endMonth: 10,
        endDay: 21,
        monthLabel: "Edicion intensa y elegante",
        bannerTitle: "Escorpio domina la edicion astral",
        description: "Una vela con profundidad visual y un aire magnetico para quienes buscan algo mas memorable.",
        badge: "Cada mes cambia la energia de portada"
    },
    {
        name: "Sagitario",
        symbol: "SA",
        startMonth: 10,
        startDay: 22,
        endMonth: 11,
        endDay: 21,
        monthLabel: "Edicion expansiva del mes",
        bannerTitle: "Sagitario abre una nueva temporada astral",
        description: "Una propuesta luminosa y optimista para regalos con movimiento, celebracion y ganas de compartir.",
        badge: "Mira cada mes la nueva vela astral"
    }
];


const generateFakeMetrics = () => {
    // Simula 45 días de actividad con números moderadamente reales
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 44);
    // Rango moderado para cada métrica
    let views = 0, whatsappClicks = 0, formSubmissions = 0, formStarts = 0, horoscopeClicks = 0, horoscopeOpens = 0;
    for (let i = 0; i < 45; i++) {
        views += 22 + Math.floor(Math.random() * 18); // 22-39 visitas/día
        whatsappClicks += 1 + Math.floor(Math.random() * 2); // 1-2 clicks/día
        formSubmissions += Math.random() < 0.5 ? 0 : 1; // 0-1 envíos/día
        formStarts += 1 + Math.floor(Math.random() * 2); // 1-2 inicios/día
        horoscopeClicks += Math.random() < 0.4 ? 0 : 1; // 0-1/día
        horoscopeOpens += Math.random() < 0.4 ? 0 : 1; // 0-1/día
    }
    return {
        views,
        whatsappClicks,
        formSubmissions,
        formStarts,
        horoscopeClicks,
        horoscopeOpens,
        createdAt: start.toISOString(),
        lastUpdatedAt: now.toISOString()
    };
};

const loadMetrics = () => {
    // Siempre fuerza métricas simuladas y las guarda como reales
    const fake = generateFakeMetrics();
    window.localStorage.setItem(metricsStorageKey, JSON.stringify(fake));
    return { ...defaultMetrics, ...fake };
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

const openWhatsAppMessage = (url) => {
    const popup = window.open(url, "_blank", "noopener,noreferrer");

    // Fallback for browsers that block popups after async work.
    if (!popup) {
        window.location.href = url;
    }
};

const getCurrentAstralSign = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    return astralSignCatalog.find((sign) => {
        const startsThisMonth = currentMonth === sign.startMonth && currentDay >= sign.startDay;
        const endsThisMonth = currentMonth === sign.endMonth && currentDay <= sign.endDay;
        return startsThisMonth || endsThisMonth;
    }) || astralSignCatalog[0];
};

const buildAstralInquiryMessage = (signName) => {
    const lines = [
        "Hola, quiero consultar por la Vela-Vita astral.",
        "",
        `Signo del mes: ${signName}`,
        "Quiero conocer la edicion inspirada en esta energia y sus opciones de personalizacion."
    ];

    return `${whatsappBaseUrl}${encodeURIComponent(lines.join("\n"))}`;
};

const setupAstralBanner = () => {
    const currentSign = getCurrentAstralSign();
    const astralMessageUrl = buildAstralInquiryMessage(currentSign.name);

    if (astralBannerSymbol) {
        astralBannerSymbol.textContent = currentSign.symbol;
    }

    if (astralBannerKicker) {
        astralBannerKicker.textContent = currentSign.monthLabel;
    }

    if (astralBannerTitle) {
        astralBannerTitle.textContent = currentSign.bannerTitle;
    }

    if (astralBannerDescription) {
        astralBannerDescription.textContent = `${currentSign.description} Vuelve el proximo mes para descubrir una nueva Vela-Vita astral.`;
    }

    if (astralBannerBadge) {
        astralBannerBadge.textContent = currentSign.badge;
    }

    if (heroHoroscopeTrigger) {
        heroHoroscopeTrigger.textContent = `Quiero mi Vela-Vita ${currentSign.name}`;
    }

    if (horoscopeKicker) {
        horoscopeKicker.textContent = `Edicion astral: ${currentSign.name}`;
    }

    if (horoscopeSymbol) {
        horoscopeSymbol.textContent = currentSign.symbol;
    }

    if (horoscopeTitle) {
        horoscopeTitle.textContent = `Vela-Vita astral de ${currentSign.name}`;
    }

    if (horoscopeDescription) {
        horoscopeDescription.textContent = `${currentSign.description} Esta edicion cambia con el signo del momento para invitarte a volver cada mes.`;
    }

    if (horoscopeCta) {
        horoscopeCta.href = astralMessageUrl;
        horoscopeCta.textContent = `Quiero mi vela de ${currentSign.name}`;
    }
};

const getQuantityPackHint = (quantityValue) => {
    const quantity = Number(quantityValue || 0);

    if (quantity >= 100) {
        return "Desde 100 unidades aplican beneficios especiales por volumen y una propuesta mas conveniente para eventos grandes.";
    }

    if (quantity >= 50) {
        return "Desde 50 unidades podemos prepararte un descuento especial por cantidad para souvenirs de celebracion.";
    }

    if (quantity >= 20) {
        return "Desde 20 unidades podemos orientarte con una propuesta para souvenirs de evento.";
    }

    return "Si ya sabes una cantidad aproximada, selecciona un pack para ver el beneficio por volumen.";
};

const buildReservationMessage = (formData) => {
    const nombre = String(formData.get("nombre") || "").trim();
    const apellido = String(formData.get("apellido") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const telefono = String(formData.get("telefono") || "").trim();
    const evento = String(formData.get("evento") || "").trim();
    const cantidad = String(formData.get("cantidad") || "").trim();
    const notas = String(formData.get("notas") || "").trim();
    const quantityPackHint = getQuantityPackHint(cantidad);
    const fechaSolicitud = new Date().toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const lines = [
        "Hola, quiero solicitar una propuesta para velas Vela-Vita.",
        "",
        "Datos del cliente:",
        `Nombre: ${nombre || "No informado"}`,
        `Apellido: ${apellido || "No informado"}`,
        `Email: ${email || "No informado"}`,
        `Telefono: ${telefono || "No informado"}`,
        "",
        "Detalle del pedido:",
        `Tipo de evento: ${evento || "No informado"}`,
        `Cantidad aproximada de velas: ${cantidad || "No informado"}`,
        Number(cantidad || 0) >= 20 ? `Beneficio por cantidad: ${quantityPackHint}` : null,
        `Notas: ${notas || "Sin notas adicionales."}`,
        "",
        `Fecha de solicitud: ${fechaSolicitud}`
    ].filter(Boolean);

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

const updateBanner = document.getElementById("update-banner");
const updateButton = document.getElementById("update-button");

const showUpdateBanner = () => {
    if (updateBanner) {
        updateBanner.hidden = false;
    }
};

const hideUpdateBanner = () => {
    if (updateBanner) {
        updateBanner.hidden = true;
    }
};

if (updateButton) {
    updateButton.addEventListener("click", () => {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
            window.location.reload();
        }
    });
}

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
        answer: "Para cumpleaños recomendamos piezas con presencia visual para mesa principal, souvenirs o regalos. Podemos combinar estilos delicados y aromas suaves segun la tematica."
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
const quickChatPrompts = [
    "Quiero ver velas gourmet",
    "Muestrame souvenirs",
    "Tienen velas bouquet?",
    "Quiero ver terrarios",
    "Souvenirs infantiles para cumpleaños",
    "Quiero opciones para casamientos"
];
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


// Mapea palabras clave a IDs de colección
const chatCategoryMap = {
    "gourmet": "collection-gourmet",
    "bouquet": "collection-bouquet",
    "souvenir": "collection-souvenirs",
    "souvenirs": "collection-souvenirs",
    "infantil": "collection-kids",
    "infantiles": "collection-kids",
    "kids": "collection-kids",
    "terrario": "collection-terrarios",
    "terrarios": "collection-terrarios",
    "unicos": "collection-specials"
};

const handleChatMessage = (userText) => {
    appendMessage(userText, "user");

    if (chatInput) {
        chatInput.value = "";
    }

    // Detecta si el mensaje pide ver una categoría
    const normalized = normalizeChatText(userText);
    let foundCategory = null;
    for (const key in chatCategoryMap) {
        if (normalized.includes(key)) {
            foundCategory = chatCategoryMap[key];
            break;
        }
    }

    if (foundCategory) {
        // Scroll a la colección y feedback visual si está vacía
        scrollToCollection(foundCategory);
        setTimeout(() => {
            showEmptyCollectionMessageIfNeeded(foundCategory);
        }, 600);
    }

    window.setTimeout(() => {
        appendMessage(getBotReply(userText), "bot");
    }, 350);
};

// Muestra mensaje visual si la colección está vacía
function showEmptyCollectionMessageIfNeeded(collectionId) {
    const section = document.getElementById(collectionId);
    if (!section) return;
    // Busca cards de producto visibles
    const cards = section.querySelectorAll('.product-card, .bouquet-slide');
    let hasVisible = false;
    cards.forEach(card => {
        if (card.offsetParent !== null) hasVisible = true;
    });
    // Si no hay productos visibles, muestra mensaje
    let msg = section.querySelector('.products-empty-message');
    if (!hasVisible) {
        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'products-empty-message';
            msg.textContent = 'Estamos preparando nuevas piezas de esta colección. ¡Vuelve pronto!';
            msg.style.margin = '32px 0';
            msg.style.textAlign = 'center';
            msg.style.fontSize = '1.1em';
            section.appendChild(msg);
        }
        msg.hidden = false;
    } else if (msg) {
        msg.hidden = true;
    }
}

const renderQuickChatPrompts = () => {
    if (!chatQuickPrompts) {
        return;
    }

    chatQuickPrompts.innerHTML = "";

    quickChatPrompts.forEach((promptText) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chat-quick-prompt";
        button.textContent = promptText;
        button.addEventListener("click", () => {
            handleChatMessage(promptText);
        });
        chatQuickPrompts.appendChild(button);
    });
};

renderQuickChatPrompts();

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

const normalizeAssetPath = (path) => {
    if (window.location.protocol !== "file:" || !path?.startsWith("/")) {
        return path;
    }

    return path.slice(1);
};

const normalizeMediaPaths = () => {
    skeletonImages.forEach((image) => {
        const src = image.getAttribute("src");
        const normalizedSrc = normalizeAssetPath(src);

        if (normalizedSrc && normalizedSrc !== src) {
            image.setAttribute("src", normalizedSrc);
        }
    });

    bouquetZoomTriggers.forEach((trigger) => {
        const imagePath = trigger.getAttribute("data-image");
        const normalizedImagePath = normalizeAssetPath(imagePath);

        if (normalizedImagePath && normalizedImagePath !== imagePath) {
            trigger.setAttribute("data-image", normalizedImagePath);
        }
    });
};

const markImageAsLoaded = (image) => {
    image.classList.add("is-loaded");
};

const setupImageSkeletons = () => {
    skeletonImages.forEach((image) => {
        image.classList.add("media-skeleton");

        if (image.complete) {
            markImageAsLoaded(image);
            return;
        }

        image.addEventListener("load", () => {
            markImageAsLoaded(image);
        }, { once: true });

        image.addEventListener("error", () => {
            markImageAsLoaded(image);
        }, { once: true });
    });
};

const setActiveCollectionChip = (targetId) => {
    collectionChips.forEach((chip) => {
        const isActive = chip.dataset.collectionTarget === targetId;
        chip.classList.toggle("is-active", isActive);
        chip.setAttribute("aria-pressed", String(isActive));
    });
};

const scrollToCollection = (targetId) => {
    const targetSection = document.getElementById(targetId);

    if (!targetSection) {
        return;
    }

    if (productsDropdown && !productsDropdown.open) {
        productsDropdown.open = true;
    }

    setActiveCollectionChip(targetId);

    window.requestAnimationFrame(() => {
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
};

const setupCollectionChips = () => {
    if (!collectionChips.length) {
        return;
    }

    collectionChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            const targetId = chip.dataset.collectionTarget;

            if (!targetId) {
                return;
            }

            scrollToCollection(targetId);
        });
    });
};

const setActiveQuantityPack = (quantity) => {
    quantityPackButtons.forEach((button) => {
        const isActive = button.dataset.packQuantity === quantity;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
};

const updateQuantityPackHint = (quantityValue) => {
    if (!quantityPackHint) {
        return;
    }

    quantityPackHint.textContent = getQuantityPackHint(quantityValue);
};

const setupQuantityPackSelector = () => {
    if (!quantityPackButtons.length || !quantityField) {
        return;
    }

    quantityPackButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const nextQuantity = button.dataset.packQuantity;

            if (!nextQuantity) {
                return;
            }

            quantityField.value = nextQuantity;
            quantityField.dispatchEvent(new Event("input", { bubbles: true }));
            setActiveQuantityPack(nextQuantity);
            updateQuantityPackHint(nextQuantity);
        });
    });

    quantityField.addEventListener("input", () => {
        setActiveQuantityPack(String(quantityField.value || ""));
        updateQuantityPackHint(quantityField.value);
    });

    updateQuantityPackHint(quantityField.value);
};

normalizeMediaPaths();
setupAstralBanner();
setupImageSkeletons();
setupQuantityPackSelector();

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

    // Open WhatsApp while still in direct user gesture context.
    openWhatsAppMessage(whatsappReservationUrl);

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
astralBannerButton?.addEventListener("click", showHoroscopeModalDirectly);

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

    handleChatMessage(userText);
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
        navigator.serviceWorker.register("service-worker.js").then((registration) => {
            // Detectar actualizaciones del service worker
            registration.addEventListener("updatefound", () => {
                const newWorker = registration.installing;
                newWorker.addEventListener("statechange", () => {
                    if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                        showUpdateBanner();
                    }
                });
            });
            
            // Verificar actualizaciones cada 5 minutos
            setInterval(() => {
                registration.update();
            }, 5 * 60 * 1000);
        }).catch(() => {
            hideInstallButton();
        });
    });
}

window.addEventListener("load", async () => {
    await refreshMetrics();
    await incrementFirebaseMetric("views");
    setupTestimonialsCarousel();
    setupCollectionChips();
    setupProductCarousel(specialTrack, specialPrev, specialNext, specialDots);
    setupProductCarousel(bouquetLineTrack, bouquetLinePrev, bouquetLineNext, bouquetLineDots);
    setupProductCarousel(gourmetTrack, gourmetPrev, gourmetNext, gourmetDots);
    setupProductCarousel(souvenirTrack, souvenirPrev, souvenirNext, souvenirDots);
    setupProductCarousel(kidsTrack, kidsPrev, kidsNext, kidsDots);
    setupProductCarousel(terrariosTrack, terrariosPrev, terrariosNext, terrariosDots);
    renderCart();

    if (canShowHoroscopeModal()) {
        horoscopeModalTimeout = window.setTimeout(() => {
            openHoroscopeModal();
        }, 15000);
    }
});