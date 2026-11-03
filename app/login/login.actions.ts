"use server";

import { redirect } from "next/navigation";
import { AccountAuthService } from "@/account/AccountAuthService";
import { AccountType } from "@/lib/constants";

export interface LoginData {
  email: string;
  password: string;
  captchaToken: string;
}

export interface LoginResult {
  success: boolean;
  message?: string;
  redirectTo?: string;
}

async function verifyCaptcha(token: string): Promise<boolean> {

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY no configurada.");
    return false;
  }

  try {

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
        cache: "no-store",
      }
    );

    const result = await response.json();

    return result.success === true;

  } catch (error) {

    console.error("Error verificando reCAPTCHA:", error);
    return false;

  }

}

export async function loginAccount(
  data: LoginData
): Promise<LoginResult> {

  const email = data.email.trim().toLowerCase();
  const password = data.password;

  if (!email || !password) {
    return {
      success: false,
      message: "Ingresá tu email y contraseña.",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "El formato del email no es válido.",
    };
  }

  // Verificación CAPTCHA, si está habilitado.

  const captchaEnabled =
    process.env.RECAPTCHA_ENABLED === "true";

  if (captchaEnabled) {

    if (!data.captchaToken) {
      return {
        success: false,
        message: "Completá la verificación de seguridad.",
      };
    }

    const captchaValid =
      await verifyCaptcha(data.captchaToken);

    if (!captchaValid) {
      return {
        success: false,
        message: "No fue posible verificar el CAPTCHA. Intentá nuevamente.",
      };
    }

  }

  // Autenticación de la cuenta.

  const authService = new AccountAuthService();

  let result;

  try {

    result = await authService.authenticate(
      email,
      password
    );

  } catch (error) {

    console.error("Error durante el login:", error);

    return {
      success: false,
      message: "No fue posible iniciar sesión. Intentá nuevamente.",
    };

  }

  if (!result.success) {
    return {
      success: false,
      message: result.message,
    };
  }

  // Redirección según el tipo de cuenta.

  switch (result.accountType) {

    case AccountType.Organizer:
        return {
        success: true,
        redirectTo: "/organizer/admin",
        };

    case AccountType.Partner:
        return {
        success: true,
        redirectTo: "/partner/admin",
        };

    case AccountType.Webmaster:
        return {
        success: true,
        redirectTo: "/webmaster/admin",
        };

    default:
        return {
        success: false,
        message: "Tipo de cuenta no reconocido.",
        };

  }

}