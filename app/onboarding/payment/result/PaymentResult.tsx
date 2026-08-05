"use client";

import { PaymentStatus } from "@/lib/constants";
import { PaymentResult as PaymentResultDto } from "@/payment/dto/paymentDTOs";
import PaymentApproved from "./PaymentApproved";
import PaymentPending from "./PaymentPending";
import PaymentRejected from "./PaymentRejected";


interface PaymentResultProps{
    eventId: number;
    payment:PaymentResultDto;
    showRefreshButton:boolean;
    refreshing:boolean;
    retrying:boolean;
    onRefresh:()=>Promise<void>;
    onRetry:()=>Promise<void>;
}

export default function PaymentResult({
    eventId,
    payment,
    showRefreshButton,
    refreshing,
    retrying,
    onRefresh,
    onRetry,
}:PaymentResultProps){

    switch(payment.status){

        case PaymentStatus.Approved:

            return(
                <PaymentApproved
                    amount={payment.amount}
                    currency={payment.currency}
                    providerPaymentId={payment.providerPaymentId}
                    message={payment.message}
                />
            );

        case PaymentStatus.Rejected:
        case PaymentStatus.Cancelled:
        case PaymentStatus.Expired:

            return(
                <PaymentRejected
                    eventId={eventId}
                    message={payment.message}
                    loading={retrying}
                    onRetry={onRetry}
                />
            );

        case PaymentStatus.Created:
        case PaymentStatus.Pending:
        case PaymentStatus.WaitingPayment:
        case PaymentStatus.PendingVerification:
        default:

            return(
                <PaymentPending
                    eventId={eventId}
                    message={payment.message}
                    showRefreshButton={showRefreshButton}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            );

    }

}