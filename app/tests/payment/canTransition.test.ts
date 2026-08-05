import { describe,it,expect } from "vitest";
import { PaymentService } from "@/payment/PaymentService";
import { PaymentProviderType,PaymentStatus } from "@/lib/constants";

describe("PaymentService.canTransition",()=>{

const service=new PaymentService(PaymentProviderType.MercadoPagoAR);

const canTransition=(
current:PaymentStatus,
next:PaymentStatus
)=>
(service as any).canTransition(current,next);

it.each([
PaymentStatus.Pending,
PaymentStatus.WaitingPayment,
PaymentStatus.PendingVerification,
PaymentStatus.Approved,
PaymentStatus.Rejected,
PaymentStatus.Cancelled,
PaymentStatus.Expired,
])("Created -> %s",next=>{
expect(
canTransition(PaymentStatus.Created,next)
).toBe(true);
});

it.each([
PaymentStatus.Approved,
PaymentStatus.Rejected,
PaymentStatus.Cancelled,
PaymentStatus.Expired,
])("Pending -> %s",next=>{
expect(
canTransition(PaymentStatus.Pending,next)
).toBe(true);
});

it.each([
PaymentStatus.Approved,
PaymentStatus.Rejected,
PaymentStatus.Cancelled,
PaymentStatus.Expired,
])("WaitingPayment -> %s",next=>{
expect(
canTransition(PaymentStatus.WaitingPayment,next)
).toBe(true);
});

it.each([
PaymentStatus.Approved,
PaymentStatus.Rejected,
PaymentStatus.Cancelled,
PaymentStatus.Expired,
])("PendingVerification -> %s",next=>{
expect(
canTransition(PaymentStatus.PendingVerification,next)
).toBe(true);
});

it("Approved -> Refunded",()=>{
expect(
canTransition(
PaymentStatus.Approved,
PaymentStatus.Refunded
)
).toBe(true);
});

it.each([
PaymentStatus.Created,
PaymentStatus.WaitingPayment,
PaymentStatus.PendingVerification,
PaymentStatus.Pending,
PaymentStatus.Approved,
PaymentStatus.Rejected,
PaymentStatus.Cancelled,
PaymentStatus.Expired,
])("Refunded -> %s",next=>{
expect(
canTransition(
PaymentStatus.Refunded,
next
)
).toBe(false);
});

it.each([
PaymentStatus.Created,
PaymentStatus.WaitingPayment,
PaymentStatus.PendingVerification,
PaymentStatus.Pending,
PaymentStatus.Approved,
PaymentStatus.Rejected,
PaymentStatus.Cancelled,
PaymentStatus.Expired,
PaymentStatus.Refunded,
])("Rejected -> %s",next=>{
expect(
canTransition(
PaymentStatus.Rejected,
next
)
).toBe(false);
});

it.each([
PaymentStatus.Created,
PaymentStatus.WaitingPayment,
PaymentStatus.PendingVerification,
PaymentStatus.Pending,
PaymentStatus.Approved,
PaymentStatus.Rejected,
PaymentStatus.Cancelled,
PaymentStatus.Expired,
PaymentStatus.Refunded,
])("Cancelled -> %s",next=>{
expect(
canTransition(
PaymentStatus.Cancelled,
next
)
).toBe(false);
});

it.each([
PaymentStatus.Created,
PaymentStatus.WaitingPayment,
PaymentStatus.PendingVerification,
PaymentStatus.Pending,
PaymentStatus.Approved,
PaymentStatus.Rejected,
PaymentStatus.Cancelled,
PaymentStatus.Expired,
PaymentStatus.Refunded,
])("Expired -> %s",next=>{
expect(
canTransition(
PaymentStatus.Expired,
next
)
).toBe(false);
});

});