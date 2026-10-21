"use client";

import { useState } from "react";
import { CustomerFormData } from "@/lib/onboarding/types";
import { Eye, EyeOff } from "lucide-react";
import { getCountries } from "@/lib/countries";
import { OccasionType } from "@/lib/constants";
import { getOccasionTypeInfo } from "@/lib/utils";

interface CustomerFormProps {
  form: CustomerFormData;
  loading: boolean;
  submitted: boolean;
  errors: Record<string, string>;
  onChange: <K extends keyof CustomerFormData>(
    field: K, value: CustomerFormData[K] ) => void;
}

export default function CustomerForm({
  form, loading, submitted, errors, onChange,}: CustomerFormProps) {

  const [showPassword, setShowPassword] = useState(false);
  const countries=getCountries();
  const selectedCountry=countries.find(country=>country.code===form.country);
  const countryPrefix=selectedCountry?.phonePrefix ?? "+";  


  return (
    <div className="space-y-6">

      <div className="admin-field">
    <label className="admin-label">
        Tipo de evento
    </label>

    <select
        className="admin-select"
        value={form.occasionType}
        disabled={loading}
        onChange={e=>onChange("occasionType",Number(e.target.value))} >
            {Object.values(OccasionType)
                .filter(value=>typeof value==="number")
                .map(value=>{const info=getOccasionTypeInfo(value as number);
                    return(
                        <option key={value} value={value}  >
                            {info.caption}
                        </option>
                    );
                })}
        </select>
        <p className="admin-helper">
            Nos permitirá personalizar mejor tu evento.
        </p>
        {submitted&&errors.occasionType&&(
            <p className="admin-error">
                {errors.occasionType}
            </p>
        )}
    </div>

      <div className="admin-field">
        <label className="admin-label">
          Nombre
        </label>
        <p className="admin-helper">
            Indicanos el nombre de la persona que realizará la compra.
        </p>

        <input
          className="admin-input"
          required
          type="text"
          value={form.fullName}
          autoComplete="name"
          disabled={loading}
          maxLength={120}
          onChange={(e)=>
            onChange("fullName",e.target.value)}
        />
        {submitted && errors.fullName && (
          <p className="admin-error">
            {errors.fullName}
          </p>
        )}
      </div>

      <div className="admin-field">
        <label className="admin-label"> País </label>
        <select
            className="admin-select"
            value={form.country}
            disabled={loading}
            onChange={e=>{

              const country=countries.find(c=>c.code===e.target.value);

              if(!country)
                return;

              onChange("country",country.code);
              onChange("locale",country.locale);
              onChange("currency",country.currency);

            }}
          >
            {countries.map(country=>(
              <option
                key={country.code}
                value={country.code}
              >
                {country.name}
              </option>
            ))}
          </select>
      </div>

      <div className="admin-field">
        <label className="admin-label"> Email </label>
        <input
          className="admin-input"
          required
          type="email"
          maxLength={150}
          autoComplete="email"
          value={form.email}
          disabled={loading}
          onChange={(e)=>
            onChange("email", e.target.value ) }
        />
        <p className="admin-helper">
          Verificá que el email esté correctamente escrito.
          Se utilizará para comunicarte el estado y novedades de tus eventos.
        </p>
        {submitted && errors.email && (
          <p className="admin-error"> {errors.email} </p>
        )}
      </div>

      <div className="admin-field">
        <label className="admin-label"> WhatsApp </label>
          <div className="flex items-stretch">
            <div
                className="admin-input flex items-center rounded-r-none bg-gray-50"
            >
                {countryPrefix}
            </div>

            <input
                className="admin-input rounded-l-none border-l-0" 
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                required
                maxLength={20}
                value={form.waPhone}
                disabled={loading}
                onChange={(e)=>
                  onChange( "waPhone", e.target.value.replace(/\D/g,"")) }
            />
        </div>

        <p className="admin-helper"> Ingresá únicamente números.</p>
        {submitted && errors.waPhone && (
          <p className="admin-error">
            {errors.waPhone}
          </p>
        )}
      </div>

      <div className="admin-field">
        <label className="admin-label"> Contraseña </label>
        <div className="relative">
          <input
            className="admin-input pr-12"
            required
            autoComplete="new-password"
            type={ showPassword ? "text" : "password" }
            value={form.password}
            disabled={loading}
            maxLength={100}
            onChange={(e)=>
              onChange( "password", e.target.value ) }
          />

          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2"
            disabled={loading}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            onClick={()=>
              setShowPassword(!showPassword )}
          >
            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>   }
            
          </button>
        </div>

        <p className="admin-helper">
          Mínimo 8 caracteres, al menos una letra y un número.
        </p>
        {submitted && errors.password && (
          <p className="admin-error"> {errors.password} </p>
        )}
      </div>

      <div className="admin-field">
        <label className="admin-checkbox">
            <input
                type="checkbox"
                checked={!!form.captchaToken}
                disabled={loading}
                onChange={(e)=>
                    onChange(
                        "captchaToken",
                        e.target.checked ? "dummy-token" : ""
                    )
                }
            />
            <span className="ml-2">No soy un robot</span>
        </label>  
      </div>

      {submitted && errors.captchaToken && (
          <p className="admin-error">
              {errors.captchaToken}
          </p>
      )}

      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={form.termsAccepted} 
          disabled={loading}
          onChange={(e)=>
            onChange( "termsAccepted",e.target.checked ) }
        />

        <span className="ml-2">
          Acepto los{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-link"
          >
            Términos y Condiciones
          </a>
        </span>
      </label>

      {submitted && errors.termsAccepted && (
        <p className="admin-error"> {errors.termsAccepted} </p>
      )}
      {submitted && errors.general && (
        <div className="admin-error"> {errors.general} </div>
      )}
    </div>
  );
}