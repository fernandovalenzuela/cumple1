import { PaymentStatus } from "@/lib/constants";
import { JsonValue } from "@/lib/types";
import { PaymentResultInfo } from "@/payment/dto/paymentDTOs";

export type CreatePaymentRequest={
    eventId:number;
    amount:number;
    currency:string;
    description:string;
};

export type CreatePaymentResponse={
    checkoutId:string;
    paymentUrl:string;
};

export type PaymentNotification={
    eventId:number;
    status:PaymentStatus;
    checkoutId:string;
    paymentId:string|null;
    transactionId:string|null;
    providerEvent:string|null;
    providerStatus:string|null;
    amount:number;
    currency:string;
    paymentDate:Date|null;
    payload:JsonValue;  // Respuesta original del proveedor
    providerStatusDetail:string|null;
};

export interface PaymentProvider{
    createPayment(request:CreatePaymentRequest):Promise<CreatePaymentResponse>;

    parseWebhook(
        payload:Record<string,unknown>
    ):Promise<PaymentNotification>;

    getPayment(
        notification:PaymentNotification
    ):Promise<PaymentNotification>;

    mapPaymentResult(payment:PaymentNotification): PaymentResultInfo;
}