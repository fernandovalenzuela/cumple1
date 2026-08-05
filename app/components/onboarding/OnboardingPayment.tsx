  "use client";

  import { useState } from "react";
  import OnboardingLayout from "./layout/OnboardingLayout";
  import StepIndicator from "./layout/StepIndicator";
  import PaymentSummary from "./PaymentSummary";
  import OnboardingPaymentFooter from "./OnboardingPaymentFooter";
  import type { PaymentSummaryEvent } from "@/lib/payment/types";
  import { createPayment } from "@/onboarding/payment/payment.actions";
  import { PaymentProviderType } from "@/lib/constants";
  import { CreatePaymentResult } from "@/payment/dto/paymentDTOs";
  import { useRouter } from "next/navigation";
  import { calculateTotal } from "@/lib/utils";
  import PaymentContact from "@/onboarding/payment/result/PaymentContact";
  import {contactEmail} from "@/lib/constants";


  interface OnboardingPaymentProps{
    event:PaymentSummaryEvent;
    currentStep:number;
    totalSteps:number;
    onBack:()=>Promise<void>;
  }

  export default function OnboardingPayment({
    event,
    currentStep,
    totalSteps,
    onBack,
  }:OnboardingPaymentProps){

    const [loading,setLoading]=useState(false);
    const [paymentResult, setPaymentResult] = useState<CreatePaymentResult | null>(null);
    const router=useRouter();

    async function handleBack(){
      if(loading)
        return;
      try{
        setLoading(true);
        setPaymentResult(null);
        await onBack();
      }
      finally{
        setLoading(false);
      }
    }

    async function handlePay() {
      if (loading)
          return;
      try {
          setLoading(true);
          setPaymentResult(null);
          const result = await createPayment();
          if (result) {
            if (!result.success) {
                setPaymentResult(result);
                return;
            }
            window.location.href = result.checkoutUrl; // /*¿Qué es checkoutUrl? Es la URL única y temporal que Mercado Pago genera para esa compra específica. Contiene toda la información cargada previamente (los ítems, el precio, el ID de tu orden y las URLs de retorno).*/
          } else {
            // esto no deberia ocurrir nunca
            throw new Error("Error result #34");
          }
      }
      finally {
          setLoading(false);
      }
  }

  async function freeHandleNext() {
      if (loading)
          return;
      try {
          setLoading(true);
          const result = await createPayment();
          if (result && result.success) {
              router.push("/onboarding/end");
          } else {
              setPaymentResult(result);
          }
      }
      finally {
          setLoading(false);
      }
  }

    const paymentAvailable=event.paymentProvider!==PaymentProviderType.None;
    const total = calculateTotal(event.price, event.discount);
    const paymentRequired = total > 0;

    return(

      <OnboardingLayout>

        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
        />

        <div className="admin-section-gap"/>

        <PaymentSummary
          event={event}
        />

        { /* ERROR MESSAGE */
          paymentResult &&
          !paymentResult.success && (
              <div className="mb-4">
                <div className="max-w-xl mx-auto mt-4 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Mensaje: </strong>
                  <span className="block sm:inline">{paymentResult.message}</span>

                </div>
                <PaymentContact eventId={event.id} contactEmail={contactEmail}/>
              </div>
          )
      }

        <OnboardingPaymentFooter
          loading={loading}
          paymentAvailable={paymentAvailable}
          paymentRequired={paymentRequired}
          onBack={handleBack}
          onPay={handlePay}
          onNext={freeHandleNext}
        />

      </OnboardingLayout>

    );

  }