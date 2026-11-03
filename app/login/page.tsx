import { redirect } from "next/navigation";
import {getCurrentSession,SessionType,} from "@/lib/auth/session";
import { AccountType } from "@/lib/constants";
import LoginForm from "./LoginForm";
import { loginAccount } from "./login.actions";

function getAccountAdminPath(accountType: AccountType): string {
    switch (accountType) {
    case AccountType.Organizer:
    return "/organizer/admin";

    case AccountType.Partner:
    return "/partner/admin";

    case AccountType.Webmaster:
    return "/webmaster/admin";

    default:
    return "/login";

    }
}

export default async function LoginPage() {
    const session = await getCurrentSession();

    // Si existe una sesión administrativa.
    if (
        session?.type === SessionType.Account &&
        session.accountId !== undefined &&
        session.accountType !== undefined
    ) {
        redirect(getAccountAdminPath(session.accountType));
    }

    // Si existe una sesión de editor de evento.
    if (
        session?.type === SessionType.EventEditor && session.eventId !== undefined
    ) {redirect("/partnerclient/editor");}

    // Configuración del CAPTCHA.
    const captchaEnabled = process.env.RECAPTCHA_ENABLED === "true";
    const captchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
    return (
        <LoginForm captchaEnabled={captchaEnabled} captchaSiteKey={captchaSiteKey} onLogin={loginAccount} />
    );
}