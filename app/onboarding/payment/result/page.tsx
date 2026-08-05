import { redirect } from "next/navigation";
import { getCurrentSession,SessionType } from "@/lib/auth/session";
import { PaymentQueryService } from "@/payment/PaymentQueryService";
import PaymentResultContainer from "./PaymentResultContainer";
import OnboardingPaymentResult from "@/components/onboarding/OnboardingPaymentResult";

export default async function PaymentResultPage(){

    const session=await getCurrentSession();

    if(!session||session.type!==SessionType.Organizer||!session.eventId){
        redirect("/onboarding");
    }

    const paymentQueryService=new PaymentQueryService();

    const payment=await paymentQueryService.getPaymentResult(
        session.eventId
    );

    async function handleNext(){
        "use server";
        redirect("/onboarding/end");
    }

    return(
        <>
    
        <OnboardingPaymentResult
            eventId={session.eventId}
            initialPayment={payment}
            currentStep={4}
            totalSteps={5}
            onNext={handleNext}
        />
        </>
    );

}