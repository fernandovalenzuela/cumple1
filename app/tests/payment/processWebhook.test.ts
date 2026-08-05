import { describe,it,expect,vi,beforeEach } from "vitest";
import { PaymentProviderType,PaymentStatus,PaymentSource,Status } from "@/lib/constants";
import { PaymentReason } from "@/payment/dto/paymentDTOs";
import { PaymentServiceFixture } from "../helpers/PaymentServiceFixture";
import { makePayment } from "../factories/paymentFactory";
import { makePaymentNotification } from "../factories/paymentNotificationFactory";

describe("PaymentService.processWebhook",()=>{

let fixture:PaymentServiceFixture;

beforeEach(()=>{
fixture=new PaymentServiceFixture(PaymentProviderType.MercadoPagoAR);
});

it("processes an approved payment",async()=>{

const payload={id:"123"};

const parsed=makePaymentNotification({
providerStatus:"approved",
});

const payment=makePayment({
id:10,
status:PaymentStatus.Created,
});

const result={
status:PaymentStatus.Approved,
reason:PaymentReason.None,
message:"Pago aprobado",
providerStatus:"approved",
};

vi.mocked(fixture.provider.parseWebhook).mockResolvedValue(parsed);
vi.mocked(fixture.provider.getPayment).mockResolvedValue(parsed);
vi.mocked(fixture.provider.mapPaymentResult).mockReturnValue(result);

vi.mocked(fixture.repository.findByEventIdRepo).mockResolvedValue(payment);

vi.mocked(fixture.repository.updatePaymentFromWebhookRepo).mockResolvedValue();
vi.mocked(fixture.repository.updateEventStatusRepo).mockResolvedValue();
vi.mocked(fixture.repository.insertPaymentLogRepo).mockResolvedValue();

await fixture.service.processWebhook(payload);

expect(fixture.repository.updatePaymentFromWebhookRepo).toHaveBeenCalledWith({
eventId:parsed.eventId,
status:PaymentStatus.Approved,
paymentReason:PaymentReason.None,
paymentMessage:"Pago aprobado",
providerPaymentId:parsed.paymentId,
providerTransactionId:parsed.transactionId,
paymentDate:parsed.paymentDate,
});

expect(fixture.repository.updateEventStatusRepo).toHaveBeenCalledWith(
parsed.eventId,
Status.Paid,
);

expect(fixture.repository.insertPaymentLogRepo).toHaveBeenCalled();

});

it("throws when payment does not exist",async()=>{

const payload={};

const parsed=makePaymentNotification();

vi.mocked(fixture.provider.parseWebhook).mockResolvedValue(parsed);
vi.mocked(fixture.provider.getPayment).mockResolvedValue(parsed);
vi.mocked(fixture.repository.findByEventIdRepo).mockResolvedValue(null);

await expect(
fixture.service.processWebhook(payload)
).rejects.toThrow(
`Payment not found. EventId: ${parsed.eventId}`
);

});

it("logs invalid transition",async()=>{

const payload={};

const parsed=makePaymentNotification();

const payment=makePayment({
id:20,
status:PaymentStatus.Approved,
});

const result={
status:PaymentStatus.Pending,
reason:PaymentReason.None,
message:"pending",
providerStatus:"pending",
};

vi.mocked(fixture.provider.parseWebhook).mockResolvedValue(parsed);
vi.mocked(fixture.provider.getPayment).mockResolvedValue(parsed);
vi.mocked(fixture.provider.mapPaymentResult).mockReturnValue(result);

vi.mocked(fixture.repository.findByEventIdRepo).mockResolvedValue(payment);

vi.mocked(fixture.repository.insertPaymentLogRepo).mockResolvedValue();

await fixture.service.processWebhook(payload);

expect(fixture.repository.insertPaymentLogRepo).toHaveBeenCalledWith({
paymentId:payment.id,
source:PaymentSource.Webhook,
providerEvent:parsed.providerEvent,
providerStatus:parsed.providerStatus,
domainStatus:PaymentStatus.Pending,
providerCheckoutId:parsed.checkoutId,
providerPaymentId:parsed.paymentId,
providerTransactionId:parsed.transactionId,
payload:parsed.payload,
providerStatusDetail:parsed.providerStatusDetail,
});

expect(fixture.repository.updatePaymentFromWebhookRepo).not.toHaveBeenCalled();
expect(fixture.repository.updateEventStatusRepo).not.toHaveBeenCalled();

});

});