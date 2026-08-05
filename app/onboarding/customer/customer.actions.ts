"use server";

import { sql } from "@/lib/db";
import { State } from "@/lib/constants";
import bcrypt from 'bcryptjs';
import { createSession,SessionType } from "@/lib/auth/session";
import {
  validateCustomerForm,
} from "@/lib/validation/customer";
import {
  CustomerFormData,
} from "@/lib/onboarding/types";
export interface CreateCustomerResult {
  state: State;
  message: string;
  accountId?: number;
  eventId?: number;
}
import { getCountries } from "@/lib/countries";

export async function createCustomer(
  form: CustomerFormData
): Promise<CreateCustomerResult> {

  const validation = validateCustomerForm(form);
  if (!validation.valid) {
    return {
      state: State.nok,
      message: "Datos inválidos.",
    };
  }
  try {
    const email=form.email.trim().toLowerCase();
    const existing = await sql<{
      id: number;
    }[]>`
      select id
      from "birthdayAccounts"
      where lower(email)=${email}
      limit 1
    `;
    if (existing.length > 0) {
      return {
        state: State.nok,
        message:
          "Ya existe una cuenta asociada a este email. Si ya creaste un evento anteriormente, iniciá sesión para continuar administrándolo.",
      };
    }
	  const passwordHash =
		await bcrypt.hash(form.password,10);

    const country=getCountries().find(c=>c.code===form.country);
    const waPhone=(country?.phonePrefix??"")+form.waPhone;

  const result=await sql.begin(async(sql)=>{
console.log("##1 customer");
  const accounts=await sql<{id:number}[]>`
    insert into "birthdayAccounts"
    (
      "fullName",
      email,
      "waPhone",
      country,
      locale,
      currency,
      "passwordHash"
    )
    values
    (
      ${form.fullName},
      ${email},
      ${waPhone},
      ${form.country},
      ${form.locale},
      ${form.currency},
      ${passwordHash}
    )
    returning id
  `;
console.log("##2 customer");
  const accountId=accounts[0].id;

  const events=await sql<{id:number}[]>`
        insert into "birthdayEvents"
        (
          "accountId",
          status,
          "planId",
          "occasionType"
        )
        values
        (
          ${accountId},
          0,
          ${form.planId},
          ${form.occasionType}
        )
        returning id
      `;

      return{
        accountId,
        eventId:events[0].id,
      };

    });

    console.log("##3 customer result ",result);
    //console.log(typeof result.eventId, result.eventId);

    await createSession({
      type:SessionType.Organizer,
      accountId:result.accountId,
      eventId:result.eventId,
    });
console.log("##4 customer sesion ");
    return{
      state:State.ok,
      message:"Cuenta creada.",
      accountId:result.accountId,
      eventId:result.eventId,
    };
  }
  catch (error) {
    console.error(error);
    return {
      state: State.nok,
      message:
        "Ocurrió un error creando la cuenta.",
    };
  }
}