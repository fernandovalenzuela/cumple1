import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

/* =========================
   ⚙️ CONFIG
========================= */

const MAX_REQUESTS = 10;
const WINDOW_MS = 5 * 60 * 1000; // 5 minutos

const ipStore = new Map<string, { count: number; time: number }>();

/* =========================
   🧠 HELPERS
========================= */

function getClientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry) {
    ipStore.set(ip, { count: 1, time: now });
    return false;
  }

  if (now - entry.time > WINDOW_MS) {
    ipStore.set(ip, { count: 1, time: now });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) {
    return true;
  }

  entry.count++;
  return false;
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

/* =========================
   🚀 POST
========================= */

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const userAgent = req.headers.get("user-agent") || "unknown";

    /* =========================
       🔥 RATE LIMIT
    ========================= */

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Demasiados intentos, intenta más tarde" },
        { status: 429 }
      );
    }

    const body = await req.json();

    const {
      id, // 👈 viene desencriptado desde frontend
      birthdayEventId,
      name,
      phone,
      people,
      message,
      foodType,
      rsvpStatus,
    } = body;

    /* =========================
       🧠 VALIDACIONES
    ========================= */

    if (!birthdayEventId || !name || !phone) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const cleanPhone = normalizePhone(phone);

    if (cleanPhone.length < 8) {
      return NextResponse.json(
        { error: "Teléfono inválido" },
        { status: 400 }
      );
    }

    /* =========================
       📊 EVENTO
    ========================= */

    const [event] = await sql`
      SELECT 
        "personMaxGuestOpenEvent",
        "askFoodType"
      FROM "birthdayEvents"
      WHERE id = ${birthdayEventId}
    `;

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    /* =========================
       👥 PEOPLE
    ========================= */

    const maxPeople = event.personMaxGuestOpenEvent || 5;

    if (!people || people < 1 || people > maxPeople) {
      return NextResponse.json(
        { error: `Máximo ${maxPeople} personas` },
        { status: 400 }
      );
    }

    /* =========================
       🍽️ FOOD
    ========================= */

    const finalFoodType = event.askFoodType ? (foodType ?? 0) : 0;

    /* =========================
       🔐 UPDATE (si hay ID válido)
    ========================= */

    if (id) {
      const [existing] = await sql`
        SELECT id
        FROM "birthdayOpenGuests"
        WHERE id = ${id}
        AND "birthdayEventId" = ${birthdayEventId}
      `;

      if (existing) {
        await sql`
          UPDATE "birthdayOpenGuests"
          SET
            name = ${name},
            phone = ${cleanPhone},
            people = ${people},
            message = ${message || null},
            "foodType" = ${finalFoodType},
            "rsvpStatus" = ${rsvpStatus ?? 0},
            updated_at = now()
          WHERE id = ${id}
        `;

        return NextResponse.json({ id }); // 👈 devolvemos mismo id
      }
    }

    /* =========================
       💾 INSERT (nuevo)
    ========================= */

    const [inserted] = await sql`
      INSERT INTO "birthdayOpenGuests" (
        "birthdayEventId",
        name,
        phone,
        people,
        message,
        "foodType",
        "rsvpStatus",
        ip,
        "userAgent"
      )
      VALUES (
        ${birthdayEventId},
        ${name},
        ${cleanPhone},
        ${people},
        ${message || null},
        ${finalFoodType},
        ${rsvpStatus ?? 0},
        ${ip},
        ${userAgent}
      )
      RETURNING id
    `;

    return NextResponse.json({ id: inserted.id });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}