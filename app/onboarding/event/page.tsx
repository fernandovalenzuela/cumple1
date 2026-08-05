import { redirect } from "next/navigation";
import EventPage from "./EventPage";
import { sql } from "@/lib/db";
import { Status } from "@/lib/constants";
import { getCurrentSession,SessionType } from "@/lib/auth/session";

export default async function Page(){

  const session=await getCurrentSession();
console.log("## event 1 ", session);
  if(!session || session.type!==SessionType.Organizer || !session.accountId)
    redirect("/onboarding");

  const events=await sql<{id:number}[]>`
    select id
    from "birthdayEvents"
    where "accountId"=${session.accountId}
    and status=${Status.Draft}
    limit 1
  `;
console.log("## event 2 ", events.length);
  if(events.length===0)
    redirect("/onboarding");

  return <EventPage/>;

}