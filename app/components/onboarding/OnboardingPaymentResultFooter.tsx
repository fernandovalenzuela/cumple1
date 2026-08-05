"use client";

import FooterActions from "@/components/onboarding/layout/FooterActions";
import { PaymentStatus } from "@/lib/constants";

interface OnboardingPaymentResultFooterProps {
    paymentStatus: PaymentStatus;
    loading?: boolean;
    onNext: () => Promise<void>;
}

export default function OnboardingPaymentResultFooter({
    paymentStatus,
    loading = false,
    onNext,
}: OnboardingPaymentResultFooterProps) {

    return (
        <FooterActions
            nextLabel="Siguiente"
            loading={loading}
            disabled={paymentStatus !== PaymentStatus.Approved}
            loadingLabel="Continuando..."
            onNext={() => {
                void onNext();
            }}
        />
    );

}