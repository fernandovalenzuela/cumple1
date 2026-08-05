import { describe,it,expect,vi,beforeEach } from "vitest";
import { PaymentProviderType,PaymentStatus,Status } from "@/lib/constants";
import { CreatePaymentError,PaymentReason } from "@/payment/dto/paymentDTOs";
import { PaymentServiceFixture } from "../helpers/PaymentServiceFixture";
import {
makeCreatePaymentRequest,
makePayment,
} from "../factories/paymentFactory";

describe("PaymentService.createFreePayment",()=>{

let fixture:PaymentServiceFixture;

beforeEach(()=>{
fixture=new PaymentServiceFixture(PaymentProviderType.MercadoPagoAR);
});

it("creates a free payment",async()=>{

const request=makeCreatePaymentRequest({
amount:0,
});

const payment=makePayment({
id:10,
amount:0,
status:PaymentStatus.Created,
});

vi.mocked(fixture.repository.findByEventIdRepo)
.mockResolvedValueOnce(null)
.mockResolvedValueOnce(payment);

vi.mocked(fixture.repository.createPaymentRepo)
.mockResolvedValue();

vi.mocked(fixture.repository.updatePaymentFromWebhookRepo)
.mockResolvedValue();

vi.mocked(fixture.repository.updateEventStatusRepo)
.mockResolvedValue();

vi.mocked(fixture.repository.insertPaymentLogRepo)
.mockResolvedValue();

const result=await fixture.service.createFreePayment(request);

expect(result).toEqual({
success:true,
checkoutUrl:"ZERO_AMOUNT",
});

expect(fixture.repository.createPaymentRepo).toHaveBeenCalledWith({
eventId:request.eventId,
provider:PaymentProviderType.MercadoPagoAR,
providerCheckoutId:"ZERO_AMOUNT",
status:PaymentStatus.Created,
amount:0,
currency:request.currency,
});

expect(fixture.repository.updatePaymentFromWebhookRepo).toHaveBeenCalledWith({
eventId:request.eventId,
status:PaymentStatus.Approved,
paymentReason:PaymentReason.None,
paymentMessage:"Tu pago fue aprobado correctamente.",
providerPaymentId:String(payment.id),
providerTransactionId:null,
paymentDate:expect.any(Date),
});

expect(fixture.repository.updateEventStatusRepo).toHaveBeenCalledWith(
request.eventId,
Status.Paid,
);

expect(fixture.repository.insertPaymentLogRepo).toHaveBeenCalled();

});

it("returns PaymentAlreadyCompleted when payment already exists",async()=>{

const request=makeCreatePaymentRequest({
amount:0,
});

vi.mocked(fixture.repository.findByEventIdRepo)
.mockResolvedValue(makePayment());

const result=await fixture.service.createFreePayment(request);

expect(result).toEqual({
success:false,
error:CreatePaymentError.PaymentAlreadyCompleted,
message:"Este evento ya tiene un pago aprobado.",
});

expect(fixture.repository.createPaymentRepo).not.toHaveBeenCalled();

});

it("throws when payment cannot be loaded after creation",async()=>{

const request=makeCreatePaymentRequest({
amount:0,
});

vi.mocked(fixture.repository.findByEventIdRepo)
.mockResolvedValueOnce(null)
.mockResolvedValueOnce(null);

vi.mocked(fixture.repository.createPaymentRepo)
.mockResolvedValue();

await expect(
fixture.service.createFreePayment(request)
).rejects.toThrow("Error response #67");

});

});