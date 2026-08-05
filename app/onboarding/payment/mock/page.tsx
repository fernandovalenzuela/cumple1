import Link from "next/link";

export default function Page(){

    return(

        <div className="admin-page">

            <div className="admin-card max-w-lg mx-auto text-center">

                <h1 className="admin-title">
                    #### SIMULACIÓN ####
                    <br/>
                    Checkout Mercado Pago
                </h1>

                <p className="mt-6 text-gray-600">
                    Esta pantalla simula el Checkout Pro de Mercado Pago.
                </p>

                <div className="mt-8 flex flex-col gap-3">

                    <Link
                        href="/onboarding/finish"
                        className="admin-button"
                    >
                        Simular pago
                    </Link>

                    <Link
                        href="/onboarding/payment"
                        className="admin-button-secondary"
                    >
                        Cancelar
                    </Link>

                </div>

            </div>

        </div>

    );

}