import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  try {

    const { guestId, rsvpStatus, rsvpMessage, peopleConfirmed, foodType } = await req.json();

    await sql`
      UPDATE "birthdayPrivateGuests"
      SET 
        "rsvpStatus" = ${rsvpStatus},
        "rsvpMessage" = ${rsvpMessage},
        "peopleConfirmed" = ${peopleConfirmed},
        "foodType" = ${foodType}
      WHERE id = ${guestId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}