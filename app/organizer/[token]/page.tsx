import AdminLayout from "@/components/event-editor/AdminLayout";
import { sql } from "@/lib/db";

export default async function Page({ params }: any) {
  const { token } = await params;

  const result = await sql`
    SELECT * FROM "birthdayEvents"
    WHERE "publicSlug" = ${token}
    LIMIT 1
  `;



  const event = result[0];

  return <AdminLayout initialEvent={event} />;
}