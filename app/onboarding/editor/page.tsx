import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { getCurrentSession, SessionType } from "@/lib/auth/session";
//import { getBackgroundMotiveProps } from "@/lib/appearance";
import { getBackgroundMotiveInfo } from "@/lib/appearance";
import { AccessType } from "@/lib/constants";
import OnboardingEditor from "@/components/onboarding/OnboardingEditor";
import { Event } from "@/lib/types";
import { getDefaultCountry } from "@/lib/countries";

export default async function Page(){

  const session=await getCurrentSession();
  //console.log("# SESSION",session);

  if(
    !session||
    session.type!==SessionType.Organizer||
    !session.eventId
  ){
    redirect("/onboarding");
  }

  const data=await sql`
    SELECT
      b.id,
      b.status,
      b.name,
      b.title_1,
      b.title_2,
      b.subtitle_1,
      b.subtitle_2,
      b."eventBirthday",
      b."locationName",
      b."locationAddress",
      b.picture,
      b."locationPicture",
      b."allowMessages",
      b."showMessagesList",
      b.theme,
      b."animationType",
      b."fontType",
      b."customerComment",
      b."backgroundMotive",
      b."personMaxGuestOpenEvent",
      b."askFoodType",
      b."galleryTitle",
      b."accessType",
      b."rsvpDeadline",
      b."maxGuests",
      b."planId",
      b."eventExpiresAt",
      b."occasionType"
    FROM "birthdayEvents" b
    WHERE b.id=${session.eventId}
      AND b."isActive"=true
  `;

  const row=data[0];

  if(!row){
    redirect("/onboarding");
  }

  const galleryData=await sql`
    SELECT
      id,
      picture,
      thumbnail,
      description
    FROM "birthdayGallery"
    WHERE "birthdayEventId"=${row.id}
      AND "isActive"=true
    ORDER BY position ASC,id ASC
  `;

  const gallery=galleryData.map((g, index)=>({
    id:g.id,
    picture:g.picture?.startsWith("/")?g.picture:`/${g.picture}`,
    slot:index+1,
    thumbnail:g.thumbnail
      ?g.thumbnail.startsWith("/")
        ?g.thumbnail
        :`/${g.thumbnail}`
      :undefined,
    description:g.description,
  }));

  const country = getDefaultCountry();
  //console.log("country", country);
  const planData=await sql`
    SELECT
      "planMaxGuests"
    FROM "birthdayPlans" p
    WHERE 
        p.active = true
        and p.country = ${country}
    ORDER BY p.id DESC
  `;

  const planRow=planData[0];

  if(!planRow || !planRow.planMaxGuests ){
    //throw new Error("No hay plan");
    redirect("/onboarding");
  } 

  const planMaxGuests = planRow.planMaxGuests;

  const event: Event ={
    eventId:row.id,
    occasionType:row.occasionType,
    status:row.status,
    name:row.name,
    title_1:row.title_1,
    title_2:row.title_2,
    accessType:row.accessType,
    subtitle_1:row.subtitle_1,
    subtitle_2:row.subtitle_2,
    eventBirthday:row.eventBirthday,
    locationName:row.locationName,
    locationAddress:row.locationAddress,
    picture:row.picture?.startsWith("/")
      ?row.picture
      :`/${row.picture}`,
    locationPicture:row.locationPicture?.startsWith("/")
      ?row.locationPicture
      :`/${row.locationPicture}`,
    allowMessages:row.allowMessages,
    showMessagesList:row.showMessagesList,
    theme:row.theme,
    animationType:row.animationType,
    fontType:row.fontType||"Poppins",
    customerComment:row.customerComment,
    backgroundMotive:(row.backgroundMotive),
    personMaxGuestOpenEvent:row.personMaxGuestOpenEvent,
    askFoodType:row.askFoodType,
    gallery,
    galleryTitle:row.galleryTitle,
    rsvpDeadline:row.rsvpDeadline,
    maxGuests:row.maxGuests,
    planMaxGuests:planMaxGuests,
    planId:row.planId,
    eventExpiresAt:row.eventExpiresAt,
  };

  async function handleNext(){
    "use server";
    redirect("/onboarding/payment");
  }

  return(
    <OnboardingEditor
      event={event}
      guest={null}
      accessType={event.accessType??AccessType.Open}
      currentStep={3}
      totalSteps={5}
      nextLabel="Siguiente"
      loading={false}
      nextDisabled={false}
      onNext={handleNext}
    />
  );

}