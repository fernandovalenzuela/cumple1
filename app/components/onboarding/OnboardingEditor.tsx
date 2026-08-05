"use client";

import { useState, useRef } from "react";
import OnboardingLayout from "./layout/OnboardingLayout";
import OnboardingFooter from "./OnboardingFooter";
import StepIndicator from "./layout/StepIndicator";
import { EventPageView } from "@/components/EventPageView";
import { useEffect } from "react";
import { useEventStore, } from "@/store/eventStore";
import type { Event } from "@/lib/types";
import { saveEvent } from "@/onboarding/editor/editor.actions";


type Guest={
  id:number;
  name:string;
  code:string;
  foodType:number;
  rsvpStatus:number;
  rsvpMessage?:string;
  birthdayEventId:number;
  peopleLimit:number;
  peopleConfirmed?:number;
};

interface OnboardingEditorProps{
  event:Event;
  guest:Guest|null;
  accessType:number;
  currentStep:number;
  totalSteps:number;
  nextLabel:string;
  loading:boolean;
  nextDisabled:boolean;
  onNext:()=>Promise<void>;
}

export default function OnboardingEditor({
  event,
  guest,
  accessType,
  currentStep,
  totalSteps,
  nextLabel,
  loading,
  nextDisabled,
  onNext,
}:OnboardingEditorProps){

  const [preview,setPreview]=useState(false);
  const [classFormat,setClassFormat]=useState("admin-page");
  const setEvent=useEventStore(state=>state.setEvent);
  const currentEvent=useEventStore(state=>state.event);
  const pendingFiles=useEventStore(state=>state.pendingFiles);
  const pendingGalleryFiles=useEventStore(state=>state.pendingGalleryFiles);
  const markSaved=useEventStore(state=>state.markSaved);
  const {clearPendingFiles,clearPendingGalleryFiles} = useEventStore();
  const [saving,setSaving]=useState(false);
  const [contentConfirmed,setContentConfirmed]=useState(false);
  const confirmationRef=useRef<HTMLDivElement>(null);
  const checkboxRef=useRef<HTMLInputElement>(null);
  const [showConfirmationError,setShowConfirmationError]=useState(false);

  useEffect(()=>{
    setEvent(event);
  },[event,setEvent]);

  async function handleNext(){
    if(!contentConfirmed){
        setShowConfirmationError(true);
        confirmationRef.current?.scrollIntoView({
            behavior:"smooth",
            block:"center",
        });
        checkboxRef.current?.focus();
        return;
    }
    if(saving || loading|| nextDisabled|| !currentEvent)
      return;
    try {
      setSaving(true);

      await saveEvent({
        event:currentEvent,
        pendingFiles,
        pendingGalleryFiles,
      });
      markSaved();
      clearPendingFiles();
      clearPendingGalleryFiles();
      await onNext();
    }
    finally{
      setSaving(false);
    }
  }

  

  return(

    <OnboardingLayout classFormat={classFormat}>

      {!preview&&(
        <>
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
          <div className="admin-section-gap"/>
        </>
      )}

      <EventPageView
       key={preview ? "preview" : "edit"}
        event={event}
        guest={guest}
        editable={!preview}
      />

      {!preview&&(
          <section ref={confirmationRef} className={showConfirmationError
            ? "admin-card mt-6 border-2 border-red-500"
            : "admin-card mt-6" }
>

              <label className="flex items-start gap-3 cursor-pointer">

                  <input
                      ref={checkboxRef}
                      type="checkbox"
                      className="mt-1 h-5 w-5"
                      checked={contentConfirmed}
                      onChange={(e)=>{
                          setContentConfirmed(e.target.checked);
                          if(e.target.checked){
                              setShowConfirmationError(false);
                          }
                      }}
                  />

                  <span className="text-sm leading-6 text-gray-700">
                      Confirmo que los textos e imágenes de este evento cumplen las <a href="/terms" target="_blank" className="underline">Condiciones de uso</a> y no contienen contenido ofensivo, discriminatorio, violento, ilegal, fraudulento ni infringen derechos de terceros. Entiendo que el evento podrá ser rechazado durante la revisión si incumple estas condiciones, aun cuando el pago haya sido realizado. En ese caso, podré corregir el contenido y volver a enviarlo para su revisión.
                      {showConfirmationError&&(
                          <p className="mt-3 text-sm text-red-600">
                              Debes confirmar esta declaración para continuar.
                          </p>
                      )}
                  </span>
                  

              </label>

          </section>
      )}

      <div className=""/>

      <OnboardingFooter
        preview={preview}
        loading={loading || saving}
        nextLabel={nextLabel}
        nextDisabled={nextDisabled}
        onPreview={()=>{
            setPreview(value=>!value);
            preview
                ?setClassFormat("admin-page border-none")
                :setClassFormat("admin-page-onboarding-preview border-none");
        }}
        onNext={handleNext}
      />

    </OnboardingLayout>

  );

}