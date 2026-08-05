"use server";

import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { getCurrentSession,SessionType } from "@/lib/auth/session";
import type { SaveEventData } from "@/lib/types";
import { processImage,getEventImagePath,getEventThumbnailPath,deleteImage } from "@/lib/images/imagePipeline";
import { getBackgroundMotiveNameByUrl } from "@/lib/appearance";
import { getRsvpDeadlineFromEventBirthday } from "@/lib/utils";


function getGalleryPaths(
    eventId: number,
    galleryId: number,
    ) {
    const imageName = `gallery_${galleryId}`;
    return {
        imageName,
        imagePath: getEventImagePath(
        eventId,
        imageName,
        ),
        thumbnailPath: getEventThumbnailPath(
        eventId,
        imageName,
        ),
        publicPath:
        `/events/${eventId}/${imageName}.webp`,
        publicThumbnailPath:
        `/events/${eventId}/thumbs/${imageName}.webp`,
    };
}

export async function saveEvent(
  data:SaveEventData
){
//console.log("SERVER editor.actions #1");
  const session=await getCurrentSession();
//console.log("SERVER editor.actions #2, accountid: ", session?.accountId);
  if(!session|| session.type!==SessionType.Organizer|| !session.eventId){
    redirect("/onboarding");
  }
  //console.log("SERVER editor.actions #3, eventId: ", session?.eventId);
  const event=data.event;

  if(!event)
    throw new Error("Evento inválido.");

  const theme=event.theme??null;
  const fontType=event.fontType??null;
  const subtitle_2=event.subtitle_2??null;
  const locationAddress=event.locationAddress??null;
  const customerComment=event.customerComment??null;
  const backgroundMotive=getBackgroundMotiveNameByUrl(event.backgroundMotive.url??null);
  let  rsvpDeadline=event.rsvpDeadline;
  if (!event.rsvpDeadline) {
    rsvpDeadline = getRsvpDeadlineFromEventBirthday(event.eventBirthday);
  }

  const eventId=session.eventId;

/*console.log("params:" + event.name +"," + event.title_1 + "," + event.subtitle_1
    + "," + subtitle_2 + "," + event.eventBirthday + "," + event.locationName + "," + event.locationAddress + "," + event.theme + "," + event.animationType
    + "," + fontType + "," + event.allowMessages + "," + event.showMessagesList 
    + "," + backgroundMotive + "," + event.personMaxGuestOpenEvent + "," + event.askFoodType + "," + event.galleryTitle + "," + customerComment  + 
    + ",$$ " + event.maxGuests + "," + "rsvpDeadlineOrig:" + event.rsvpDeadline  + ",rsvpDeadline2:" + rsvpDeadline + "," + event.accessType +
    "#FIN");*/

  try{

    await sql.begin(async(sql)=>{

        await sql`
        update "birthdayEvents"
        set
            name=${event.name},
            title_1=${event.title_1},
            subtitle_1=${event.subtitle_1},
            subtitle_2=${subtitle_2},
            "eventBirthday"=${event.eventBirthday},
            "accessType"=${event.accessType},
            "locationName"=${event.locationName},
            "locationAddress"=${locationAddress},
            theme=${theme},
            "animationType"=${event.animationType},
            "fontType"=${fontType},
            "allowMessages"=${event.allowMessages},
            "showMessagesList"=${event.showMessagesList},
            "backgroundMotive"=${backgroundMotive},
            "personMaxGuestOpenEvent"=${event.personMaxGuestOpenEvent},
            "maxGuests"=${event.maxGuests},
            "askFoodType"=${event.askFoodType},
            "galleryTitle"=${event.galleryTitle},
            "rsvpDeadline"=${rsvpDeadline},
            "customerComment"=${customerComment}
        where id=${eventId}
        `;

        for(const [field,file] of Object.entries(data.pendingFiles)){
            const imagePath=getEventImagePath(eventId, field,);
            await processImage(file,imagePath,);
            const publicPath=`/events/${eventId}/${field}.webp`;
            if(field==="picture"){
                await sql`
                    update "birthdayEvents"
                    set picture=${publicPath}
                    where id=${eventId}
                `;
                }
                else if(field==="locationPicture"){

                await sql`
                    update "birthdayEvents"
                    set "locationPicture"=${publicPath}
                    where id=${eventId}
                `;

                }

        }

        for(const item of event.gallery??[]){

            switch(item.status){

                case "new": {

                    const sequence = await sql`
                        select nextval(
                            pg_get_serial_sequence('"birthdayGallery"', 'id')
                        ) as id
                    `;

                    const galleryId = Number(sequence[0].id);

                    const paths = getGalleryPaths(eventId,galleryId,);

                    const file =
                        data.pendingGalleryFiles[
                            `gallery${item.slot}`
                        ];

                    if(file){

                        await processImage(
                            file,
                            paths.imagePath,
                            paths.thumbnailPath
                        );

                    }

                    await sql`
                        insert into "birthdayGallery"
                        (
                            id,
                            "birthdayEventId",
                            picture,
                            thumbnail,
                            description,
                            position
                        )
                        values
                        (
                            ${galleryId},
                            ${eventId},
                            ${paths.publicPath},
                            ${paths.publicThumbnailPath},
                            ${item.description ?? null},
                            ${item.slot}
                        )
                    `;

                    break;
                }

                case "updated":{
                    const paths = getGalleryPaths(eventId,item.id,);
                    const file=data.pendingGalleryFiles[`gallery${item.slot}`];
                    if(file){
                        await processImage(file, paths.imagePath, paths.thumbnailPath,);

                    }
                    await sql`
                        update "birthdayGallery"
                        set
                        picture=${paths.publicPath},
                        thumbnail=${paths.publicThumbnailPath},
                        description=${item.description??null},
                        position=${item.slot}
                        where id=${item.id}
                    `;
                    break;
                }

                case "deleted":{
                    const paths = getGalleryPaths(eventId,item.id,);
                    await deleteImage(paths.imagePath,paths.thumbnailPath,);    
                    await sql`
                        delete
                        from "birthdayGallery"
                        where id=${item.id}
                    `;
                    break;
                }

                case "unchanged":{
                    await sql`
                        update "birthdayGallery"
                        set
                        description=${item.description??null},
                        position=${item.slot}
                        where id=${item.id}
                    `;
                    break;
                }
            }
        }
    });

  }catch(error){
    console.error(error);
    throw error;
  }  
}