import { PaymentProvider } from "./PaymentProvider";
import { MercadoPagoProvider } from "./MercadoPagoProvider";
import { PaymentProviderType } from "@/lib/constants";


export function getPaymentProvider(
    provider:PaymentProviderType
):PaymentProvider{

  switch(provider){

        case PaymentProviderType.MercadoPagoAR:
            return new MercadoPagoProvider();

        default:
            throw new Error(`Proveedor no soportado: ${provider}`);
    }

}