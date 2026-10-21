"use server";

import { sql } from "@/lib/db";
import { State, Status } from "@/lib/constants";
import { getCoordinates } from "@/lib/countries";
import { getCurrentSession,SessionType } from "@/lib/auth/session";

export interface UpdateEventData {
  name:string;
  eventBirthday:string;
  locationName:string;
  locationAddress:string;
  celebratedAge:number|null;
  isMinorEvent:boolean;
}

export interface UpdateEventResult {
  state:State;
  message:string;
}

export async function updateEvent(data:UpdateEventData):Promise<UpdateEventResult>{

  if(data.name.trim().length<2){
    return{
      state:State.nok,
      message:"Ingresá el nombre del evento.",
    };
  }

  if(data.eventBirthday===""){
    return{
      state:State.nok,
      message:"Ingresá la fecha y hora del evento.",
    };
  }

  /*if(data.locationName.trim().length<2){
    return{
      state:State.nok,
      message:"Ingresá el nombre del lugar.",
    };
  }*/

  if(data.locationAddress.trim().length<2){
    return{
      state:State.nok,
      message:"Ingresá la dirección del evento.",
    };
  }

  const session=await getCurrentSession();

  if(!session || session.type!==SessionType.Organizer || !session.accountId){
    return{
      state:State.nok,
      message:"Sesión inválida.",
    };
  }

  try{

    const coordinates=await getCoordinates(data.locationAddress.trim());
    const eventBirthday=data.eventBirthday.replace("T"," ")+":00";

    await sql`
      update "birthdayEvents"
      set
        name=${data.name.trim()},
        "eventBirthday"=${sql.unsafe(`TIMESTAMP '${eventBirthday}'`)},
        "locationName"=${data.locationName.trim()},
        "locationAddress"=${data.locationAddress.trim()},
        "celebratedAge"=${data.celebratedAge},
        "isMinorEvent"=${data.isMinorEvent},
        "latitude"=${coordinates.latitude},
        "longitude"=${coordinates.longitude},
        status=${Status.Editing}
      where id=(
        select id
        from "birthdayEvents"
        where "accountId"=${session.accountId}
        and status=${Status.Draft}
        limit 1
      )
    `;

    return{
      state:State.ok,
      message:"Evento actualizado.",
    };

  }
  catch(error){

    console.error(error);

    return{
      state:State.nok,
      message:"No fue posible guardar los datos del evento.",
    };

  }

}