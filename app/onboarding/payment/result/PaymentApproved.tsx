interface PaymentApprovedProps{
    amount:number;
    currency:string;
    providerPaymentId:string|null;
    message:string|null;
}

export default function PaymentApproved({
    amount,
    currency,
    providerPaymentId,
    message,
}:PaymentApprovedProps){

    return(
        <section className="admin-card max-w-xl mx-auto">

        <div className="flex flex-col items-center gap-6 text-center">
            <div className="text-6xl">
                ✅
            </div>

            <div className="space-y-2">

                <h1 className="text-3xl font-bold">
                    ¡Pago realizado!
                </h1>

                <p className="text-muted-foreground">
                    {message ?? "El pago fue aprobado correctamente."}
                </p>

            </div>

        </div>
        </section>
    );

}