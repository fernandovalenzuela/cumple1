"use client";

import { useEffect } from "react";
import { Countdown } from "./Countdown";
import PrivateRSVP from "./PrivateRSVP";
import OpenRSVP from "./OpenRSVP";
import Gallery from "./Gallery";
import { MessagesSection } from "./MessagesSection";
import { AnimationBackground } from "./AnimationBackground";
import EditMarker from "./../components/event-editor/EditMarker";
import AppearanceMarker from "@/components/event-editor/AppearanceMarker";
import RSVPMarker from "@/components/event-editor/RSVPMarker";
import MessagesMarker from "@/components/event-editor/MessagesMarker";
import { formatLongDate, getLocalTime, getDisplayAddress, getMapAddress } from "./../lib/utils";
import { AccessType, Status, APP_CONFIG } from "./../lib/constants";
import Image from "next/image";
import { fontMap, wixMadeforText } from "@/fonts";
import { getBackgroundMotiveInfo, APPEARANCE_FONTS, getDefaultAppearanceTemplate } from "@/lib/appearance";
import type { Event } from "@/lib/types";
import { useEventStore } from "@/store/eventStore";
import { tutorialSteps } from "@/components/onboarding/tutorial/tutorialSteps";
import { TypographyContext } from "./TypographyContext";

type Guest = {
  id: number;
  name: string;
  code: string;
  foodType: number;
  rsvpStatus: number;
  rsvpMessage?: string;
  birthdayEventId: number;
  peopleLimit: number;
  peopleConfirmed?: number;
};

type Props = {
  event: Event;
  guest: Guest | null;
  editable: boolean;
  tutorialStep?:number|null;
  sectionTourActive?:boolean;
  preview?:boolean;
  tutorialVisible?: boolean;
};

