import PaymentContact from "./PaymentContact";
import { contactEmail } from "@/lib/constants";

interface PaymentPendingProps {
    eventId?:number;
    message: string | null;
    showRefreshButton: boolean;
    refreshing: boolean;
    onRefresh: () => Promise<void>;
}

export default function PaymentPending({
    eventId,
    message,
    showRefreshButton,
    refreshing,
    onRefresh,
}: PaymentPendingProps) {

    const waitingForUser = showRefreshButton && !refreshing;

    return (
        <section className="admin-card max-w-xl mx-auto py-8">
        <div className="flex flex-col items-center gap-6 text-center mb-6">

            <div className={refreshing || !waitingForUser
                ? "animate-spin text-6xl"
                : "text-6xl"}
            >
                ⏳
            </div>

            <div className="space-y-2">

                <h1 className="text-3xl font-bold">
                    {waitingForUser
                        ? "Todavía no pudimos confirmar tu pago"
                        : "Estamos verificando tu pago"}
                </h1>

                {message && (
                    <h2>
                        {message}
                    </h2>
                )}

                <p className="text-muted-foreground">
                    {waitingForUser
                        ? "Si ya completaste el pago, presiona «Actualizar» para consultar nuevamente."
                        : "Esto normalmente demora sólo unos segundos. Espera un momento por favor..."}
                </p>

            </div>

            {(showRefreshButton || refreshing) && (
                <button
                    type="button"
                    className="admin-button flex-1"
                    onClick={onRefresh}
                    disabled={refreshing}
                >
                    {refreshing
                        ? "Actualizando..."
                        : "Actualizar"}
                </button>
            )}

        </div>
        {showRefreshButton && (    
        <PaymentContact
            eventId={eventId}
            contactEmail={contactEmail}
        />
        )}
        </section>
    );

}