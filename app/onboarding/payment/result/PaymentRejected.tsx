
import PaymentContact from "./PaymentContact";
import { contactEmail } from "@/lib/constants";

interface PaymentRejectedProps{
    eventId?:number;
    message:string|null;
    loading:boolean;
    onRetry:()=>Promise<void>;
}

export default function PaymentRejected({
    eventId,
    message,
    loading,
    onRetry,
}:PaymentRejectedProps){

    return(
        <section className="admin-card max-w-xl mx-auto py-8">
        <div className="flex flex-col items-center gap-6 text-center mb-6">

            <div className="text-6xl">
                ❌
            </div>

            <div className="space-y-2">

                <h1 className="text-3xl font-bold">
                    {message ?? "No fue posible procesar el pago."}
                </h1>

                <p className="text-muted-foreground">
                    Puedes intentarlo nuevamente.
                </p>

            </div>

            <button
                type="button"
                className="admin-button flex-1"
                onClick={onRetry}
                disabled={loading}

            >
                {loading
                    ? "Procesando..."
                    : "Intentar nuevamente"}
            </button>

        </div>

        <PaymentContact
            eventId={eventId}
            contactEmail={contactEmail}
        />
        </section>
    );

}