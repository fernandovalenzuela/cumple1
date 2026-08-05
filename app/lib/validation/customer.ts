import { CustomerFormData } from "./../onboarding/types";
import { OccasionType } from "@/lib/constants";

export interface CustomerValidationResult {
  valid:boolean;
  errors:Record<string,string>;
}
export function validateCustomerForm(form:CustomerFormData):CustomerValidationResult {
  const errors:Record<string,string>={};
  if(!form.planId)
    errors.planId="Lamentablemente no se encuentra disponible este producto en tu país.";
  if(form.occasionType===OccasionType.None){
    errors.occasionType="Seleccioná el tipo de evento.";
}
  if(form.fullName.trim().length<2)
    errors.fullName="Ingresá tu nombre.";
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email="Email inválido.";
  if(form.password.length<8)
    errors.password="La contraseña debe tener al menos 8 caracteres.";
  if(!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))
    errors.password="La contraseña debe contener al menos una letra y un número.";
  if(!/^\d+$/.test(form.waPhone))
    errors.waPhone="Ingresá solamente números.";
  if(!form.termsAccepted)
    errors.termsAccepted="Debés aceptar los términos y condiciones.";
  if(!form.captchaToken?.trim())
    errors.captchaToken="Debés completar el captcha.";
  return {
    valid:Object.keys(errors).length===0,
    errors,
  };
}
const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validateEmail(
  email: string
) {
  return EMAIL_REGEX.test(email);
}
export function validatePassword(
  password: string
) {
  if (password.length < 8)
    return false;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasLetter && hasNumber;
}

