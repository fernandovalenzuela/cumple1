"use client";

import { useState,useTransition } from "react";
import OnboardingLayout from "@/components/onboarding/layout/OnboardingLayout";
import StepIndicator from "@/components/onboarding/layout/StepIndicator";
import FooterActions from "@/components/onboarding/layout/FooterActions";
import { updateContactEmail } from "./end.actions";

interface OnboardingEndProps{
  currentStep:number;
  totalSteps:number;
  contactEmail:string;
  loading:boolean;
  onNext:()=>void;
}

export default function OnboardingEnd({
  currentStep,
  totalSteps,
  contactEmail,
  loading,
  onNext,
}:OnboardingEndProps){

  const [editingEmail,setEditingEmail]=useState(false);
  const [email,setEmail]=useState(contactEmail);
  const [savedEmail,setSavedEmail]=useState(contactEmail);
  const [message,setMessage]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);
  const [pending,startTransition]=useTransition();

  function handleSave(){

    setMessage(null);
    setError(null);

    startTransition(async()=>{

      const result=await updateContactEmail(email);

      if(result.success){

        setSavedEmail(email.trim().toLowerCase());
        setEditingEmail(false);
        setMessage("El email fue actualizado correctamente.");

      }else{

        setError(result.message);

      }

    });

  }

  function handleCancel(){

    setEmail(savedEmail);
    setEditingEmail(false);
    setError(null);
    setMessage(null);

  }

  return(

    <OnboardingLayout>

      <StepIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="admin-section-gap"/>

      <section className="mx-auto max-w-3xl">

        <div className="rounded-xl border border-gray-200 bg-white p-8">

          <h1 className="text-3xl font-bold text-gray-900">
            ¡Configuración completada!
          </h1>

          <p className="mt-6 text-base leading-7 text-gray-700">
            Terminaste de configurar tu evento correctamente.
          </p>

          <p className="mt-6 text-base leading-7 text-gray-700">
            Antes de publicar el evento realizaremos una revisión para verificar que el contenido cumpla nuestras políticas de uso.
          </p>

          <p className="mt-4 text-base leading-7 text-gray-700">
            Analizaremos tanto los textos como las imágenes para detectar contenido ofensivo, discriminatorio, violento o cualquier otro contenido que incumpla nuestras condiciones de uso.
          </p>

          <p className="mt-6 text-base leading-7 text-gray-700">
            En breve recibirás un email informando si tu evento fue publicado para que puedas comenzar a compartirlo con tus invitados.
          </p>

          <p className="mt-4 text-base leading-7 text-gray-700">
            Si durante la revisión encontramos algún inconveniente, también te enviaremos el detalle para que puedas corregirlo.
          </p>

          <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5">

            <div className="text-sm font-medium text-gray-500">
              Email de contacto
            </div>

            {editingEmail?

              <>

                <input
                  type="email"
                  className="admin-input mt-3 w-full"
                  value={email}
                  disabled={pending}
                  onChange={e=>setEmail(e.target.value)}
                />

                {error&&(
                  <div className="mt-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="mt-5 flex gap-3">

                  <button
                    type="button"
                    className="admin-button-secondary"
                    disabled={pending}
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="admin-button"
                    disabled={pending}
                    onClick={handleSave}
                  >
                    {pending?"Guardando...":"Guardar"}
                  </button>

                </div>

              </>

            :

              <>

                <div className="mt-2 break-all text-lg font-semibold text-gray-900">
                  {savedEmail}
                </div>

                {message&&(
                  <div className="mt-3 text-sm text-[var(--color-success)]">
                    {message}
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                  <span className="text-sm text-gray-600">
                    ¿El email es incorrecto?
                  </span>

                  <button
                    type="button"
                    className="admin-button-secondary admin-button-small"
                    onClick={()=>{
                      setEditingEmail(true);
                      setMessage(null);
                    }}
                  >
                    Cambiar email
                  </button>

                </div>

              </>

            }

          </div>

        </div>

      </section>

      <FooterActions
        nextLabel="Administrar mis eventos"
        loading={loading||pending}
        disabled={editingEmail}
        loadingLabel="Abriendo..."
        information={
          <>Desde el <strong>Administrador de eventos</strong> podrás consultar el estado de tu evento.</>
        }
        onNext={onNext}
      />

    </OnboardingLayout>

  );

}