import { vi } from "vitest";
import { PaymentRepository } from "@/payment/PaymentRepository";
import { PaymentService } from "@/payment/PaymentService";
import { PaymentProvider,CreatePaymentResponse,PaymentNotification } from "@/lib/payment/PaymentProvider";
import { PaymentProviderType } from "@/lib/constants";
import { PaymentResultInfo } from "@/payment/dto/paymentDTOs";

export class PaymentServiceFixture{
readonly repository:PaymentRepository;
readonly provider:PaymentProvider;
readonly service:PaymentService;
constructor(providerType:PaymentProviderType=PaymentProviderType.MercadoPagoAR){
this.repository={
findByEventIdRepo:vi.fn(),
createPaymentRepo:vi.fn(),
updatePaymentFromWebhookRepo:vi.fn(),
insertPaymentLogRepo:vi.fn(),
updateEventStatusRepo:vi.fn(),
restartPayment:vi.fn(),
} as unknown as PaymentRepository;
this.provider={
createPayment:vi.fn<(_:unknown)=>Promise<CreatePaymentResponse>>(),
parseWebhook:vi.fn<(_:Record<string,unknown>)=>Promise<PaymentNotification>>(),
getPayment:vi.fn<(_:PaymentNotification)=>Promise<PaymentNotification>>(),
mapPaymentResult:vi.fn<(_:PaymentNotification)=>PaymentResultInfo>(),
};
this.service=new PaymentService(providerType,this.repository,this.provider);
}
}