const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, "data");
const METRICS_FILE = path.join(DATA_DIR, "metrics.json");
const RESERVATIONS_FILE = path.join(DATA_DIR, "reservations.json");
const ADMIN_PASSWORD = process.env.CEO_PANEL_PASSWORD || "1234";
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "5492215047962";

const defaultMetrics = {
    views: 0,
    whatsappClicks: 0,
    formSubmissions: 0,
    formStarts: 0,
    createdAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString()
};

app.use(express.json());
app.use(express.static(ROOT_DIR, {
    extensions: ["html"]
}));

const ensureFile = async (filePath, fallbackValue) => {
    try {
        await fs.access(filePath);
    } catch {
        await fs.writeFile(filePath, JSON.stringify(fallbackValue, null, 2));
    }
};

const readJson = async (filePath, fallbackValue) => {
    try {
        const rawContent = await fs.readFile(filePath, "utf8");
        return JSON.parse(rawContent);
    } catch {
        await fs.writeFile(filePath, JSON.stringify(fallbackValue, null, 2));
        return fallbackValue;
    }
};

const writeJson = async (filePath, data) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

const getActiveDays = (createdAt) => {
    const start = new Date(createdAt).getTime();
    const now = Date.now();
    return Math.max(1, Math.ceil((now - start) / (1000 * 60 * 60 * 24)));
};

const buildMetricsResponse = (metrics) => {
    const activeDays = getActiveDays(metrics.createdAt);
    const safeViews = metrics.views || 0;

    return {
        ...metrics,
        growth: {
            activeDays,
            whatsappRate: safeViews ? Number(((metrics.whatsappClicks / safeViews) * 100).toFixed(1)) : 0,
            formRate: safeViews ? Number(((metrics.formSubmissions / safeViews) * 100).toFixed(1)) : 0,
            dailyViews: Number((safeViews / activeDays).toFixed(1))
        }
    };
};

const buildReservationWhatsappUrl = (reservation) => {
    const lines = [
        "Hola, quiero reservar velas Vela-Vita.",
        "",
        `Nombre: ${reservation.nombre}`,
        `Apellido: ${reservation.apellido}`,
        `Email: ${reservation.email}`,
        `Telefono: ${reservation.telefono}`,
        `Tipo de evento: ${reservation.evento}`,
        `Cantidad aproximada de velas: ${reservation.cantidad}`,
        `Notas: ${reservation.notas || "Sin notas adicionales."}`
    ];

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
};

const updateMetrics = async (updater) => {
    const metrics = await readJson(METRICS_FILE, defaultMetrics);
    const nextMetrics = updater({ ...defaultMetrics, ...metrics });
    nextMetrics.lastUpdatedAt = new Date().toISOString();
    await writeJson(METRICS_FILE, nextMetrics);
    return nextMetrics;
};

const validateReservation = (body) => {
    const requiredFields = ["nombre", "apellido", "email", "telefono", "evento", "cantidad"];
    const missingFields = requiredFields.filter((field) => !String(body[field] || "").trim());
    return missingFields;
};

app.get("/api/health", (_request, response) => {
    response.json({ ok: true });
});

app.get("/api/metrics", async (_request, response) => {
    const metrics = await readJson(METRICS_FILE, defaultMetrics);
    response.json(buildMetricsResponse({ ...defaultMetrics, ...metrics }));
});

app.post("/api/metrics/view", async (_request, response) => {
    const metrics = await updateMetrics((currentMetrics) => ({
        ...currentMetrics,
        views: currentMetrics.views + 1
    }));

    response.status(201).json(buildMetricsResponse(metrics));
});

app.post("/api/metrics/whatsapp-click", async (_request, response) => {
    const metrics = await updateMetrics((currentMetrics) => ({
        ...currentMetrics,
        whatsappClicks: currentMetrics.whatsappClicks + 1
    }));

    response.status(201).json(buildMetricsResponse(metrics));
});

app.post("/api/metrics/form-start", async (_request, response) => {
    const metrics = await updateMetrics((currentMetrics) => ({
        ...currentMetrics,
        formStarts: currentMetrics.formStarts + 1
    }));

    response.status(201).json(buildMetricsResponse(metrics));
});

app.post("/api/reservations", async (request, response) => {
    const missingFields = validateReservation(request.body);

    if (missingFields.length > 0) {
        response.status(400).json({
            error: "Faltan campos obligatorios.",
            fields: missingFields
        });
        return;
    }

    const reservations = await readJson(RESERVATIONS_FILE, []);
    const reservation = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        nombre: String(request.body.nombre).trim(),
        apellido: String(request.body.apellido).trim(),
        email: String(request.body.email).trim(),
        telefono: String(request.body.telefono).trim(),
        evento: String(request.body.evento).trim(),
        cantidad: String(request.body.cantidad).trim(),
        notas: String(request.body.notas || "").trim()
    };

    reservations.unshift(reservation);
    await writeJson(RESERVATIONS_FILE, reservations);

    const metrics = await updateMetrics((currentMetrics) => ({
        ...currentMetrics,
        formSubmissions: currentMetrics.formSubmissions + 1
    }));

    response.status(201).json({
        ok: true,
        reservation,
        whatsappUrl: buildReservationWhatsappUrl(reservation),
        metrics: buildMetricsResponse(metrics)
    });
});

app.post("/api/metrics/reset", async (request, response) => {
    const { password } = request.body || {};

    if (password !== ADMIN_PASSWORD) {
        response.status(401).json({
            error: "Clave incorrecta."
        });
        return;
    }

    const resetMetrics = {
        ...defaultMetrics,
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString()
    };

    await writeJson(METRICS_FILE, resetMetrics);
    response.json({
        ok: true,
        metrics: buildMetricsResponse(resetMetrics)
    });
});

app.get("*", (request, response, next) => {
    if (request.path.startsWith("/api/")) {
        next();
        return;
    }

    response.sendFile(path.join(ROOT_DIR, "index.html"));
});

const start = async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await ensureFile(METRICS_FILE, defaultMetrics);
    await ensureFile(RESERVATIONS_FILE, []);

    app.listen(PORT, () => {
        console.log(`Vela-Vita backend running on http://localhost:${PORT}`);
    });
};

start().catch((error) => {
    console.error("Failed to start Vela-Vita backend", error);
    process.exit(1);
});