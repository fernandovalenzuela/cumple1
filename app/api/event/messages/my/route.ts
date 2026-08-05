import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  req: Request
) {
  try {
    const { searchParams } =
      new URL(req.url);

    const mode =
      searchParams.get(
        "mode"
      );

    const guestId =
      searchParams.get(
        "guestId"
      );

    const authorKey =
      searchParams.get(
        "authorKey"
      );

    let data;

    /* =========================
       PRIVATE
    ========================= */

    if (
      mode === "private"
    ) {
      data = await sql`
        SELECT
          id,
          name,
          message,
          response
        FROM
          "birthdayMessages"
        WHERE
          "guestId" =
            ${guestId}
        LIMIT 1
      `;
    }

    /* =========================
       OPEN / PUBLIC
    ========================= */

    else {
      data = await sql`
        SELECT
          id,
          name,
          message,
          response
        FROM
          "birthdayMessages"
        WHERE
          "authorKey" =
            ${authorKey}
        LIMIT 1
      `;
    }

    return NextResponse.json(
      data[0] ?? null
    );
  } catch (error) {
    console.error(
      "GET my message error:",
      error
    );

    return NextResponse.json(
      null,
      { status: 500 }
    );
  }
}