export function EventPageView({
  event:initialEvent,
  guest,
  editable,
  tutorialStep,
  sectionTourActive,
  preview,
  tutorialVisible
}:Props){

  const storeEvent = useEventStore(state => state.event);
  const applyDefaultAppearance = useEventStore(
    state => state.applyDefaultAppearance
  );

  const event = editable && storeEvent ? { ...storeEvent } : { ...initialEvent };

  if (editable && event.theme === null) {
    const defaultTemplate = getDefaultAppearanceTemplate(event.occasionType);
    event.theme = defaultTemplate.colorValue;
    event.fontType = defaultTemplate.fontValue;
    event.animationType = defaultTemplate.animationValue;
    event.backgroundMotive = defaultTemplate.backgroundValue;
  }
  //console.log("event.backgroundMotive",event.backgroundMotive);
  useEffect(() => {
    if (!editable || !storeEvent || storeEvent.theme !== null) {
      return;
    }

    const defaultTemplate = getDefaultAppearanceTemplate(
      storeEvent.occasionType
    );

    applyDefaultAppearance({
      theme: defaultTemplate.colorValue,
      fontType: defaultTemplate.fontValue,
      animationType: Number(defaultTemplate.animationValue),
      backgroundMotive: defaultTemplate.backgroundValue,
    });
  }, [
    editable,
    storeEvent,
    applyDefaultAppearance,
  ]);

  const fontKey=event.fontType?.trim();
  const fontConfig=APPEARANCE_FONTS.find(item=>item.value===fontKey)??APPEARANCE_FONTS[0];
  const userFont=fontMap[fontKey as keyof typeof fontMap]??wixMadeforText;
  const bodyFont=fontMap[fontConfig.bodyFontValue as keyof typeof fontMap]??wixMadeforText;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const userFontScale=isMobile ? fontConfig.mobileScale : fontConfig.desktopScale;
  const bodyFontScale=isMobile ?  fontConfig.bodyFontMobileScale : fontConfig.bodyFontDesktopScale;
  //console.log("isMobile",isMobile);

  const typography={  userFontClassName:userFont.className,  bodyFontClassName:bodyFont.className, userFontScale,  bodyFontScale};

  const themeClass = `theme-${event.theme}`;
  const backgroundMotive = getBackgroundMotiveInfo(event.backgroundMotive);
  //console.log("backgroundMotive",backgroundMotive);
  const visibleGallery = (event.gallery ?? []).filter( item => item.status !== "deleted");

  const tutorial=preview||tutorialStep===null||tutorialStep===undefined
  ?null :tutorialSteps[tutorialStep];

  const tutorialMarker=tutorial?.markerId??null;
  const tutorialSection=tutorial?.sectionId??null;
  const configurationStepActive =  !preview &&  tutorialVisible &&  tutorialStep !== null &&
  tutorialStep !== undefined;

  const tutorialClosed = !preview && tutorialVisible === false;
  const showAllMarkers = editable && tutorialClosed;
  const getTutorialStyles=(sectionName:string,currentSection:string|null,extraClasses:string="")=>{
    if(preview||tutorialStep===null||tutorialStep===undefined)
      return extraClasses;
    return `${currentSection===sectionName?"remark-section":"normal-section"} ${extraClasses}`.trim();
  };

  const shouldShowMarker = (markerId: string) => {
    if (!editable || preview) {
      return false;
    }

    // Tutorial cerrado: mostrar todos
    if (tutorialVisible === false) {
      return true;
    }

    // Tour de secciones o intro: no mostrar ninguno
    if (sectionTourActive || !configurationStepActive) {
      return false;
    }

    // Tutorial de configuración: solamente el marker actual
    return tutorialMarker === markerId;
  };

   return (
    <TypographyContext.Provider value={typography}>
    <div className={`w-full min-h-screen ${themeClass} bg-[var(--color-desktopbg-page)]`}>
    <main style={{"--user-font-scale":userFontScale,"--body-font-scale":bodyFontScale} as React.CSSProperties} className={`mx-auto w-full max-w-[800px] ${bodyFont.className} bg-[var(--color-bg-main)] text-[var(--color-text-main)]`}>

      {/* =========================
          HERO
      ========================= */}
      

      <section id="presentation" className={`
        section hero-gradient relative min-h-screen
        flex flex-col justify-start items-center
        overflow-hidden
        rounded-b-[28px]
        shadow-xs
        ${getTutorialStyles("presentation", tutorialSection)}
        `}>

        <AppearanceMarker
          markerId="marker-appearance"
          tutorialActive={tutorialMarker==="marker-appearance"}
          visible={shouldShowMarker("marker-appearance")}
          /*visible={editable}*/
          topClass="top-20"
          leftClass="left-6"
        />

        {/* 🎉 ANIMACION */}
        <div className="absolute inset-0 z-1 hero-animation">
          <AnimationBackground animationType={event.animationType} />
        </div>


        {/* ❤️ BACKGROUND */}
        {backgroundMotive?.url && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${backgroundMotive.url})`,
              backgroundSize: backgroundMotive.backgroundSize || "cover",
              backgroundRepeat: backgroundMotive.repeat,
              backgroundPosition: backgroundMotive.repeat === "repeat"
                ? "center"
                : `${backgroundMotive.positionX || "center"} ${backgroundMotive.positionY || "center"}`,
              opacity: backgroundMotive.opacity
            }}
          />
        )}
        {/* Invitación a ... */}
        <div className="group-div hero-invitation-margin z-10 ">  
          <EditMarker
            markerId="marker-title_2"
            tutorialActive={tutorialMarker==="marker-title_2"}
            field="title_2"
            value={event.title_2}
            title="Editar nombre"
            visible={shouldShowMarker("marker-title_2")}
           /*visible={editable}*/
            topClass="-top-4"
            liveUpdate={true}
            descriptionText="Frase de invitación"
          />

     
          <div 
           className="text-small animate-fade-in">
            {event.title_2}
          </div>
        </div>

        {/* nombre */}
        <div className="group-div mb-1">  
          <EditMarker
            markerId="marker-name"
            tutorialActive={tutorialMarker==="marker-name"}
            field="name"
            value={event.name}
            title="Editar nombre"
            visible={shouldShowMarker("marker-name")}
           /*visible={editable}*/
            topClass="top-3"
            liveUpdate={true}
            descriptionText="Nombre de la persona o del evento"
          />
          <div className={`font-user ${userFont.className} text-4xl font-bold py-3 z-10 animate-fade-in text-[var(--color-text-name)]`}>
            {event.name}
          </div>
        </div>

        {/* 🔥 HERO IMAGE MEJORADA */}
        <div className="group-div mt-1 z-10">  
          <EditMarker
            markerId="marker-picture"
            tutorialActive={tutorialMarker==="marker-picture"}
            field="picture"
            type="image"
            value={event.picture}
            title="Editar foto"
            visible={shouldShowMarker("marker-picture")}
            /*visible={editable}*/
            topClass="top-07"
            liveUpdate={false}
            descriptionText="Imagen principal"
            descriptionExtraText="(las imágenes cuadradas o centradas se ven mejor)"
          />
          <Image
            src={event.picture}
            alt={event.name}
            width={320}
            height={320}
            priority
            className="
              w-[260px]
              h-[260px]
              md:w-[320px]
              md:h-[320px]
              object-contain
              rounded-full
              bg-[var(--color-bg-soft)]
              shadow-xl
              mb-1
              border-4
              border-[var(--color-bg-main)]
              z-10
              animate-fade-in"
          />
        </div>

        {/* titulo */}
        <div className="z-10 text-center animate-fade-in mt-4">
          <div className="group-div">  
            <EditMarker
              markerId="marker-title_1"
              field="title_1"
              value={event.title_1}
              
              tutorialActive={tutorialMarker==="marker-title_1"}
              title="Editar título"
              visible={shouldShowMarker("marker-title_1")}
              /*visible={editable}*/
              topClass="-top-1"
              /*type="editable-select"
              options={[
                "Llegaron mis 30!",
                "Celebremos juntos este gran día",
                "Una noche inolvidable",
                "Mi cumpleaños está por llegar",
              ]}*/
              liveUpdate={true}
              descriptionText="Título principal"
            />
            <div className={`font-user ${userFont.className} text-[var(--color-text-main)] text-2xl font-light pb-1`}>
              {event.title_1}
            </div>
          </div>

          {/* descripcion */}
          <div className="group-div">
            <EditMarker
              markerId="marker-subtitle_1"
              tutorialActive={tutorialMarker==="marker-subtitle_1"}
              field="subtitle_1"
              value={event.subtitle_1}
              type="textarea"
              title="Editar descripción"
              visible={shouldShowMarker("marker-subtitle_1")}
              /*visible={editable}*/
              topClass="-top-4"
              /*type="editable-select"
              options={[
                "Frase para subtitulo 1",
                "Frase para subtitulo 2",
                "Frase para subtitulo 3",
                "Frase para subtitulo 4",
              ]}*/
              liveUpdate={true}
              descriptionText="Descripción"
            />
            <div className="mt-4 text-[var(--color-text-soft)] text-lg max-w-md pt-4 section-hero-card">
              {event.subtitle_1}
            </div>
          </div>  

          {/* countdown */}
          <div style={{ marginTop: "2rem" }} className="group-div -mt-15">      
            {/*<EditMarker
              markerId="marker-eventBirthday-countdown"
              topClass="-top-7"   field="eventBirthday"
              value={event.eventBirthday}
              title="Editar fecha"
              tutorialActive={tutorialMarker==="marker-eventBirthday-countdown"}
              visible={editable && configurationStepActive && !sectionTourActive && (tutorialMarker==="marker-eventBirthday-countdown" )}
              type="datetime"
              liveUpdate={false}
              descriptionText="Fecha del evento"
            />*/}
            <Countdown targetDate={event.eventBirthday} />
          </div>
        </div>
       
      </section>

      {/* =========================
          INFO
      ========================= */}
      <section
        id="dateAndPlace"
        className={`section section-soft min-h-screen -mt-10 pt-16 ${getTutorialStyles("dateAndPlace", tutorialSection)}`}
      >
        <div className="space-y-12">

          <div className="animate-fade-in">
            <h2 className={`font-user ${userFont.className} title-section title-mb-md mt-10`}>Cuándo?</h2>
            <div className="group-div">  
              <EditMarker
                markerId="marker-eventBirthday-info"
                field="eventBirthday"
                value={event.eventBirthday}
                title="Editar fecha"
                tutorialActive={tutorialMarker==="marker-eventBirthday-info"}
                visible={shouldShowMarker("marker-eventBirthday-info")}
                /*visible={editable}*/
                type="datetime"
                topClass="-top-7"
                liveUpdate={false}
                descriptionText="Fecha del evento"
              />
              <p className="subtitle-section subtitle-mb-interline"> {formatLongDate(event.eventBirthday)}</p>
              <p className="subtitle-section text-soft">🕒 {getLocalTime(event.eventBirthday, false)} hs</p>
            </div>
          </div>

          <div className="animate-fade-in">
            <h2 className={`font-user ${userFont.className} title-section title-mb-md -mt-4`}>
              Dónde?
            </h2>

            {/*<div className="group-div">  
              <EditMarker
                markerId="marker-locationName"
                field="locationName"
                value={event.locationName}
                title="Editar lugar"
                tutorialActive={tutorialMarker==="marker-locationName"}
                visible={editable && !sectionTourActive &&  (tutorialMarker===undefined || tutorialMarker===null || tutorialMarker==="marker-locationName" )}
                topClass="-top-6"
                liveUpdate={true}
                descriptionText="Nombre del lugar del evento"
              />
              <div className="subtitle-section subtitle-mb-interline  !text-xl "> {event.locationName}</div>
            </div> */}

            <div className="group-div">  
              <EditMarker
                markerId="marker-locationAddress"
                tutorialActive={tutorialMarker==="marker-locationAddress"}
                field="locationAddress"
                value={(event.locationAddress? event.locationAddress : "")}
                title="Editar dirección"
                type="address"
                visible={shouldShowMarker("marker-locationAddress")}
                /*visible={editable}*/
                topClass="top-4"
                liveUpdate={false}
                descriptionText="Dirección completa del evento"
                descriptionExtraText="(para ubicarla en el mapa)"
              />
              <p className="subtitle-section pb-8">{getDisplayAddress(event.locationAddress)}</p>
            </div>

            {/* 🔥 LOCATIONPICTURE RESPONSIVE */}
              <EditMarker
                markerId="marker-locationPicture"
                tutorialActive={tutorialMarker==="marker-locationPicture"}
                field="locationPicture"
                type="image"
                value={event.locationPicture}
                title="Editar foto"
                visible={shouldShowMarker("marker-locationPicture")}
                /*visible={editable}*/
                topClass="top-50"
                liveUpdate={false}
                descriptionText="Imagen del lugar del evento"
                descriptionExtraText="(una imagen rectangular se verá mejor)"
              />
              <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg border-8 border-[var(--color-bg-main)] mb-0">
                <Image
                  src={event.locationPicture}
                  alt="Salon"
                  width={1200}
                  height={800}
                  className="w-full h-[160px] md:h-[250px] object-cover"
                />
              </div>
              {event.locationAddress && (
                <>
                  <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg pt-4">
                    <iframe
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        getMapAddress(event.locationAddress)
                      )}&output=embed`}
                      className="w-full h-[150px] border-0"
                      loading="lazy"
                    />
                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${encodeURIComponent(
                      getMapAddress(event.locationAddress)
                    )}`}
                    target="_blank"
                    className="main-button mt-6 inline-block"
                  >
                    Cómo llegar
                  </a>
                </>
              )}
          </div>
        </div>
      </section>

      {/* =========================
          RSVP
      ========================= */}
      <div
        id="rsvp"
        className={`mb-1
          ${getTutorialStyles("rsvp", tutorialSection, "group-div")}
        `}
      >
      
        <RSVPMarker
          markerId="marker-rsvp"
          /*visible={editable && configurationStepActive && !sectionTourActive && (tutorialMarker==="marker-rsvp" )}*/
          visible={shouldShowMarker("marker-rsvp")}
          tutorialActive={tutorialMarker==="marker-rsvp"}
          topClass="top-9"
          leftClass="left-6"
        />  
    
        {((event.accessType===AccessType.Private || event.accessType===AccessType.PrivateWithPublicReadonly) && guest) && (
          <section className="section animate-fade-in">
            
            <h2 className={`font-user ${userFont.className} title2-section`}>
              Hola {guest.name}, confirma tu asistencia
            </h2>

            <PrivateRSVP guest={guest} askFoodType={event.askFoodType} previewMode={event.status! < Status.Published} />
          </section>
        )}

        {(event.accessType===AccessType.Open) && (
          <section className="section animate-fade-in">
            <h2 className={`font-user ${userFont.className} title-section title-mb-md`}>
              Vas a asistir?
            </h2>

            <OpenRSVP
              eventId={event.eventId}
              maxPeople={event.personMaxGuestOpenEvent}
              askFoodType={event.askFoodType}
              previewMode={event.status! < Status.Published}
            />
          </section>
        )}

      </div>

       {/* =========================
          GALERIA
      ========================= */}
      {((event.gallery && (visibleGallery.length > 0 || (event.status! < Status.Published)) && !editable)
      || (editable) ) && (

      <section id="gallery" className={`
        section section-soft text-[var(--color-text-gallery)] animate-fade-in
        ${getTutorialStyles("gallery", tutorialSection)}
        `}>
          <EditMarker
            markerId="marker-galleryTitle"
            tutorialActive={tutorialMarker==="marker-galleryTitle"}
            field="galleryTitle"
            value={event.galleryTitle}
            title="Editar título galería"
            visible={shouldShowMarker("marker-galleryTitle")}
            /*visible={editable}*/
            topClass="top-10"
            liveUpdate={true}
            descriptionText="Título de la galería"
          />
         <h2 className={`font-user ${userFont.className} title2-section title-mb-md !mb-6`}>
          {event.galleryTitle}
        </h2>

        <EditMarker
            markerId="marker-gallery"
            tutorialActive={tutorialMarker==="marker-gallery"}
            type="gallery"
            field="gallery"
            icon="image"
            value={event.gallery ?? []}
            title="Editor de Galería"
            visible={shouldShowMarker("marker-gallery")}
            /*visible={editable}*/
            topClass="top-28"
            liveUpdate={true}
            descriptionText="Galería de fotos"
          />
        <Gallery items={visibleGallery} editing={editable} />
      </section>
      )}


      {/* =========================
          MENSAJES
      ========================= */}
      
      {(event.allowMessages || (editable)) && (
      <section id="messages"
      className={`mb-1
          ${getTutorialStyles("messages", tutorialSection, "group-div")}
        `}>  

      <MessagesMarker
          markerId="marker-messages"
          /*visible={editable && configurationStepActive && !sectionTourActive && (tutorialMarker==="marker-messages" )}*/
          visible={shouldShowMarker("marker-messages")}
          tutorialActive={tutorialMarker==="marker-messages"}
          topClass="top-9"
          leftClass="left-6"
        />  
      {/* Private */}
      {(event.accessType === AccessType.Private || event.accessType === AccessType.PrivateWithPublicReadonly) &&
        guest && (
          <section className="section animate-fade-in">
            <h2 className="title2-section title-mb-md !mt-4">
              Dejame un mensaje 💬
            </h2>

            <MessagesSection
              mode="private"
              birthdayEventId={guest.birthdayEventId}
              guest={guest}
              allowMessages={event.allowMessages}
              showMessagesList  ={event.showMessagesList}
            />
          </section>
      )}

      {/* Open */}
      {event.accessType === AccessType.Open && (
        /*<section className="section animate-fade-in border-t-1 border-gray-200 ">*/
        <section className="section animate-fade-in border-t-1 border-[var(--color-border)]">
          <h2 className={`font-user ${userFont.className} title2-section title-mb-md  !mt-4`}>
            Mensajes 💬
          </h2>

          <MessagesSection
            mode="open"
            birthdayEventId={event.eventId}
            allowMessages={event.allowMessages}
            showMessagesList={event.showMessagesList}
          />
        </section>
      )}
     

      {/* PublicWithoutGuests */}
      {event.accessType === AccessType.PublicWithoutGuests && (
        <section className="section animate-fade-in">
          <h2 className="title2-section title-mb-md  !mt-4">
            Mensajes 💬
          </h2>

          <MessagesSection
            mode="public"
            birthdayEventId={event.eventId}
            allowMessages={event.allowMessages}
            showMessagesList={event.showMessagesList}
          />
        </section>
      )}
      </section>
      )}

      
      

      {/* =========================
          FOOTER
      ========================= */}
      <section
        id="closingMessage"
        className={`section flex flex-col items-center justify-center !h-60 text-[var(--color-text-on-primary)] animate-fade-in mt-4 ${getTutorialStyles("closingMessage", tutorialSection)}`}
        style={{ background: "var(--color-primary)" }}
      >
        
        <EditMarker
            markerId="marker-subtitle_2"
            tutorialActive={tutorialMarker==="marker-subtitle_2"}
            field="subtitle_2"
            value={event.subtitle_2}
            title="Editar Footer"
            visible={shouldShowMarker("marker-subtitle_2")}
            /*visible={editable}*/
            topClass="top-3"
            liveUpdate={true}
            descriptionText="Frase de cierre"
          />
        <h2 className={`font-user ${userFont.className} text-xl font-semibold`}>
          {event.subtitle_2}
        </h2>

        <div className="text-[10px] mt-4">Copyright 2026 @ {APP_CONFIG.name}</div>
        {/*event.customerComment && (
          <p className="mt-4 text-sm opacity-80">
            {event.customerComment}
          </p>
        )*/}
      </section>

    </main>
    </div>
    </TypographyContext.Provider>
  );
}