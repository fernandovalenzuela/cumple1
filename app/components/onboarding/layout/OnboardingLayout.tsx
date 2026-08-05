interface OnboardingLayoutProps{
    children:React.ReactNode;
    classFormat? :string;
}

export default function OnboardingLayout({
    children,
    classFormat = "admin-page"
}:OnboardingLayoutProps){

    return(
        <main className="admin-container">
            <div className={classFormat}>
                {children}
            </div>
        </main>
    );
    
}