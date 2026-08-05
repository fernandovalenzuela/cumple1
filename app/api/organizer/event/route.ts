import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PUT(req: NextRequest) {
try {
const body = await req.json();

if (!body?.id) {
  return NextResponse.json(
    { error: "Missing event id" },
    { status: 400 }
  );
}

const { id, ...fields } = body;

// 🔥 limpiar undefined
const cleanFields = Object.fromEntries(
  Object.entries(fields).filter(([_, v]) => v !== undefined)
);

// 🔥 construir query dinámico
const keys = Object.keys(cleanFields);
const values = Object.values(cleanFields);

if (keys.length === 0) {
  return NextResponse.json({ ok: true });
}

const setQuery = keys
  .map((key, i) => `"${key}" = $${i + 1}`)
  .join(", ");

await sql.unsafe(
  `UPDATE "birthdayEvents" SET ${setQuery} WHERE id = $${
    keys.length + 1
  }`,
  [...values, id]
);

return NextResponse.json({ ok: true });

} catch (err) {
console.error("Error updating event:", err);

return NextResponse.json(
  { error: "Server error" },
  { status: 500 }
);

}
}

// compatibilidad
export async function POST(req: NextRequest) {
return PUT(req);
}