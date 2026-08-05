import { PaymentStatus } from "@/lib/constants";
import { PaymentNotification } from "@/lib/payment/PaymentProvider";

export function makePaymentNotification(
overrides:Partial<PaymentNotification>={}
):PaymentNotification{
return{
eventId:1,
status:PaymentStatus.Pending,
checkoutId:"checkout-123",
paymentId:"payment-123",
transactionId:"transaction-123",
providerEvent:"payment.updated",
providerStatus:"approved",
providerStatusDetail:null,
amount:1000,
currency:"ARS",
paymentDate:new Date(),
payload:{},
...overrides,
};
}