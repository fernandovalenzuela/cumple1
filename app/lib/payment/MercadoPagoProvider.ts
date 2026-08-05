import { CreatePaymentRequest, CreatePaymentResponse, PaymentNotification,} from "@/lib/payment/PaymentProvider";
import { PaymentResultInfo, PaymentReason } from "@/payment/dto/paymentDTOs";

import { PaymentProvider } from "./PaymentProvider";
import { PaymentStatus } from "@/lib/constants";
import { JsonValue } from "@/lib/types";

const BASE_URL = process.env.MERCADO_PAGO_BASE_URL!;
const ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN!;

const PAYMENT_NOTIFICATION_URL = process.env.PAYMENT_NOTIFICATION_URL!;
/*const PAYMENT_SUCCESS_URL = process.env.PAYMENT_SUCCESS_URL!;
const PAYMENT_FAILURE_URL = process.env.PAYMENT_FAILURE_URL!;
const PAYMENT_PENDING_URL = process.env.PAYMENT_PENDING_URL!;*/
const PAYMENT_RESULT_URL = process.env.PAYMENT_RESULT_URL!;


export class MercadoPagoProvider implements PaymentProvider {

  async createPayment(
    request: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> {

    console.log("## MercadoPagoProvider BASE_URL ", BASE_URL);
    console.log("## MercadoPagoProvider PAYMENT_NOTIFICATION_URL ", PAYMENT_NOTIFICATION_URL);

    const response = await fetch(
      `${BASE_URL}/checkout/preferences`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              title: request.description,
              quantity: 1,
              currency_id: request.currency,
              unit_price: request.amount,
            },
          ],

          external_reference: request.eventId.toString(),

          notification_url:
            PAYMENT_NOTIFICATION_URL,

          back_urls: {
            success:
              PAYMENT_RESULT_URL,

            failure:
              PAYMENT_RESULT_URL,

            pending:
              PAYMENT_RESULT_URL,
          },

          auto_return: "approved",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Mercado Pago createPayment failed.");
    }

    const json = await response.json();

    return {
      checkoutId: json.id,
      paymentUrl: json.init_point, /*¿Qué es init_point? Es la URL única y temporal que Mercado Pago genera para esa compra específica. Contiene toda la información cargada previamente (los ítems, el precio, el ID de tu orden y las URLs de retorno).*/
    };
  }

  /*async parseWebhook(
    payload: Record<string, unknown>
  ): Promise<PaymentNotification> {

    const data = payload["data"] as { id: string | number };

    const paymentId = String(data.id);

    return this.getPayment({
      eventId: 0,
      status: PaymentStatus.Pending,
      checkoutId: "",
      paymentId,
      transactionId: null,
      providerEvent: String(payload.action),
      providerStatus: null,
      amount: 0,
      currency: "",
      paymentDate: null,
      payload: payload as JsonValue,
    });

  }*/

  async parseWebhook( payload: Record<string, unknown> ): Promise<PaymentNotification> {
    console.log("# parseWebhook");
        const data = payload["data"] as {id: string | number;};

        return {
            eventId: 0,
            status: PaymentStatus.Pending,
            checkoutId: "",
            paymentId: String(data.id),
            transactionId: null,
            providerEvent: String(payload.action),
            providerStatus: null,
            amount: 0,
            currency: "",
            paymentDate: null,
            payload: payload as JsonValue,
            providerStatusDetail: null,
        };

    }  

  async getPayment(notification: PaymentNotification): Promise<PaymentNotification> {
    // se pregunta e MP el estado real de la transaccion
    const response = await fetch(
      `${BASE_URL}/v1/payments/${notification.paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Mercado Pago getPayment failed.");
    }

    const payment = await response.json();

    return {
        eventId: Number(payment.external_reference),
        status: PaymentStatus.Pending, // valor temporal, se traduce después
        checkoutId: payment.order.id,
        paymentId: String(payment.id),
        transactionId:
            payment.transaction_details?.transaction_id?.toString() ?? null,
        providerEvent: notification.providerEvent,
        providerStatus: payment.status,
        providerStatusDetail: payment.status_detail ?? null,
        amount: payment.transaction_amount,
        currency: payment.currency_id,
        paymentDate:
            payment.date_approved
                ? new Date(payment.date_approved)
                : null,
        payload: payment,
    };
  }

  mapPaymentResult(
        payment: PaymentNotification): PaymentResultInfo{
        switch(payment.providerStatus){
            case "approved":
                return{
                    status:PaymentStatus.Approved,
                    reason:PaymentReason.None,
                    message:"Tu pago fue aprobado correctamente.",
                    providerStatus: payment.providerStatus,
                };
            case "pending":
                return{
                    status:PaymentStatus.Pending,
                    reason:PaymentReason.None,
                    message:"Estamos esperando la confirmación del pago.",
                    providerStatus: payment.providerStatus,
                };
            case "rejected":
                switch(payment.providerStatusDetail){
                    case "cc_rejected_insufficient_amount":
                        return{
                            status:PaymentStatus.Rejected,
                            reason:PaymentReason.InsufficientFunds,
                            message:"No hay fondos suficientes para realizar el pago.",
                            providerStatus: payment.providerStatus,
                        };
                    case "cc_rejected_bad_filled_card_number":
                        return{
                            status:PaymentStatus.Rejected,
                            reason:PaymentReason.InvalidCardNumber,
                            message:"El número de tarjeta es incorrecto.",
                            providerStatus: payment.providerStatus,
                        };
                    case "cc_rejected_bad_filled_date":
                        return{
                            status:PaymentStatus.Rejected,
                            reason:PaymentReason.InvalidExpirationDate,
                            message:"La fecha de vencimiento es incorrecta.",
                            providerStatus: payment.providerStatus,
                        };
                    case "cc_rejected_bad_filled_security_code":
                        return{
                            status:PaymentStatus.Rejected,
                            reason:PaymentReason.InvalidSecurityCode,
                            message:"El código de seguridad es incorrecto.",
                            providerStatus: payment.providerStatus,
                        };
                    case "cc_rejected_card_disabled":
                        return{
                            status:PaymentStatus.Rejected,
                            reason:PaymentReason.CardDisabled,
                            message:"La tarjeta se encuentra deshabilitada.",
                            providerStatus: payment.providerStatus,
                        };
                    case "cc_rejected_duplicated_payment":
                        return{
                            status:PaymentStatus.Rejected,
                            reason:PaymentReason.PaymentDuplicated,
                            message:"El pago ya fue realizado anteriormente.",
                            providerStatus: payment.providerStatus,
                        };
                    case "cc_rejected_call_for_authorize":
                        return{
                            status:PaymentStatus.Rejected,
                            reason:PaymentReason.AuthorizationRequired,
                            message:"Debés autorizar el pago con el emisor de la tarjeta.",
                            providerStatus: payment.providerStatus,
                        };
                    case "cc_rejected_high_risk":
                        return{
                            status:PaymentStatus.Rejected,
                            reason:PaymentReason.HighRisk,
                            message:"El pago fue rechazado por motivos de seguridad.",
                            providerStatus: payment.providerStatus,
                        };
                    default:
                        return{
                            status:PaymentStatus.Rejected,
                            reason:PaymentReason.Unknown,
                            message:"No fue posible procesar el pago.",
                            providerStatus: payment.providerStatus,
                        };
                }
            default:
                throw new Error(`Unsupported MercadoPago status: ${payment.providerStatus}`
                );
        }
    }
}
