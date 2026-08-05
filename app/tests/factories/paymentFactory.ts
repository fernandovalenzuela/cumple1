import { PaymentProviderType,PaymentStatus } from "@/lib/constants";
import { CreatePaymentRequest,CreatePaymentResponse } from "@/lib/payment/PaymentProvider";
import { CreatePaymentData,PaymentInfo,PaymentReason,PaymentResultInfo } from "@/payment/dto/paymentDTOs";

export function makeCreatePaymentRequest(
overrides:Partial<CreatePaymentRequest>={}
):CreatePaymentRequest{
return{
eventId:1,
amount:1000,
currency:"ARS",
description:"Birthday App",
...overrides,
};
}

export function makeCreatePaymentResponse(
overrides:Partial<CreatePaymentResponse>={}
):CreatePaymentResponse{
return{
checkoutId:"checkout-123",
paymentUrl:"https://provider.test/checkout-123",
...overrides,
};
}

export function makePayment(
overrides:Partial<PaymentInfo>={}
):PaymentInfo{
return{
id:1,
eventId:1,
provider:PaymentProviderType.MercadoPagoAR,
providerCheckoutId:"checkout-123",
providerPaymentId:null,
providerTransactionId:null,
status:PaymentStatus.Created,
amount:1000,
currency:"ARS",
paymentDate:null,
paymentMessage:null,
paymentReason:null,
...overrides,
};
}

export function makeCreatePaymentData(
overrides:Partial<CreatePaymentData>={}
):CreatePaymentData{
return{
eventId:1,
provider:PaymentProviderType.MercadoPagoAR,
providerCheckoutId:"checkout-123",
status:PaymentStatus.Created,
amount:1000,
currency:"ARS",
...overrides,
};
}

export function makePaymentResultInfo(
overrides:Partial<PaymentResultInfo>={}
):PaymentResultInfo{
return{
status:PaymentStatus.Approved,
reason:PaymentReason.None,
message:"Pago aprobado",
providerStatus:"approved",
...overrides,
};
}