import { formatCurrency } from "@/lib/utils";
import type { PaymentSummaryEvent } from "@/lib/payment/types";
import Image from "next/image";
import { getPaymentProviderInfo, getIntegerPart, calculateTotal } from "@/lib/utils";
import { PaymentProviderType } from "@/lib/constants";

type PaymentSummaryProps={
  event:PaymentSummaryEvent;
};

export default function PaymentSummary({
  event,
}:PaymentSummaryProps){

  const discountAmount=Number(event.price)*Number(event.discount)/100;
  const total = calculateTotal(event.price, event.discount);
  const provider=getPaymentProviderInfo(event.paymentProvider);

  return(

    <section className="admin-card max-w-xl mx-auto">

      <h1 className="admin-title mb-6">
        Confirmar compra
      </h1>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>Evento</span>
          <span className="font-medium">
            {event.name}
          </span>
        </div>

        <div className="flex justify-between">
          <span>ID del evento</span>
          <span className="font-medium">
            #{String(event.id).padStart(6,"0")}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Plan contratado</span>
          <span className="font-medium">
            {event.planName}
          </span>
        </div>

        {/*<div className="text-sm text-gray-500">
          {event.description}
        </div>*/}

        <hr/>

        <div className="flex justify-between">
          <span>Precio</span>
          <span>
            {formatCurrency(event.price,event.currency,event.locale)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Descuento</span>
          <span>
            {getIntegerPart(event.discount)}%
          </span>
        </div>

        {event.discount>0&&(
          <div className="flex justify-between text-green-600">
            <span>
              Descuento ({event.discount}%)
            </span>
            <span>
              -{formatCurrency(discountAmount,event.currency,event.locale)}
            </span>
          </div>
        )}

        <hr/>

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>
            {formatCurrency(total,event.currency,event.locale)}
          </span>
        </div>

        <hr/>

        <div className="space-y-3">

          <div className="font-medium">
            Medios de pago
          </div>

          {event.paymentProvider===PaymentProviderType.None?

            <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">

              <div className="font-medium">
                No hay medios de pago disponibles.
              </div>

              <div className="mt-2 text-sm text-gray-600">
                Si desea más información puede escribir a
              </div>

              <div className="mt-1 font-medium">
                {event.contactEmail}
              </div>

            </div>

          :

            <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">

              <input
                type="radio"
                checked
                readOnly
              />

              <Image
                src={provider.icon}
                alt={provider.caption}
                width={32}
                height={32}
              />

              <div>

                <div className="font-medium">
                  {provider.caption}
                </div>

                <div className="text-sm text-gray-500">
                  {provider.description}
                </div>

              </div>

            </label>

          }

        </div>

      </div>

    </section>

  );

}