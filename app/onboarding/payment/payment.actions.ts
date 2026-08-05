"use server";

import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { getCurrentSession,SessionType } from "@/lib/auth/session";
import { Status } from "@/lib/constants";
import { PaymentService } from "@/payment/PaymentService";
import {PaymentResult as PaymentResultDto} from "@/payment/dto/paymentDTOs";
import {PaymentQueryService} from "@/payment/PaymentQueryService";
import { calculateTotal } from "@/lib/utils";

export async function createPayment(){

  const session=await getCurrentSession();

  if(!session||session.type!==SessionType.Organizer||!session.eventId){
    redirect("/onboarding");
  }

  const rows=await sql`
    select
      e.id,
      e.name,
      e.status,
      e."planId",
      p.price,
      p.discount,
      p.currency,
      p."paymentProvider"
    from "birthdayEvents" e
    join "birthdayPlans" p
      on p.id=e."planId"
    where e.id=${session.eventId}
      and p.active=true
    limit 1
  `;

  const event=rows[0];
console.log("##3 event", event);
  if(!event)
    throw new Error("Evento inexistente.");

  if(event.status!==Status.Editing&&event.status!==Status.WaitingPayment)
     throw new Error("Estado del evento inválido.");

  const paymentService=new PaymentService(
      event.paymentProvider,
  );

  const total = calculateTotal(event.price, event.discount);

console.log("##3 total", total);
  
  if (total>0) {

    return await paymentService.createPayment({
        eventId:event.id,
        amount:total,
        currency:event.currency,
        description:event.name,
    });

  } else {
    // FREE! 0$
    return await paymentService.createFreePayment({
        eventId:event.id,
        amount:total,
        currency:event.currency,
        description:event.name,
    });
  }

}


export async function getPaymentResult():Promise<PaymentResultDto>{

    const session=await getCurrentSession();

    if(!session||session.type!==SessionType.Organizer||!session.eventId){
        redirect("/onboarding");
    }

    const paymentQueryService=new PaymentQueryService();

    return await paymentQueryService.getPaymentResult(
        session.eventId
    );
}
