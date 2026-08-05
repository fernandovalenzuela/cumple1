import { PaymentResult } from "@/payment/dto/paymentDTOs";
import { formatCurrency } from "@/lib/utils";
import { getPaymentProviderInfo } from "@/lib/utils";

export default function PaymentResumeCard({
    eventId,
    payment,
}: {
    eventId:number;
    payment: PaymentResult;
}) {

    const provider = getPaymentProviderInfo(payment.providerId);

    return (
        <section className="admin-card max-w-xl mx-auto">
            <h2 className="admin-title mb-6">
                Resumen del pago
            </h2>
            <div className="space-y-4">
                <div className="flex justify-between">
                    <span>Número de evento</span>
                    <span className="font-medium">
                        #{String(eventId).padStart(6, "0")}
                    </span>
                    <hr/>
                </div>
                <p className="text-xs text-soft">Utiliza este número si necesitas realizar una consulta sobre tu pago.</p>    
                <hr />
                <div className="flex justify-between">
                    <span>Importe</span>
                    <span className="font-medium">
                        {formatCurrency(
                            payment.amount,
                            payment.currency
                        )}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Medio de pago</span>

                    <span className="font-medium">
                        {provider.caption}
                    </span>
                </div>
            </div>
        </section>
    );
}