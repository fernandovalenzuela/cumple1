"use client";

import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginData, LoginResult } from "./login.actions";


interface LoginFormProps {
  captchaEnabled: boolean;
  captchaSiteKey: string;

  onLogin: ( data: LoginData) => Promise<LoginResult>;
}

export default function LoginForm({
  captchaEnabled,
  captchaSiteKey,
  onLogin,
}: LoginFormProps) {

  const captchaRef = useRef<ReCAPTCHA>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const captchaConfigured = !captchaEnabled || !!captchaSiteKey;
  const router = useRouter();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    if (loading) {
      return;
    }
    setSubmitted(true);
    setError("");
    if (!email.trim()) {
      setError("Ingresá tu email.");
      return;
    }
    if (!password) {
      setError("Ingresá tu contraseña.");
      return;
    }
    if (!captchaConfigured) {
      setError("El CAPTCHA no está configurado.");
      return;
    }
    if (captchaEnabled && !captchaToken) {
      setError("Completá la verificación de seguridad.");
      return;
    }

    try {

      setLoading(true);

      const result = await onLogin({
        email: email.trim(),
        password,
        captchaToken: captchaToken ?? "",
      });

      if (!result.success) {

        setError(
          result.message ?? "No fue posible iniciar sesión."
        );

        setLoading(false);

        if (captchaEnabled) {
          captchaRef.current?.reset();
          setCaptchaToken(null);
        }

        return;
      }

      if (result.redirectTo) {
        router.replace(result.redirectTo);
        return;
      }

      setError("No se recibió una ruta de destino.");
      setLoading(false);

    } catch (error) {

      console.error(error);

      setError("Ocurrió un error. Intentá nuevamente.");

      setLoading(false);

      if (captchaEnabled) {
        captchaRef.current?.reset();
        setCaptchaToken(null);
      }

    }
  }
  return (
    <main className="admin-container">
      <div className="admin-page">
        <section className="admin-card">
          <h1 className="admin-title">
            Iniciar sesión
          </h1>
          <p className="admin-helper mt-2 mb-8">
            Ingresá tus datos para acceder a tu cuenta.
          </p>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* EMAIL */}
            <div className="admin-field">
              <label htmlFor="email" className="admin-label" >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="admin-input"
                value={email}
                autoComplete="username"
                maxLength={150}
                disabled={loading}
                required
                onChange={e =>
                  setEmail(e.target.value)
                }
              />
            </div>
            {/* PASSWORD */}
            <div className="admin-field">
              <label
                htmlFor="password"
                className="admin-label"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="admin-input pr-12"
                  value={password}
                  autoComplete="current-password"
                  maxLength={100}
                  disabled={loading}
                  required
                  onChange={e =>
                    setPassword(e.target.value)
                  }
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword
                    ? <EyeOff size={20} />
                    : <Eye size={20} />
                  }
                </button>
              </div>
            </div>
            {/* CAPTCHA */}
            {captchaEnabled && captchaConfigured && (
              <div className="admin-field">
                <ReCAPTCHA
                  ref={captchaRef}
                  sitekey={captchaSiteKey}
                  onChange={token =>
                    setCaptchaToken(token)
                  }
                  onExpired={() =>
                    setCaptchaToken(null)
                  }
                  onErrored={() =>
                    setCaptchaToken(null)
                  }
                />
              </div>
            )}
            {/* ERROR */}
            {error && (
              <div className="admin-error">
                {error}
              </div>
            )}
            {/* SUBMIT */}
            <button
              type="submit"
              className="admin-button w-full"
              disabled={
                loading ||
                !captchaConfigured
              }
            >
              {loading
                ? "Ingresando..."
                : "Ingresar"
              }
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}