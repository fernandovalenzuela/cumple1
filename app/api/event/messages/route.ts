import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/* =========================
   GET
   Lista pública
========================= */

export async function GET(
  req: Request
) {
  try {
    const { searchParams } =
      new URL(req.url);

    const birthdayEventId =
      searchParams.get(
        "birthdayEventId"
      );

    if (!birthdayEventId) {
      return NextResponse.json(
        [],
        { status: 400 }
      );
    }

    const data = await sql`
      SELECT
        id,
        name,
        message,
        response,
        updated_at
      FROM "birthdayMessages"
      WHERE
        "birthdayEventId" =
          ${birthdayEventId}
        AND "isVisible" = true
      ORDER BY updated_at DESC
    `;

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "GET messages error:",
      error
    );

    return NextResponse.json(
      [],
      { status: 500 }
    );
  }
}

/* =========================
   POST
   UPSERT
========================= */

export async function POST(
  req: Request
) {
  try {
    const {
      mode,

      birthdayEventId,

      guestId,

      authorKey,

      name,

      message,
    } = await req.json();

    if (
      !birthdayEventId ||
      !message
    ) {
      return NextResponse.json(
        {
          error:
            "Missing data",
        },
        { status: 400 }
      );
    }

    let existing;

    /* =========================
       PRIVATE
    ========================= */

    if (
      mode === "private"
    ) {
      existing = await sql`
        SELECT id
        FROM "birthdayMessages"
        WHERE
          "birthdayEventId" =
            ${birthdayEventId}
          AND "guestId" =
            ${guestId}
        LIMIT 1
      `;
    }

    /* =========================
       OPEN / PUBLIC
    ========================= */

    else {
      existing = await sql`
        SELECT id
        FROM "birthdayMessages"
        WHERE
          "birthdayEventId" =
            ${birthdayEventId}
          AND "authorKey" =
            ${authorKey}
        LIMIT 1
      `;
    }

    /* =========================
       UPDATE
    ========================= */

    if (
      existing.length > 0
    ) {
      /* 
        Si el invitado modifica el mensaje,
        se elimina la respuesta anterior del organizador
        porque puede haber quedado desactualizada.
      */
      await sql`
        UPDATE
          "birthdayMessages"
        SET
          message =
            ${message},

          name =
            ${name ?? null},

          response = null,

          "responseDate" = null

        WHERE id =
          ${existing[0].id}
      `;
    }

    /* =========================
       INSERT
    ========================= */

    else {
      await sql`
        INSERT INTO
        "birthdayMessages"
        (
          "birthdayEventId",

          "guestId",

          "authorKey",

          name,

          message
        )
        VALUES
        (
          ${birthdayEventId},

          ${guestId ??
            null},

          ${authorKey ??
            null},

          ${name ??
            null},

          ${message}
        )
      `;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "POST messages error:",
      error
    );

    return NextResponse.json(
      { error: true },
      { status: 500 }
    );
  }
}