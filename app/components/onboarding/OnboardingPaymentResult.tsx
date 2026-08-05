"use client";

import { useState } from "react";
import { PaymentResult as PaymentResultDto } from "@/payment/dto/paymentDTOs";
import { PaymentStatus } from "@/lib/constants";
import OnboardingLayout from "@/components/onboarding/layout/OnboardingLayout";
import StepIndicator from "@/components/onboarding/layout/StepIndicator";
import PaymentResultContainer from "@/onboarding/payment/result/PaymentResultContainer";
import PaymentResumeCard from "@/onboarding/payment/result/PaymentResumeCard";
import OnboardingPaymentResultFooter from "./OnboardingPaymentResultFooter";

interface OnboardingPaymentResultProps {
    eventId: number;
    initialPayment: PaymentResultDto;
    currentStep: number;
    totalSteps: number;
    onNext: () => Promise<void>;
}

export default function OnboardingPaymentResult({
    eventId,
    initialPayment,
    currentStep,
    totalSteps,
    onNext,
}: OnboardingPaymentResultProps) {

    const [payment, setPayment] = useState(initialPayment);

    //console.log("payment.status",payment.status);
    return (
        <OnboardingLayout>
            <StepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
            />
            
            <div className="admin-section-gap" />
     
            <PaymentResultContainer
                eventId={eventId}
                payment={payment}
                onPaymentChanged={setPayment}
            />

            <div className="admin-section-gap" />
            <PaymentResumeCard
                eventId={eventId}
                payment={payment}
            />
            <OnboardingPaymentResultFooter
                paymentStatus={payment.status}
                onNext={onNext}
            />
        </OnboardingLayout>
    );
}