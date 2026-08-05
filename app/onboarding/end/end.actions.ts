"use server";

import { getCurrentSession,SessionType } from "@/lib/auth/session";
import { AccountRepository } from "@/account/AccountRepository";

export interface UpdateContactEmailResult{
    success:boolean;
    message:string|null;
}

export async function updateContactEmail(
    email:string
):Promise<UpdateContactEmailResult>{
    const session=await getCurrentSession();
    if(!session||
       session.type!==SessionType.Organizer||
       session.accountId===undefined){
        return{
            success:false,
            message:"La sesión ha expirado.",
        };
    }

    const normalizedEmail=email.trim().toLowerCase();

    if(normalizedEmail.length===0){
        return{
            success:false,
            message:"Debes ingresar un email.",
        };
    }

    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(normalizedEmail)){
        return{
            success:false,
            message:"El formato del email no es válido.",
        };
    }

    const repository=new AccountRepository();

    await repository.updateEmail(
        session.accountId,
        normalizedEmail,
    );

    return{
        success:true,
        message:null,
    };

}