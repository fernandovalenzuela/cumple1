import { describe,it,expect,vi,beforeEach } from "vitest";
import { PaymentStatus,PaymentProviderType } from "@/lib/constants";
import { CreatePaymentError } from "@/payment/dto/paymentDTOs";
import { PaymentServiceFixture } from "../helpers/PaymentServiceFixture";
import {
makeCreatePaymentRequest,
makeCreatePaymentResponse,
makePayment,
} from "../factories/paymentFactory";

describe("PaymentService.createPayment",()=>{

let fixture:PaymentServiceFixture;

beforeEach(()=>{
fixture=new PaymentServiceFixture(PaymentProviderType.MercadoPagoAR);
});

it("creates a payment when no previous payment exists",async()=>{

const request=makeCreatePaymentRequest();
const providerResponse=makeCreatePaymentResponse();

vi.mocked(fixture.repository.findByEventIdRepo).mockResolvedValue(null);
vi.mocked(fixture.provider.createPayment).mockResolvedValue(providerResponse);
vi.mocked(fixture.repository.createPaymentRepo).mockResolvedValue();

const result=await fixture.service.createPayment(request);

expect(result).toEqual({
success:true,
checkoutUrl:providerResponse.paymentUrl,
});

expect(fixture.provider.createPayment).toHaveBeenCalledWith(request);

expect(fixture.repository.createPaymentRepo).toHaveBeenCalledWith({
eventId:request.eventId,
provider:PaymentProviderType.MercadoPagoAR,
providerCheckoutId:providerResponse.checkoutId,
status:PaymentStatus.Created,
amount:request.amount,
currency:request.currency,
});

expect(fixture.repository.restartPayment).not.toHaveBeenCalled();

});

it.each([
PaymentStatus.Created,
PaymentStatus.Pending,
PaymentStatus.WaitingPayment,
PaymentStatus.PendingVerification,
])("returns PaymentAlreadyInProgress when payment status is %s",async(status)=>{

const request=makeCreatePaymentRequest();

vi.mocked(fixture.repository.findByEventIdRepo)
.mockResolvedValue(makePayment({status}));

const result=await fixture.service.createPayment(request);

expect(result).toEqual({
success:false,
error:CreatePaymentError.PaymentAlreadyInProgress,
message:"Ya existe un pago en proceso para este evento.",
});

expect(fixture.provider.createPayment).not.toHaveBeenCalled();
expect(fixture.repository.createPaymentRepo).not.toHaveBeenCalled();
expect(fixture.repository.restartPayment).not.toHaveBeenCalled();

});

it.each([
PaymentStatus.Approved,
PaymentStatus.Refunded,
])("returns PaymentAlreadyCompleted when payment status is %s",async(status)=>{

const request=makeCreatePaymentRequest();

vi.mocked(fixture.repository.findByEventIdRepo)
.mockResolvedValue(makePayment({status}));

const result=await fixture.service.createPayment(request);

expect(result).toEqual({
success:false,
error:CreatePaymentError.PaymentAlreadyCompleted,
message:"Este evento ya tiene un pago aprobado.",
});

expect(fixture.provider.createPayment).not.toHaveBeenCalled();
expect(fixture.repository.createPaymentRepo).not.toHaveBeenCalled();
expect(fixture.repository.restartPayment).not.toHaveBeenCalled();

});

it.each([
PaymentStatus.Rejected,
PaymentStatus.Cancelled,
PaymentStatus.Expired,
])("restarts payment when previous payment status is %s",async(status)=>{

const request=makeCreatePaymentRequest();
const providerResponse=makeCreatePaymentResponse();

vi.mocked(fixture.repository.findByEventIdRepo)
.mockResolvedValue(makePayment({status}));

vi.mocked(fixture.provider.createPayment)
.mockResolvedValue(providerResponse);

vi.mocked(fixture.repository.restartPayment)
.mockResolvedValue();

const result=await fixture.service.createPayment(request);

expect(result).toEqual({
success:true,
checkoutUrl:providerResponse.paymentUrl,
});

expect(fixture.repository.restartPayment).toHaveBeenCalledWith({
eventId:request.eventId,
providerCheckoutId:providerResponse.checkoutId,
});

expect(fixture.repository.createPaymentRepo).not.toHaveBeenCalled();

});

});