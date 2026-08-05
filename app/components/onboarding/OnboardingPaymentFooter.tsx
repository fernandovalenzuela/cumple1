"use client";

import { Loader2 } from "lucide-react";

interface OnboardingPaymentFooterProps{
  loading:boolean;
  paymentAvailable:boolean;
  paymentRequired: boolean;
  onBack:()=>void;
  onPay:()=>void;
  onNext: () => void;
}

export default function OnboardingPaymentFooter({
  loading,
  paymentAvailable,
  paymentRequired,
  onBack,
  onPay,
  onNext,
}:OnboardingPaymentFooterProps){

  return(

    <div className=" sticky bottom-0 z-50 -mx-6  mt-0  border-t border-gray-200
      bg-white/95 px-4  py-3  backdrop-blur">
      <div className="flex gap-3">
        <button
          type="button"
          className="admin-button-secondary admin-button-medium flex-1"
          disabled={ loading || (paymentRequired && !paymentAvailable)}
          onClick={onBack}
        >
         Volver
        </button>
        <button
          type="button"
          className="admin-button admin-button-medium flex-1"
          disabled={ loading || (paymentRequired && !paymentAvailable)}
          /*onClick={onPay}*/
          onClick={paymentRequired ? onPay : onNext}
        >
          {loading?(
            <span className="flex items-center justify-center gap-2">
              <Loader2
                size={18}
                className="animate-spin"
              />
              Redirigiendo...
            </span>
          ):(paymentRequired ? "Pagar" : "Siguiente")}
        </button>
      </div>
    </div>
  );
}