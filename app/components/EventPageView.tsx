"use client";

import { Countdown } from "./Countdown";
import PrivateRSVP from "./PrivateRSVP";
import OpenRSVP from "./OpenRSVP";
import Gallery from "./Gallery";
import { MessagesSection } from "./MessagesSection";
import { AnimationBackground } from "./AnimationBackground";
import EditMarker from "./../components/event-editor/EditMarker";
import AppearanceMarker from "@/components/event-editor/AppearanceMarker";
import RSVPMarker from "@/components/event-editor/RSVPMarker";
import { formatLongDate, getLocalTime, getDisplayAddress, getMapAddress } from "./../lib/utils";
import { AccessType, Status } from "./../lib/constants";
import Image from "next/image";
import { fontMap, wixMadeforText } from "@/fonts";
import { getBackgroundMotiveProps } from "@/lib/appearance";
import type { Event } from "@/lib/types";
import { useEventStore } from "@/store/eventStore";

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
};

export function EventPageView({
  event:initialEvent,
  guest,
  editable
}:Props){

  const storeEvent = useEventStore(state => state.event);
  const event = editable && storeEvent ? storeEvent : initialEvent;
  event.accessType ??= AccessType.Open;
  const fontKey = event.fontType?.trim();
  const font = fontMap[fontKey as keyof typeof fontMap] || wixMadeforText;
  const themeClass = `theme-${event.theme ?? "elegant"}`;
  const backgroundMotive = getBackgroundMotiveProps(event.backgroundMotive ?? "heart");

  const visibleGallery = (event.gallery ?? []).filter( item => item.status !== "deleted");


   return (
    <main className={`${themeClass} ${font.className} bg-white text-gray-800`}>

      {/* =========================
          HERO
      ========================= */}
      

      <section className="
        section hero-gradient relative min-h-screen
        flex flex-col justify-center items-center
        overflow-hidden
        rounded-b-[28px]
        shadow-xs
      ">

        <AppearanceMarker
          visible={editable}
          topClass="top-20"
          leftClass="left-6"
        />

        {/* 🎉 ANIMACION */}
        <div className="absolute inset-0 z-0 hero-animation">
          <AnimationBackground animationType={event.animationType} />
        </div>



        {/* ❤️ BACKGROUND */}
        {backgroundMotive?.url && (
          <div
            className="absolute inset-0 bg-center opacity-5"
            style={{
              backgroundImage: `url(${backgroundMotive.url})`,
              backgroundSize:
                backgroundMotive.backgroundSize ||
                "cover",
            }}
          />
        )}
        <div className="group-div">  
          <EditMarker
            markerId="marker-name"
            field="name"
            value={event.name}
            title="Editar nombre"
            visible={editable}
            topClass="top-3"
            liveUpdate={true}
            descriptionText="Nombre de la persona o del evento"
          />
          <div className="text-5xl font-bold py-8 z-10 animate-fade-in">
            {event.name}
          </div>
        </div>

        {/* 🔥 HERO IMAGE MEJORADA */}
        <div className="group-div">  
          <EditMarker
            markerId="marker-picture"
            field="picture"
            type="image"
            value={event.picture}
            title="Editar foto"
            visible={editable}
            topClass="top-07"
            liveUpdate={false}
            descriptionText="Las imágenes cuadradas o centradas se ven mejor"
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
              mb-6

              border-4
              border-white

              z-10
              animate-fade-in
            "
          />
        </div>

        <div className="z-10 text-center animate-fade-in">
          <div className="group-div">  
            <EditMarker
              markerId="marker-title_1"
              field="title_1"
              value={event.title_1}
              type="editable-select"
              title="Editar título"
              visible={editable}
              topClass="top-4"
              options={[
                "Llegaron mis 30!",
                "Celebremos juntos este gran día",
                "Una noche inolvidable",
                "Mi cumpleaños está por llegar",
              ]}
              liveUpdate={true}
              descriptionText="Título principal"
            />
            <div className="text-4xl font-light pt-8">
              {event.title_1}
            </div>
          </div>

          <div className="group-div">  
            <EditMarker
              markerId="marker-subtitle_1"
              field="subtitle_1"
              value={event.subtitle_1}
              type="editable-select"
              title="Editar subtítulo"
              visible={editable}
              topClass="-top-4"
              options={[
                "Frase para subtitulo 1",
                "Frase para subtitulo 2",
                "Frase para subtitulo 3",
                "Frase para subtitulo 4",
              ]}
              liveUpdate={true}
              descriptionText="Subtítulo"
            />
            <p className="mt-2 text-2xl text-soft max-w-md pb-18">
              {event.subtitle_1}
            </p>
          </div>  

          <div className="group-div">      
            <EditMarker
              markerId="marker-eventBirthday-countdown"
              field="eventBirthday"
              value={event.eventBirthday}
              title="Editar fecha"
              visible={editable}
              type="datetime"
              topClass="-top-7"
              liveUpdate={false}
              descriptionText="Fecha del evento"
            />
            <Countdown targetDate={event.eventBirthday} />
          </div>
        </div>
       
      </section>

      {/* =========================
          INFO
      ========================= */}
      <section className="section section-soft -mt-10 pt-16">
        <div className="space-y-12">

          <div className="animate-fade-in">
            <h2 className="title-section title-mb-md mt-15">¿Cuándo?</h2>
            <div className="group-div">  
              <EditMarker
                markerId="marker-eventBirthday-info"
                field="eventBirthday"
                value={event.eventBirthday}
                title="Editar fecha"
                visible={editable}
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
            <h2 className="title-section title-mb-md">
              ¿Dónde te espero?
            </h2>

            <div className="group-div">  
              <EditMarker
                markerId="marker-locationName"
                field="locationName"
                value={event.locationName}
                title="Editar lugar"
                visible={editable}
                topClass="-top-6"
                liveUpdate={true}
                descriptionText="Nombre del lugar del evento"
              />
              <div className="subtitle-section subtitle-mb-interline  !text-xl "> {event.locationName}</div>
            </div>

            <div className="group-div">  
              <EditMarker
                markerId="marker-locationAddress"
                field="locationAddress"
                value={(event.locationAddress? event.locationAddress : "")}
                title="Editar dirección"
                type="address"
                visible={editable}
                topClass="top-4"
                liveUpdate={false}
                descriptionText="Dirección completa del evento (para ubicación en el mapa)"
              />
              <p className="subtitle-section pb-8 !text-gray-500">{getDisplayAddress(event.locationAddress)}</p>
            </div>

            {/* 🔥 LOCATIONPICTURE RESPONSIVE */}
              <EditMarker
                markerId="marker-locationPicture"
                field="locationPicture"
                type="image"
                value={event.locationPicture}
                title="Editar foto"
                visible={editable}
                topClass="top-50"
                liveUpdate={false}
                descriptionText="Imagen del lugar del evento. Una imagen rectangular se verá mejor."
              />
              <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg border-8 border-white mb-4">
                <Image
                  src={event.locationPicture}
                  alt="Salon"
                  width={1200}
                  height={800}
                  className="w-full h-[260px] md:h-[340px] object-cover"
                />
            </div>
              {event.locationAddress && (
              <>
              (<div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg pt-4">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    getMapAddress(event.locationAddress)
                  )}&output=embed`}
                  className="w-full h-[300px] border-0"
                  loading="lazy"
                />
              </div>

              <a
                href={`https://www.google.com/maps?q=${encodeURIComponent(
                  getMapAddress(event.locationAddress)
                )}`}
                target="_blank"
                className="main-button mt-10 inline-block"
              >
                Cómo llegar
              </a>)
              </>)}
          </div>
        </div>
      </section>

      {/* =========================
          RSVP
      ========================= */}
      <div className="group-div">
      
      <RSVPMarker
        visible={editable}
        topClass="top-9"
        leftClass="left-6"
      />  
   
      {((event.accessType===AccessType.Private || event.accessType===AccessType.PrivateWithPublicReadonly) && guest) && (
        <section className="section animate-fade-in">
          
          <h2 className="title2-section ">
            Hola {guest.name}, confirma tu asistencia
          </h2>

          <PrivateRSVP guest={guest} askFoodType={event.askFoodType} previewMode={event.status! < Status.Published} />
        </section>
      )}

      {(event.accessType===AccessType.Open) && (
        <section className="section animate-fade-in">
          <h2 className="title-section title-mb-md">
            Confirmar asistencia
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
      {((event.gallery && visibleGallery.length > 0 && !editable)
      || (editable) ) && (

      <section className="section section-soft text-white animate-fade-in">
          <EditMarker
            markerId="marker-gallerytitle"
            field="galleryTitle"
            value={event.galleryTitle}
            title="Editar título galería"
            visible={editable}
            topClass="top-10"
            liveUpdate={true}
            descriptionText="Título de la galería"
          />
         <h2 className="title2-section title-mb-md">
          {event.galleryTitle}
        </h2>

        <EditMarker
            markerId="marker-gallery"
            type="gallery"
            field="gallery"
            icon="image"
            value={event.gallery ?? []}
            title="Editor de Galería"
            visible={editable}
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
      {/* Private */}
      {(event.accessType === AccessType.Private || event.accessType === AccessType.PrivateWithPublicReadonly)  && event.allowMessages &&
        guest && (
          <section className="section animate-fade-in">
            <h2 className="title2-section title-mb-md">
              Dejame un mensaje 💬
            </h2>

            <MessagesSection
              mode="private"
              birthdayEventId={guest.birthdayEventId}
              guest={guest}
              allowMessages={event.allowMessages}
              showMessagesList={event.showMessagesList}
            />
          </section>
      )}

      {/* Open */}
      {event.accessType === AccessType.Open && event.allowMessages && (
        <section className="section animate-fade-in">
          <h2 className="title2-section title-mb-md">
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
      {event.accessType === AccessType.PublicWithoutGuests  && event.allowMessages && (
        <section className="section animate-fade-in">
          <h2 className="title2-section title-mb-md">
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

      {/* =========================
          FOOTER
      ========================= */}
      <section
        className="section text-white animate-fade-in"
        style={{ background: "var(--color-primary)" }}
      >
        
        <EditMarker
            markerId="marker-subtitle_2"
            field="subtitle_2"
            value={event.subtitle_2}
            title="Editar Footer"
            visible={editable}
            topClass="top-3"
            liveUpdate={true}
            descriptionText="Frase de cierre"
          />
        <h2 className="text-xl font-semibold">
          {event.subtitle_2}
        </h2>

        {/*event.customerComment && (
          <p className="mt-4 text-sm opacity-80">
            {event.customerComment}
          </p>
        )*/}
      </section>

    </main>
  );
}