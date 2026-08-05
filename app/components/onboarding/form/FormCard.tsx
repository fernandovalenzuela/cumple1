interface FormCardProps{
    children:React.ReactNode;
}

export default function FormCard({
    children,
}:FormCardProps){
    return(
        <section className="admin-card">
            {children}
        </section>
    );
}