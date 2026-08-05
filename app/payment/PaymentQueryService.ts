import { PaymentRepository } from "./PaymentRepository";
import { PaymentResult } from "./dto/paymentDTOs";

export class PaymentQueryService{

    private readonly repository = new PaymentRepository();

    async getPaymentResult(eventId:number):Promise<PaymentResult>{
        const payment=await this.repository.findByEventIdRepo(eventId);
        if(!payment){
            throw new Error(`Payment not found. EventId: ${eventId}`);
        }
        return{
            providerId:payment.provider,
            status:payment.status,
            providerPaymentId:payment.providerPaymentId,
            amount:payment.amount,
            currency:payment.currency,
            message:payment.paymentMessage,
        };
    }
}