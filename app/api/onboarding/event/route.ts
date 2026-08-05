import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { randomUUID } from "crypto";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      waPhone,
      country,
      name,
      eventBirthday,
      locationName,
      locationAddress,
      celebratedAge,
    } = body;

    if (!fullName || !email || !name || !eventBirthday) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const isMinorEvent = celebratedAge - 1 < 18;
    const imageProcessingStatus = isMinorEvent ? 1 : 0;

    const token = randomUUID();

    /* =========================
       1. CREAR ACCOUNT
    ========================= */
    const customer = await sql`
      INSERT INTO "birthdayAccounts"
      ("fullName", email, "waPhone", country)
      VALUES (${fullName}, ${email}, ${waPhone}, ${country})
      RETURNING id
    `;

    const accountId = customer[0].id;

    /* =========================
       2. CREAR EVENT
    ========================= */
    await sql`
      INSERT INTO "birthdayEvents"
      (
        name,
        "eventBirthday",
        "locationName",
        "locationAddress",
        "celebratedAge",
        "isMinorEvent",
        "imageProcessingStatus",
        status,
        "accountId",
        "publicSlug"
      )
      VALUES (
        ${name},
        ${eventBirthday},
        ${locationName},
        ${locationAddress},
        ${celebratedAge},
        ${isMinorEvent},
        ${imageProcessingStatus},
        ${3}, -- PendingReview
        ${accountId},
        ${token}
      )
    `;

    return NextResponse.json({
      success: true,
      token,
      editorUrl: `/organizer/${token}`,
    });

  } catch (err) {
    console.error("Error onboarding:", err);

    return NextResponse.json(
      { error: "Error creando evento" },
      { status: 500 }
    );
  }
}