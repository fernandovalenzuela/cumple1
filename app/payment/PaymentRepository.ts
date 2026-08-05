import { sql } from "@/lib/db";
import { CreatePaymentData, UpdatePaymentData, CreatePaymentLogData, PaymentInfo, RestartPaymentData, PaymentReason } from "./dto/paymentDTOs";
import { Status, PaymentStatus } from "@/lib/constants";


export class PaymentRepository{

    async createPaymentRepo(payment:CreatePaymentData):Promise<void>{
        await sql`
            INSERT INTO "birthdayPayments"
            (
                "eventId",
                provider,
                "providerCheckoutId",
                status,
                amount,
                currency
            )
            VALUES
            (
                ${payment.eventId},
                ${payment.provider},
                ${payment.providerCheckoutId},
                ${payment.status},
                ${payment.amount},
                ${payment.currency}
            )
        `;
    }

    async findByEventIdRepo(eventId:number):Promise<PaymentInfo|null>{

        const rows=await sql<PaymentInfo[]>`
            SELECT
                id,
                "eventId",
                provider,
                "providerCheckoutId",
                "providerPaymentId",
                "providerTransactionId",
                status,
                amount,
                currency,
                "paymentDate",
                "paymentMessage",
                "paymentReason"
            FROM "birthdayPayments"
            WHERE "eventId"=${eventId}
        `;

        if(rows.length===0){
            return null;
        }

        return{
            id:rows[0].id,
            eventId:rows[0].eventId,
            provider:rows[0].provider,
            providerCheckoutId:rows[0].providerCheckoutId,
            providerPaymentId:rows[0].providerPaymentId,
            providerTransactionId:rows[0].providerTransactionId,
            status:rows[0].status,
            amount:Number(rows[0].amount),
            currency:rows[0].currency,
            paymentDate:rows[0].paymentDate,
            paymentMessage:rows[0].paymentMessage,
            paymentReason:rows[0].paymentReason,
        };
    }

    async updatePaymentFromWebhookRepo(payment:UpdatePaymentData):Promise<void>{
        await sql`
            UPDATE "birthdayPayments"
            SET
                status=${payment.status},
                "providerPaymentId"=${payment.providerPaymentId},
                "providerTransactionId"=${payment.providerTransactionId},
                "paymentDate"=${payment.paymentDate},
                "paymentMessage"=${payment.paymentMessage},
                "paymentReason"=${payment.paymentReason},
                "updatedAt"=NOW()
            WHERE "eventId"=${payment.eventId}
        `;
    }

    async insertPaymentLogRepo(log:CreatePaymentLogData):Promise<void>{
        await sql`
            INSERT INTO "birthdayPaymentLogs"
            (
                "paymentId",
                source,
                "providerEvent",
                "providerStatus",
                "domainStatus",
                "providerCheckoutId",
                "providerPaymentId",
                "providerTransactionId",
                "providerStatusDetail",
                payload
            )
            VALUES
            (
                ${log.paymentId},
                ${log.source},
                ${log.providerEvent},
                ${log.providerStatus},
                ${log.domainStatus},
                ${log.providerCheckoutId},
                ${log.providerPaymentId},
                ${log.providerTransactionId},
                ${log.providerStatusDetail},
                ${sql.json(log.payload)}
            )
        `;
    }

    async updateEventStatusRepo(
        eventId: number,
        status: Status
    ): Promise<void> {

        await sql`
            update "birthdayEvents"
            set status = ${status}
            where id = ${eventId}
        `;

    }

    async restartPayment(payment: RestartPaymentData): Promise<void> {
        // cuando un cliente reintenta un pago fallido, se actualiza el registro del pago ya generado
        await sql`
            UPDATE "birthdayPayments"
            SET
                "providerCheckoutId" = ${payment.providerCheckoutId},
                "providerPaymentId" = NULL,
                "providerTransactionId" = NULL,
                status = ${PaymentStatus.Created},
                "paymentDate" = NULL,
                "paymentReason" = ${PaymentReason.None},
                "paymentMessage" = NULL,
                "updatedAt" = NOW()
            WHERE "eventId" = ${payment.eventId}
        `;

    }

}

