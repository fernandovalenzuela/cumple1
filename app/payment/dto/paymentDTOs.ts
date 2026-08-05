import { PaymentProviderType,PaymentStatus,PaymentSource } from "@/lib/constants";
import { JsonValue } from "@/lib/types";

/*export interface CreatePaymentRequest{
    eventId:number;
    amount:number;
    currency:string;
    description:string;
}*/

export enum CreatePaymentError {
    PaymentAlreadyInProgress,
    ProviderUnavailable,
    PaymentAlreadyCompleted,
}

export type CreatePaymentResult =
    | {
        success: true;
        checkoutUrl: string;
    }
    | {
        success: false;
        error: CreatePaymentError;
        message: string;
    };

export interface PaymentInfo{
    id:number;
    eventId:number;
    provider:PaymentProviderType;
    providerCheckoutId:string;
    providerPaymentId:string|null;
    providerTransactionId:string|null;
    status:PaymentStatus;
    amount:number;
    currency:string;
    paymentDate:Date|null;
    paymentMessage:string|null;
    paymentReason:string|null;
}

export interface CreatePaymentData{
    eventId:number;
    provider:PaymentProviderType;
    providerCheckoutId:string;
    status:PaymentStatus;
    amount:number;
    currency:string;
}

export interface UpdatePaymentData{
    eventId:number;
    status:PaymentStatus;
    providerPaymentId:string|null;
    providerTransactionId:string|null;
    paymentDate:Date|null;
    paymentMessage:string|null;
    paymentReason:PaymentReason;
}

export interface CreatePaymentLogData{
    paymentId:number;
    source:PaymentSource;
    providerEvent:string|null;
    providerStatus:string|null;
    domainStatus:PaymentStatus;
    providerCheckoutId:string|null;
    providerPaymentId:string|null;
    providerTransactionId:string|null;
    payload:JsonValue;
    providerStatusDetail:string|null;
}

export interface RestartPaymentData {
    eventId: number;
    providerCheckoutId: string;
}

export interface PaymentResult {
    providerId:number;
    status: PaymentStatus;
    providerPaymentId: string | null;
    amount: number;
    currency: string;
    message:string|null;
}

export enum PaymentReason{
    None,
    InsufficientFunds,
    InvalidCardNumber,
    InvalidExpirationDate,
    InvalidSecurityCode,
    CardDisabled,
    PaymentDuplicated,
    HighRisk,
    AuthorizationRequired,
    Cancelled,
    Expired,
    Unknown,
}

export interface PaymentResultInfo{
    status: PaymentStatus;
    reason: PaymentReason;
    message:string|null;
    providerStatus: string;
}    