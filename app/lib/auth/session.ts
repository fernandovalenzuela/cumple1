//"use server";

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export enum SessionType{
  Organizer=0,
  PartnerEvent=1,
}

export interface SessionData{
  type:SessionType;
  accountId?:number;
  eventId?:number;
}

const COOKIE_NAME="birthday_session";
const COOKIE_MAX_AGE=60*60*24*30;

function getSecret():string{

  const secret=process.env.SESSION_SECRET;

  if(!secret)
    throw new Error("SESSION_SECRET no configurado.");

  return secret;

}

function sign(payload:string):string{

  return createHmac("sha256",getSecret())
    .update(payload)
    .digest("hex");

}

function serialize(session:SessionData):string{

  const payload=Buffer
    .from(JSON.stringify(session))
    .toString("base64url");

  const signature=sign(payload);

  return `${payload}.${signature}`;

}

function deserialize(value:string):SessionData|null{

  const parts=value.split(".");

  if(parts.length!==2)
    return null;

  const payload=parts[0];
  const signature=parts[1];
  const expected=sign(payload);

  const signatureBuffer=Buffer.from(signature,"hex");
  const expectedBuffer=Buffer.from(expected,"hex");

  if(signatureBuffer.length!==expectedBuffer.length)
    return null;

  if(!timingSafeEqual(signatureBuffer,expectedBuffer))
    return null;

  try{

    return JSON.parse(
      Buffer.from(payload,"base64url").toString("utf8")
    ) as SessionData;

  }
  catch{

    return null;

  }

}

export async function createSession(session:SessionData):Promise<void>{

  const cookieStore=await cookies();

  // esto es para poder hacer debug en celular en red local
  const appUrl=process.env.APP_URL ?? "";
  const isLocalNetwork=appUrl.startsWith("http://192.168.");

  cookieStore.set(COOKIE_NAME,serialize(session),{
    httpOnly:true,
    /*secure:process.env.NODE_ENV==="production",*/
    secure:!isLocalNetwork,
    sameSite:"lax",
    path:"/",
    maxAge:COOKIE_MAX_AGE,
  });

}

export async function getCurrentSession():Promise<SessionData|null>{

  const cookieStore=await cookies();

  const cookie=cookieStore.get(COOKIE_NAME);

  if(!cookie)
    return null;

  return deserialize(cookie.value);

}

export async function destroySession():Promise<void>{

  const cookieStore=await cookies();

  cookieStore.delete(COOKIE_NAME);

}