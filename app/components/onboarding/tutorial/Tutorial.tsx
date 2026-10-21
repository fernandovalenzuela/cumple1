"use client";
import { useEffect,useState,useRef } from "react";
import { X } from "lucide-react";
import { tutorialSteps } from "./tutorialSteps";

interface TutorialProps{
  tutorialStep:number|null;
  onStepChange:(step:number|null)=>void;
  onPreview:()=>void;
  onFinish:()=>void;
  onSectionTourChange:(active:boolean)=>void;
  preview:boolean;
  markerEditorOpen:boolean;
}
const sections=[
  {id:"presentation",title:"Presentación",description:"Esta sección muestra título, descripción y foto principal."},
  {id:"dateAndPlace",title:"Fecha y lugar",description:"Esta sección muestra la fecha, hora y ubicación del evento."},
  {id:"rsvp",title:"Confirmación",description:"Esta sección permite la confirmación de asistencia de tus invitados."},
  {id:"gallery",title:"Galería",description:"Esta sección muestra una galería de fotos sobre el evento."},
  {id:"messages",title:"Mensajes",description:"Esta sección permite que los invitados dejen mensajes y verlos."},
  {id:"closingMessage",title:"Mensaje de cierre",description:"Esta sección muestra el mensaje final de la página."},
];
export default function Tutorial({tutorialStep,onStepChange,onPreview,onFinish,onSectionTourChange,preview,markerEditorOpen}:TutorialProps){
  const [welcomeStep,setWelcomeStep]=useState(0);
  const [sectionIndex,setSectionIndex]=useState(0);
  const [configurationIntro,setConfigurationIntro]=useState(false);
  const [tutorialCompleted,setTutorialCompleted]=useState(false);


  console.log("### TUTORIAL RENDER", {
  tutorialStep,
  welcomeStep,
  sectionIndex,
  configurationIntro,
  tutorialCompleted,
  timestamp:Date.now(),
});


  //const current=tutorialStep===null?null:tutorialSteps[tutorialStep];
  const current=tutorialStep===null||tutorialStep===undefined?null:tutorialSteps[tutorialStep];
  const previewScrollY=useRef(0);

  /*useEffect(()=>{
    if(!current||markerEditorOpen)
      return;
    const marker=document.querySelector(`[data-marker="${current.markerId}"]`);
    if(!marker)
      return;
    const rect=marker.getBoundingClientRect();
    const targetY=window.scrollY+rect.top-220;
    window.scrollTo({top:Math.max(targetY,0),behavior:"smooth"});
  },[tutorialStep,markerEditorOpen]);*/
  useEffect(()=>{
    if(!current) return;
    const marker=document.querySelector(`[data-marker="${current.markerId}"]`);
    const target= marker || document.getElementById(current.sectionId);
    if(!target) return;
    const rect=target.getBoundingClientRect();
    const targetY=window.scrollY+rect.top-220;
    window.scrollTo({ top:Math.max(targetY,0), behavior:"smooth", });
  },[tutorialStep]);
  
  function clearSectionFocus(){
    sections.forEach(section=>{
      const element=document.getElementById(section.id);
      if(!element)
        return;
      element.classList.remove("remark-section","normal-section");
    });
  }
  function startSectionTour(){
    setConfigurationIntro(false);
    setWelcomeStep(1);
    setSectionIndex(0);
    onSectionTourChange(true);
    focusSection(sections[0].id);
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function startTutorial(){
    console.log("### START TUTORIAL");
    clearSectionFocus();
    onSectionTourChange(false);
    setWelcomeStep(0);
    setConfigurationIntro(true);
    setTutorialCompleted(false);
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function startConfiguration(){
    setConfigurationIntro(false);
    setWelcomeStep(0);
    onSectionTourChange(false);
    onStepChange(0);
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function handleSectionNext(){
    if(sectionIndex===sections.length-1){
      startTutorial();
      return;
    }
    const nextIndex=sectionIndex+1;
    setSectionIndex(nextIndex);
    focusSection(sections[nextIndex].id);
  }
  function handlePrevious(){
    if(tutorialStep===null){
      return;
    }

    if(tutorialStep===0){
      setConfigurationIntro(true);
      onStepChange(null);
      window.scrollTo({top:0,behavior:"smooth"});
      return;
    }

    onStepChange(tutorialStep-1);
  }
  function handleConfigurationIntroPrevious(){
    setConfigurationIntro(false);
    setWelcomeStep(1);
    setSectionIndex(0);
    onStepChange(null);
    onSectionTourChange(true);
    focusSection(sections[0].id);
  }
  function handleNext(){
    if(tutorialStep===null)
      return;
    if(tutorialStep===tutorialSteps.length-1){
      showTutorialEnd();
      return;
    }
    onStepChange(tutorialStep+1);
  }
  function handleTutorialComplete(){
    clearSectionFocus();
    onSectionTourChange(false);
    setConfigurationIntro(false);
    onStepChange(null);
    setTutorialCompleted(false);
    onFinish();
  }
  function showTutorialEnd(){
    sections.forEach(section=>{
      const element=document.getElementById(section.id);
      if(!element)
        return;
      element.classList.remove("remark-section");
      element.classList.add("normal-section");
    });
    setTutorialCompleted(true);
  }
  function handleCancel(){
    clearSectionFocus();
    onSectionTourChange(false);
    setConfigurationIntro(false);
    onStepChange(null);
    onFinish();
  }
  function handlePreview(){
    previewScrollY.current=window.scrollY;
    clearSectionFocus();
    onPreview();
  }
  function handleReturnFromPreview(){
    onPreview();
    requestAnimationFrame(()=>{
      window.scrollTo({
        top:previewScrollY.current,
        behavior:"smooth",
      });
    });
  }
  function focusSection(sectionId:string){
    sections.forEach(section=>{
      const element=document.getElementById(section.id);
      if(!element)
        return;
      element.classList.toggle("remark-section",section.id===sectionId);
      element.classList.toggle("normal-section",section.id!==sectionId);
    });
    document.getElementById(sectionId)?.scrollIntoView({behavior:"smooth",block:"center"});
  }

  const tutorialVisibilityClass =
  markerEditorOpen 
    ? "opacity-0 pointer-events-none transition-opacity duration-900"
    : "opacity-100 transition-opacity duration-900";
  if(markerEditorOpen)
    return null;

  if(current===null&&welcomeStep===0 && !configurationIntro){
    return(
      <section className={`admin-card mb-3 sticky -mt-5 top-2 z-1000 px-4 py-3 ${tutorialVisibilityClass}`}>
        <div className="relative">
          <button type="button" aria-label="Cerrar tutorial" title="Cerrar tutorial" className="absolute right-0 top-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" onClick={handleCancel}>
            <X size={16}/>
          </button>
          <div className=" pr-6 text-sm leading-5 text-gray-800">
            <div className="font-semibold">¡Bienvenid@ al tutorial!</div> 
            <div className="mt-3 mb-3">Este tutorial te ayudará a configurar la página que compartirás con tus invitados.</div>
          </div>
          <p className="mt-2 text-sm leading-5 text-gray-600">
            A continuación vamos a mostrarte las diferentes secciones que tiene la página, para luego proceder a configurarlas.
          </p>
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" className="admin-button admin-button-medium flex-1 !py-1.5 !text-xs" onClick={startSectionTour}>
            Recorrer secciones
          </button>
          <button type="button" className="admin-button-secondary admin-button-medium !py-1.5 !text-xs" onClick={startTutorial}>
            Saltar
          </button>
        </div>
      </section>
    );
  }

  if(configurationIntro){
    console.log("### RENDERING CONFIGURATION INTRO");
    return(
      <section className={`admin-card mb-3 sticky -mt-5 top-2 z-1000 px-4 py-3 ${tutorialVisibilityClass}`}>
        <div className="relative">
          <button
            type="button"
            aria-label="Cerrar tutorial"
            title="Cerrar tutorial"
            className="absolute right-0 top-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            onClick={handleCancel}
          >
            <X size={16}/>
          </button>

          <div className="pr-6">
            <p className="text-sm font-semibold leading-5 text-gray-800">
              Configuración de tu página
            </p>

            <p className="mt-2 text-xs leading-4 text-gray-600">
              <b>Ahora</b> vamos a configurar cada uno de los elementos de la página.
              En cualquier momento del tutorial puedes presionar el botón <b>Vista previa</b> para ver como va quedando tu página. Presiona por favor el botón <b>Siguiente</b> para comenzar.
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            className="admin-button-secondary admin-button-xsmall !px-3 !py-1.5 !text-xs"
            onClick={handleConfigurationIntroPrevious}
          >
            Anterior
          </button>

          <button
            type="button"
            className="admin-button-secondary admin-button-xsmall !px-3 !py-1.5 !text-xs"
            onClick={handlePreview}
          >
            Vista previa
          </button>

          <button
            type="button"
            className="admin-button admin-button-xsmall !px-3 !py-1.5 !text-xs"
            onClick={startConfiguration}
          >
            Siguiente
          </button>
        </div>
      </section>
    );
  }

  if(current===null&&welcomeStep===1&&!configurationIntro){
    console.log("### RENDERING SECTION TOUR");
    const section=sections[sectionIndex];
    return(
      <section className={`admin-card mb-3 sticky -mt-5 top-2 z-1000 px-4 py-2.5 ${tutorialVisibilityClass}`}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-900">
            Sección {section.title}
          </h2>
          <div className="flex items-center gap-1.5">
            <button type="button" className="admin-button admin-button-xsmall !px-3 !py-1.5 !text-xs" onClick={handleSectionNext}>
              {sectionIndex===sections.length-1?"Continuar":"Siguiente"}
            </button>
            <button type="button" aria-label="Cerrar tutorial" title="Cerrar tutorial" className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" onClick={handleCancel}>
              <X size={16}/>
            </button>
          </div>
        </div>
        <p className="mt-1 text-xs leading-4 text-gray-600">
          {section.description}
        </p>
      </section>
    );
  }
  if(tutorialCompleted){
    return(
      <section className={`admin-card mb-3 sticky -mt-5 top-2 z-1000 px-4 py-3 ${tutorialVisibilityClass}`}>
        <div className="relative">
          <button type="button" aria-label="Cerrar tutorial" title="Cerrar tutorial" className="absolute right-0 top-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" onClick={handleTutorialComplete}>
            <X size={16}/>
          </button>
          <div className="pr-6">
            <p className="text-sm font-semibold leading-5 text-gray-800">¡Terminaste el tutorial!</p>
            <p className="mt-2 text-xs leading-4 text-gray-600">Ya conoces las secciones, elementos y cómo configurarlos. Puedes tocar cualquier botón de configuración para hacer nuevas modificaciones.</p>
            <p className="mt-2 text-xs leading-4 text-gray-600">Cuando termines, presiona <b>Siguiente</b> para continuar.</p>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button type="button" className="admin-button admin-button-xsmall !px-4 !py-1.5 !text-xs" onClick={handleTutorialComplete}>
            Cerrar
          </button>
        </div>
      </section>
    );
  }
  //console.log("## preview ", preview);

  if(preview){
    return(
      <section className={`admin-card mb-3 sticky -mt-5 top-2 z-1000 px-4 py-2 ${tutorialVisibilityClass}`}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-gray-600">Vista Previa</span>
          <button type="button" className="admin-button admin-button-xsmall !px-3 !py-1.5 !text-xs" onClick={handleReturnFromPreview}>
            Volver al tutorial
          </button>
        </div>
      </section>
    );
  }
  return(
    <section className={`admin-card mb-3 sticky -mt-5 top-2 z-1000 px-4 py-2.5 ${tutorialVisibilityClass}`}>
      
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs pad  text-gray-700 w-full bg-gray-100 rounded-lg pl-3 p-1 mb-1">
          Tutorial - Sección {current?.section}
        </div>
        
        <button type="button" aria-label="Cerrar tutorial" title="Cerrar tutorial" className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" onClick={handleCancel}>
          <X size={16}/>
        </button>
      </div>
      <p className="mt-1 text-xs leading-4 text-gray-700">
        <span className="font-semibold pl-3">{current?.step}: </span><span className="pl-1"> {current?.description}</span>
      </p>
      <p className="mt-2 text-xs text-center font-medium text-gray-400 mb-3">
        Toca el botón que salta, para editar el elemento.
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <button type="button" className="admin-button-secondary admin-button-xsmall !px-3 !py-1.5 !text-xs" onClick={handlePrevious}>
          Anterior
        </button>
        <button type="button" className="admin-button-secondary admin-button-xsmall !px-3 !py-1.5 !text-xs" onClick={handlePreview}>
          Vista previa
        </button>
        <button type="button" className="admin-button admin-button-xsmall !px-3 !py-1.5 !text-xs" onClick={handleNext}>
          {tutorialStep===tutorialSteps.length-1?"Finalizar":"Siguiente"}
        </button>
      </div>
    </section>
  );
}