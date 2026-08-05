import { redirect } from "next/navigation";
import { ONBOARDING } from "@/lib/constants";
import { getCurrentSession } from "@/lib/auth/session";
import { AccountRepository } from "@/account/AccountRepository";
import OnboardingEnd from "./OnboardingEnd";

export default async function Page(){
    const session=await getCurrentSession();
    if(!session){
        redirect("/login");
    }
    if(session.accountId===undefined){
        throw new Error("La sesión no contiene accountId.");
    }
    const repository=new AccountRepository();
    const account=await repository.findById(session.accountId);
    if(!account){
        throw new Error(`Cuenta inexistente. AccountId: ${session.accountId}`);
    }

    async function handleNext(){
        "use server";
        redirect("/admin/events");
    }

    return(
        <OnboardingEnd
            currentStep={ONBOARDING.totalSteps}
            totalSteps={ONBOARDING.totalSteps}
            contactEmail={account.email}
            loading={false}
            onNext={handleNext}
        />
    );
}