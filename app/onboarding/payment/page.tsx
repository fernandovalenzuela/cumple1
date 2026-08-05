import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { getCurrentSession,SessionType } from "@/lib/auth/session";
import { Status } from "@/lib/constants";
import OnboardingPayment from "@/components/onboarding/OnboardingPayment";
import { PaymentSummaryEvent } from "@/lib/payment/types";
import { contactEmail } from "@/lib/constants";
import { getUrlFromPaymentStatus } from "@/lib/utils";
 
export default async function Page(){

  const session=await getCurrentSession();

  if(!session||session.type!==SessionType.Organizer||!session.eventId){
    redirect("/onboarding");
  }

  const rows=await sql<PaymentSummaryEvent[]>`
    select
      e.id,
      e.name,
      e.status,
      e."eventBirthday",
      e."planId",
      p."planName",
      p.description,
      p.price,
      p.discount,
      p.currency,
      p."paymentProvider",
      p."locale"
    from "birthdayEvents" e
    join "birthdayPlans" p
      on p.id=e."planId"
    where e.id=${session.eventId}
       limit 1
  `;
  //    and p.active=true: se quito esta condicion porque  podria desactivarse un plan pero algunos clientes seguir vivos con ese mismo plan

  const row=rows[0];

  if(!row){
    redirect("/onboarding");
  }
//console.log("@@@status ", row.status);
// FERV!!! ESTO ESTA MAL! En funcion del estado del evento y del pago tiene que ser la ulr, no solamente de uno u otro

console.log("paymentstratus " +  row.status + ". eventId "+ row.id);
//const url = getUrlFromPaymentStatus(row.status);
//redirect(url);
  if(row.status!==Status.Editing&&row.status!==Status.WaitingPayment){
    //console.log("##1 redirecting to url from payment status");
    redirect("/onboarding/editor");
  }

  async function handleBack(){
    "use server";
    redirect("/onboarding/editor");
  }

  const event={
  ...row,
  contactEmail,
};

  return(
    <OnboardingPayment
      event={event}
      currentStep={4}
      totalSteps={5}
      onBack={handleBack}
    />
  );

}