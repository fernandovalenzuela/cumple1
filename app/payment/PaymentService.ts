import { PaymentRepository } from "./PaymentRepository";
import { CreatePaymentRequest } from "@/lib/payment/PaymentProvider";
import { CreatePaymentResult, CreatePaymentError,PaymentResultInfo,PaymentReason } from "./dto/paymentDTOs";
import { PaymentStatus, PaymentProviderType, PaymentSource, Status } from "@/lib/constants";
import { getPaymentProvider } from "@/lib/payment/PaymentProviderFactory";
import {PaymentNotification} from "@/lib/payment/PaymentProvider";
import { PaymentProvider } from "@/lib/payment/PaymentProvider";


export class PaymentService {
    private readonly repository: PaymentRepository;
    private readonly provider: PaymentProvider;

    constructor(
        private readonly providerType: PaymentProviderType,
        // Dependencias opcionales
        repository?: PaymentRepository,
        provider?: PaymentProvider
    ) {
        // Si se pasa la dependencia la usa, si no, instancia la por defecto
        this.repository = repository ?? new PaymentRepository();
        this.provider = provider ?? getPaymentProvider(providerType);
    }

    async createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResult> {

        /*const existingPayment = await this.repository.findByEventIdRepo(request.eventId);
        const amount = request.amount;
        const currency = request.currency;*/

        console.log("# PaymentService.createPayment");

        const existingPayment =
            await this.repository.findByEventIdRepo(request.eventId);

        let restart = false;

        if (existingPayment) {

            switch (existingPayment.status) {

                case PaymentStatus.Created:
                case PaymentStatus.Pending:
                case PaymentStatus.WaitingPayment:
                case PaymentStatus.PendingVerification:

                    return {
                        success: false,
                        error: CreatePaymentError.PaymentAlreadyInProgress,
                        message: "Ya existe un pago en proceso para este evento.",
                    };

                case PaymentStatus.Approved:
                case PaymentStatus.Refunded:

                    return {
                        success: false,
                        error: CreatePaymentError.PaymentAlreadyCompleted,
                        message: "Este evento ya tiene un pago aprobado.",
                    };

                case PaymentStatus.Rejected:
                case PaymentStatus.Cancelled:
                case PaymentStatus.Expired:

                    restart = true;
                    break;
            }
        }

        // LLAMADA A PROVIDER!
        const providerResponse = await this.provider.createPayment(request);

        if (restart) {

            await this.repository.restartPayment({
                eventId: request.eventId,
                providerCheckoutId: providerResponse.checkoutId,
            });

        } else {

            await this.repository.createPaymentRepo({
                eventId: request.eventId,
                provider: this.providerType,
                providerCheckoutId: providerResponse.checkoutId,
                status: PaymentStatus.Created,
                amount: request.amount,
                currency: request.currency,
            });

        }

        return {
            success: true,
            checkoutUrl: providerResponse.paymentUrl,
        };

    }

    async processWebhook(payload:Record<string,unknown>):Promise<void>{
        // Esta funcion es invocada por el proveedor de pago (ejemplo MercadoPago, quien implementa la clase interface PaymentProvider) para informar a esta app, el resultado del pago.
        // Flujo de pago: El proveedor de pagos debe cumplir con la clase interface PaymentProvider
        // 1. Esta app informa que hay un pago al proveedor de pago: PaymentProvider.createPayment, informando con url para el webhook (provider llama a metodo backend de esta app para informar resultado del pago), y las urls que el provider invoca para retornar retornar al cliente (url success, url failure, ulr pending). Esta llamada retorn la verdader url donde se de informar el pago
        // 2. Se invoca la url que retorna el punto anterior
        // 3. El provider invoca por un lado la url del webhook (ver 4) y por otra la url de redireccion del usuario (url success, etc)
        // 4. Invocacion del webhook por el provider: Se llama a parseWebhook de la implementacion de la interface PaymentProvider del provider respectivo, y retorna una adaptacion de la respuesta del provider a una estructura de datos estandard, que le permitira consultar el estado final del pago
        const parsedWebhook  = await this.provider.parseWebhook(payload);
        // 5. La app, con la info del paso anterior llama a la api del provider para consultar el pago.
        const completeNotification = await this.provider.getPayment(parsedWebhook );
        // 6. La app busca toda la info ya guardada del pago para actualizarla 
        const payment = await this.repository.findByEventIdRepo(completeNotification.eventId);    

        if (!payment) {
            throw new Error("Payment not found. EventId: " + completeNotification.eventId);
        }    
        // 7. De acuerdo al estado propio que retorna el provider del estado del pago, se adapta a un estado estandard
        const result = this.provider.mapPaymentResult(completeNotification);

        if (!this.canTransition(payment.status, result.status)) {

            // Igual registramos el webhook para auditoría
            await this.repository.insertPaymentLogRepo({
                paymentId:payment.id,
                source:PaymentSource.Webhook,
                providerEvent:completeNotification.providerEvent,
                providerStatus:completeNotification.providerStatus,
                domainStatus:result.status,
                providerCheckoutId:completeNotification.checkoutId,
                providerPaymentId:completeNotification.paymentId,
                providerTransactionId:completeNotification.transactionId,
                payload:completeNotification.payload,
                providerStatusDetail:completeNotification.providerStatusDetail,
            });



            return;
        }

        // pasos 8,9,10
        await this.persistNotification(payment.id,completeNotification,result);
    }


