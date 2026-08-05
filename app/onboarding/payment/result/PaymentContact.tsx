interface PaymentContactProps{
    eventId?:number;
    contactEmail:string;
}

export default function PaymentContact({
    eventId,
    contactEmail,
}:PaymentContactProps){
    const mailto =`mailto:${contactEmail}?subject=${encodeURIComponent(`Consulta sobre evento #${eventId}`
)}`

    return(
        <section className="admin-card max-w-xl mx-auto">
            <h3 className="font-medium">
                ¿Necesitas ayuda?
            </h3>
            <p className="text-muted-foreground text-sm">
                Si el problema continúa, puedes escribirnos a 
           
            <a
                href={mailto}
                className="text-orange-600 hover:underline font-medium"
            >
                {"  " + contactEmail}
            </a>
             </p>
        </section>
    );
}