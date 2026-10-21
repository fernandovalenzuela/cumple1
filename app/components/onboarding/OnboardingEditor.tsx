"use client";

import { useState,useRef,useEffect } from "react";
import OnboardingLayout from "./layout/OnboardingLayout";
import OnboardingFooter from "./OnboardingFooter";
import StepIndicator from "./layout/StepIndicator";
import Tutorial from "./tutorial/Tutorial";
import { EventPageView } from "@/components/EventPageView";
import { useEventStore } from "@/store/eventStore";
import type { Event } from "@/lib/types";
import { saveEvent } from "@/onboarding/editor/editor.actions";
import { tutorialSteps } from "./tutorial/tutorialSteps";


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
  const [tutorialVisible,setTutorialVisible]=useState(!preview);
  const [tutorialStep,setTutorialStep]=useState<number|null>(null);

  const setEvent=useEventStore(state=>state.setEvent);
  const activePanel=useEventStore(state=>state.activePanel);
  const activeEditMarker=useEventStore(state=>state.activeEditMarker);
  const markerEditorOpen=activePanel!==null||activeEditMarker!==null;

  const currentEvent=useEventStore(state=>state.event);
  const pendingFiles=useEventStore(state=>state.pendingFiles);
  const pendingGalleryFiles=useEventStore(state=>state.pendingGalleryFiles);
  const markSaved=useEventStore(state=>state.markSaved);
  const {clearPendingFiles,clearPendingGalleryFiles}=useEventStore();

  const [saving,setSaving]=useState(false);
  const [contentConfirmed,setContentConfirmed]=useState(false);
  const confirmationRef=useRef<HTMLDivElement>(null);
  const checkboxRef=useRef<HTMLInputElement>(null);
  const [showConfirmationError,setShowConfirmationError]=useState(false);
  const [sectionTourActive,setSectionTourActive]=useState(false);
  const tutorialScrollYRef=useRef(0);
  const previousMarkerEditorOpenRef=useRef(false);
  const restoreTutorialScrollRef=useRef(false);
  
  useEffect(()=>{
    if(!tutorialVisible || tutorialStep===null){
      return;
    }
    const handleScroll=()=>{
      if(!markerEditorOpen){
        tutorialScrollYRef.current=window.scrollY;
      }
    };
    handleScroll();
    window.addEventListener("scroll",handleScroll,{passive:true});
    return ()=>{window.removeEventListener("scroll",handleScroll); };
  },[tutorialVisible,tutorialStep,markerEditorOpen,]);

  useEffect(()=>{
    const wasOpen=previousMarkerEditorOpenRef.current;
    /* Apertura del editor */
     if(!wasOpen && markerEditorOpen && tutorialVisible && tutorialStep!==null
    ){
      const currentTutorialStep=tutorialSteps[tutorialStep];
      const markerId=currentTutorialStep?.markerId;
      const shouldMoveToTop= markerId==="marker-appearance" ||markerId==="marker-title_2" ||
        markerId==="marker-name" ||  markerId==="marker-picture";
      if(shouldMoveToTop){
        restoreTutorialScrollRef.current=true;
        requestAnimationFrame(()=>{
          window.scrollTo({top:0, behavior:"auto",});
        });
      }
    }
    /* Cierre del editor */
    if( wasOpen && !markerEditorOpen && restoreTutorialScrollRef.current
    ){
      const scrollY=tutorialScrollYRef.current;
      restoreTutorialScrollRef.current=false;
      requestAnimationFrame(()=>{ requestAnimationFrame(()=>{  window.scrollTo({top:scrollY,
            behavior:"auto", }); }); });
    }
    previousMarkerEditorOpenRef.current=markerEditorOpen;
  },[markerEditorOpen,tutorialVisible,tutorialStep,]);

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

    if(
      saving||
      loading||
      nextDisabled||
      !currentEvent
    ){
      return;
    }

    try{

/*console.log("#currentEvent",currentEvent);
setSaving(false);
return;*/

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

    }finally{

      setSaving(false);

    }

  }

  function togglePreview(){
    console.log("@ toggle preview ", preview);
    setPreview(value=>{
      const next=!value;
      setClassFormat(
        next
          ?"admin-page-onboarding-preview border-none"
          :"admin-page border-none"
      );
      console.log("@ toggle next ", next);
      return next;
    });
    
  }

  return(

    <OnboardingLayout classFormat={classFormat}>

      {!sectionTourActive&&tutorialStep===null&&!preview&&(
        <>
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
          <div className="admin-section-gap"/>
        </>
      )}
      {tutorialVisible&&(
        <Tutorial
          preview={preview}
          markerEditorOpen={markerEditorOpen}
          onSectionTourChange={active=>setSectionTourActive(active)}
          tutorialStep={tutorialStep}
          onStepChange={setTutorialStep}
          onPreview={togglePreview}
          onFinish={()=>{
            setTutorialVisible(false);
            setTutorialStep(null);
            window.scrollTo({top:0,behavior:"smooth"});
          }}
        />
      )}

      

      <EventPageView
        key={preview?"preview":"edit"}
        event={currentEvent||event}
        guest={guest}
        editable={!preview}
        tutorialStep={tutorialStep}
        sectionTourActive={sectionTourActive}
        preview={preview}
        tutorialVisible={tutorialVisible}
      />

      {!preview&&!tutorialVisible&&(
        <section
          ref={confirmationRef}
          className={
            showConfirmationError
            ?"admin-card mt-6 border-2 border-red-500"
            :"admin-card mt-6"
          }
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

      {!tutorialVisible&&(
      <OnboardingFooter
        preview={preview}
        loading={loading||saving}
        nextLabel={nextLabel}
        nextDisabled={nextDisabled}
        onPreview={togglePreview}
        onNext={handleNext}
      />)}

    </OnboardingLayout>

  );

}