    private async persistNotification(paymentId:number,completeNotification:PaymentNotification, result: PaymentResultInfo) {
        // 8. Se actualiza el estado del pago
        await this.repository.updatePaymentFromWebhookRepo({
            eventId: completeNotification.eventId,
            status: result.status,
            paymentReason: result.reason,
            paymentMessage: result.message,
            providerPaymentId: completeNotification.paymentId,
            providerTransactionId: completeNotification.transactionId,
            paymentDate: completeNotification.paymentDate,
        });

        let eventStatus: Status | null = null;

        switch (result.status) {
            case PaymentStatus.Approved:
                eventStatus = Status.Paid;
                break;
            case PaymentStatus.WaitingPayment:
            case PaymentStatus.Pending:
            case PaymentStatus.PendingVerification:
                eventStatus = Status.WaitingPayment;
                break;
            case PaymentStatus.Rejected:
            case PaymentStatus.Cancelled:
            case PaymentStatus.Expired:
                eventStatus = Status.Editing;
                break;
            case PaymentStatus.Refunded:
                eventStatus = Status.Paid;
                break;
        }

        if (eventStatus !== null) {
            // 9. Se actualiza el estado del evento
            await this.repository.updateEventStatusRepo(completeNotification.eventId, eventStatus );
        }

        // 10. Se inserta en el log de pagos
        await this.repository.insertPaymentLogRepo({
            paymentId:paymentId,
            source:PaymentSource.Webhook,
            providerEvent:completeNotification.providerEvent,
            providerStatus:completeNotification.providerStatus,
            domainStatus:result.status,
            providerCheckoutId:completeNotification.checkoutId,
            providerPaymentId:completeNotification.paymentId,
            providerTransactionId:completeNotification.transactionId,
            payload:completeNotification.payload,
            providerStatusDetail:completeNotification.providerStatusDetail,
        });
    }

    private canTransition(current: PaymentStatus,  next: PaymentStatus ): boolean {

        /*if (current === next) {
            return false;
        }*/

        switch (current) {

            case PaymentStatus.Created:
                return [
                    PaymentStatus.Pending,
                    PaymentStatus.WaitingPayment,
                    PaymentStatus.PendingVerification,
                    PaymentStatus.Approved,
                    PaymentStatus.Rejected,
                    PaymentStatus.Cancelled,
                    PaymentStatus.Expired,
                ].includes(next);

            case PaymentStatus.Pending:
            case PaymentStatus.WaitingPayment:
            case PaymentStatus.PendingVerification:
                return [
                    PaymentStatus.Approved,
                    PaymentStatus.Rejected,
                    PaymentStatus.Cancelled,
                    PaymentStatus.Expired,
                ].includes(next);

            case PaymentStatus.Approved:
                return next === PaymentStatus.Refunded;

            case PaymentStatus.Rejected:
            case PaymentStatus.Cancelled:
            case PaymentStatus.Expired:
            case PaymentStatus.Refunded:
                return false;

            default:
                return false;
        }
    }

    async createFreePayment(request: CreatePaymentRequest): Promise<CreatePaymentResult> { 
        console.log("@eventId ", request.eventId);

        const existingPayment = await this.repository.findByEventIdRepo(request.eventId);

        if (!existingPayment) {
            await this.repository.createPaymentRepo({
                    eventId: request.eventId,
                    provider: this.providerType,
                    providerCheckoutId: "ZERO_AMOUNT",
                    status: PaymentStatus.Created,
                    amount: request.amount,
                    currency: request.currency,
                });

            const payment = await this.repository.findByEventIdRepo(request.eventId);

            console.log("@payment ", payment);     
            if (payment) { 
                const completeNotification: PaymentNotification = {
                    eventId: request.eventId,
                    status: PaymentStatus.Pending, // valor temporal, se traduce después
                    checkoutId: "",
                    paymentId: String(payment?.id),
                    transactionId: null,
                    providerEvent: null,
                    providerStatus: "approved",
                    providerStatusDetail: null,
                    amount: 0,
                    currency: payment.currency,
                    paymentDate:new Date(),
                    payload: "ZERO_AMOUNT",
                };
                const result: PaymentResultInfo = {
                    status:PaymentStatus.Approved,
                    reason:PaymentReason.None,
                    message:"Tu pago fue aprobado correctamente.",
                    providerStatus: "approved",
                }
                await this.persistNotification(payment.id,completeNotification,result);

                return {
                success: true,
                checkoutUrl: "ZERO_AMOUNT",
                }
        
            } else {
                throw new Error("Error response #67");
            }
        } else {
            return {
                success: false,
                error: CreatePaymentError.PaymentAlreadyCompleted,
                message: "Este evento ya tiene un pago aprobado.",
            };
        }
    }
}



