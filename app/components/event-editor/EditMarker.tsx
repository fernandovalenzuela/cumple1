"use client";

import { useEffect, useRef, useState } from "react";
import { useEventStore } from "@/store/eventStore";
import { formatDateTimeLocal } from "./../../lib/utils";
import Image from "next/image";
import { getCountries } from "@/lib/countries";
import { createPortal } from "react-dom";

type Props = {
  markerId?: string;
  visible?: boolean;
  title?: string;
  field: string;
  type?: "text" | "textarea" | "editable-select" | "datetime" | "address" | "image" | "gallery";
  icon?: "pencil" | "image";
  value: any;
  options?: string[];
  liveUpdate?: boolean;
  topClass?: string;
  leftClass?: string;
  descriptionText?: string;
  tutorialActive:boolean;
  descriptionExtraText?: string;
};

type EditorModalProps={children:React.ReactNode;onCancel:()=>void;className?:string};
function EditorModal({children,onCancel,className=""}:EditorModalProps){
  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/40"/>
      <div className={`fixed left-1/2 top-1/2 z-[9999] w-[92vw] max-w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-4 shadow-2xl ${className}`}>
        {children}
      </div>
    </>,
    document.body
  );
}

const specialCharacters=["✨","❤️","🎉","🎂","🥳","💕","🎈","🌸","⭐","😊","😍","💫"];

export default function EditMarker({
  markerId = "",
  visible = true,
  title = "Editar",
  field,
  type = "text",
  icon = "pencil",
  value,
  options = [],
  liveUpdate = true,
  topClass = "top-15",
  leftClass = "left-1/2",
  descriptionText = "",
  tutorialActive = false,
  descriptionExtraText = "",
}: Props) {

  const {
      updateEvent,
      setPendingFile,
      activePanel,
      pendingGalleryFiles,
      setPendingGalleryFile,
    } = useEventStore();
  

  //const [editing, setEditing] = useState(false);
  const {activeEditMarker, setActiveEditMarker} = useEventStore();
  const markerKey = markerId ?? field;
  const editing = activeEditMarker === markerKey;
  const anotherMarkerIsOpen = activeEditMarker !== null && activeEditMarker !== markerKey;

  const [draftValue, setDraftValue] = useState(value);
  const [originalValue, setOriginalValue] = useState(value);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [extra, setExtra] = useState("");
  const [previewImage, setPreviewImage] = useState(value);
  const [originalImage, setOriginalImage] = useState(value);
  const [openingFileDialog, setOpeningFileDialog] = useState(false);
  const countries=getCountries();
  const event=useEventStore(state=>state.event);
  const gallery=event?.gallery??[];
  const [galleryEditingId,setGalleryEditingId]=useState<string|null>(null);
  const textInputRef=useRef<HTMLInputElement|null>(null);
  const textAreaRef=useRef<HTMLTextAreaElement|null>(null);
  const [showSpecialCharacters,setShowSpecialCharacters]=useState(false);

  function parseAddress(address: string | null) {
    if (address === null || address.trim() === "") {
      return {  street:"", extra:  "", city: "", state: "", country:"", };}
    const parts = address.split(",").map((x) => x.trim());

    return {
      street: parts[0] || "", extra: parts[1] || "",  city: parts[2] || "",
      state: parts[3] || "", country: parts[4] || "", };
  }

  const wrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
     if(!editing)
      return;
    setDraftValue(value);
  }, [editing, value]);

  /*useEffect(() => {
    if (!editing) return;

    function handleClickOutside(event: MouseEvent) {
      if(editing && type==="gallery")
        return;
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)
      ) {
          setDraftValue(originalValue);
          updateEvent({ [field]: originalValue, });
          setActiveEditMarker(null);
      }
    }

    document.addEventListener("mousedown",handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editing, value, originalValue, field, updateEvent]);*/

  useEffect(() => {
    if (!openingFileDialog) return;
    const handleWindowFocus = () => { setOpeningFileDialog(false); };
    window.addEventListener("focus",handleWindowFocus);
    return () => { window.removeEventListener( "focus", handleWindowFocus  );
    };
  }, [openingFileDialog]);

  if ( !visible || activePanel || anotherMarkerIsOpen) {
    return null;
  }

  /*const handleSave = () => {
    if (!liveUpdate) {
      updateEvent({ [field]: draftValue,  });
    }
    setActiveEditMarker(null);
  };

  const handleCancel = () => {  setDraftValue(originalValue);
    updateEvent({ [field]: originalValue, });
    setActiveEditMarker(null);
  };

  const updateValue = (newValue: string) => {
  setDraftValue(newValue);
  if (liveUpdate) {
    updateEvent({ [field]: newValue,  });
  }
};*/

  const handleSave=()=>{
    updateEvent({[field]:draftValue});
    setActiveEditMarker(null);
  };
  const handleCancel=()=>{
    updateEvent({[field]:originalValue});
    setDraftValue(originalValue);
    setActiveEditMarker(null);
  };
  const updateValue=(newValue:string)=>{
    setDraftValue(newValue);
    if(liveUpdate)
      updateEvent({[field]:newValue});
  };

  function handleAddGalleryImage(file: File) {
    if (!event)
      return;
    if (
      !event.maxPicsGallery ||
      gallery.filter(x => x.status !== "deleted").length >= event.maxPicsGallery
    )
      return;
    const usedSlots = gallery.filter(x => x.status !== "deleted").map(x => x.slot);
    let slot = 1;
    while (usedSlots.includes(slot))
      slot++;
    const preview = URL.createObjectURL(file);
    setPendingGalleryFile(`gallery${slot}`, file);
    updateEvent({
      gallery: [...gallery, {
          id: -Date.now(), slot, picture: preview, description: "", status: "new",},
      ],
    });
  }

  function handleReplaceGalleryImage(file:File){
    if(galleryEditingId===null)
      return;
    const id=Number(galleryEditingId);
    const item=gallery.find(x=>x.id===id);
    if(!item)
      return;

    const preview=URL.createObjectURL(file);
    const key=`gallery${item.slot}`;
    setPendingGalleryFile(key,file);
    updateEvent({
      gallery:gallery.map(x=>
        x.id!==id ?x :{ ...x, picture:preview, status:x.status==="new"
                ?"new"
                :"updated",
            }
      ),
    });
  }

  function handleDeleteGalleryImage(id:number){
    const item=gallery.find(x=>x.id===id);
    if(!item)
      return;
    if(item.status==="new"){
      updateEvent({
        gallery:gallery.filter(x=>x.id!==id).map((x,index)=>({
            ...x,slot:index+1,})),
      });
      return;
    }
    updateEvent({
      gallery:gallery.map(x=>
        x.id!==id
          ?x :{...x, status:"deleted",}
      ),
    });
  }

  function handleGalleryDescription(
    id:number,
    description:string
  ){
    updateEvent({
      gallery:gallery.map(item=>
        item.id!==id       ?item
          :{  ...item,
              description,
              status:item.status==="new" ?"new" :"updated",
            }
      ),
    });
  }

  function insertSpecialCharacter(character:string){
    const input=textInputRef.current||textAreaRef.current;
    if(!input)
      return;
    const start=input.selectionStart??input.value.length;
    const end=input.selectionEnd??start;
    const newValue=input.value.slice(0,start)+character+input.value.slice(end);
    updateValue(newValue);
    requestAnimationFrame(()=>{
      input.focus();
      const position=start+character.length;
      input.setSelectionRange(position,position);
    });
  }

  const updateAddressValue = (
      newStreet: string,
      newExtra: string,
      newCity: string,
      newState: string,
      newCountry: string
    ) => {
      const address = [
        newStreet,
        newExtra,
        newCity,
        newState,
        newCountry,
      ].join(",");

      setDraftValue(address);

      if (liveUpdate) {
        updateEvent({ [field]: address,  });
      }
  };

  function dynamicIcon( type: string) {
    // 1. Definimos el diccionario de íconos
    if (type.trim().toLocaleLowerCase()==="pencil")
      return <>✎</>
    else if (type.trim().toLocaleLowerCase()==="image")
      return <>▣</>   

  }

  return (
    <>
    <div
      id={markerId}
      data-marker={markerId}
      ref={wrapperRef}
      className={` absolute ${leftClass} ${topClass} -translate-x-1/2 z-[995] marker-ui`}
    >
      {/* LÁPIZ */}
      <button
        type="button"
        title={title}
        onClick={() => {
          const currentValue=String(event?.[field as keyof typeof event] ?? value ?? "" );
          setOriginalValue(currentValue);
          setDraftValue(currentValue);
          setOriginalImage(value);
          setPreviewImage(value);

          if (type === "address" && value!== undefined && value!== null) {
            const parsed = parseAddress(value);
            setStreet(parsed.street);
            setExtra(parsed.extra);
            setCity(parsed.city);
            setState(parsed.state);
            setCountry(parsed.country);
          }

          if(editing){
            setShowSpecialCharacters(false);
            setActiveEditMarker(null);
          }else{
            setShowSpecialCharacters(false);
            setActiveEditMarker(markerKey);
          }
        }}
        className={` w-7 h-7 cursor-pointer rounded-full text-white flex items-center
          justify-center transition-all duration-300 hover:scale-105
          ${
            tutorialActive
              ?`bg-orange-500 ring-4 ring-orange-300 shadow-2xl scale-125
                animate-bounce scale-110 ring-4 ring-orange-300`
              :`bg-red-500 shadow-lg animate-pulse  scale-110 ring-4 ring-orange-300`
          }
        `}
      >
      {/* animate-bounce scale-110 ring-4 ring-orange-300 */}

       { dynamicIcon(icon) }
      </button>

      {/* =====================================
          TEXT
      ===================================== */}
      {editing&&type==="text"&&(
        <EditorModal onCancel={handleCancel}>
          <div>
            <p className="text-sm font-medium text-gray-800 text-center">Editor: {descriptionText||title}</p>
            {descriptionExtraText&&descriptionExtraText!==""&&(
              <p className="text-sm font-small text-gray-500 text-center">{descriptionExtraText}</p>
            )}
            <input ref={textInputRef} autoFocus value={draftValue??""} onChange={e=>updateValue(e.target.value)} className="mt-3 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"/>
            <div className="mt-4">
              {showSpecialCharacters&&(
                <div className="grid grid-cols-6 gap-1">
                  {specialCharacters.map(character=>(
                    <button key={character} type="button" onMouseDown={e=>e.preventDefault()} onClick={()=>insertSpecialCharacter(character)} className="rounded-md border border-gray-200 bg-gray-50 py-1.5 text-base leading-none hover:bg-orange-50">
                      {character}
                    </button>
                  ))}
                </div>
              )}
              <div className={showSpecialCharacters?"mt-3 flex justify-end gap-2":"flex items-center justify-between gap-2"}>
                {!showSpecialCharacters&&(
                  <button type="button" onClick={()=>setShowSpecialCharacters(true)} className="text-xs text-orange-600 underline hover:text-orange-700">
                    Emoticones
                  </button>
                )}
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={handleCancel} className="admin-button-secondary admin-button-xsmall !px-3 !py-1.5 !text-xs">Cancelar</button>
                  <button type="button" onClick={handleSave} className="admin-button admin-button-xsmall !px-3 !py-1.5 !text-xs">Aceptar</button>
                </div>
              </div>
            </div>
          </div>
        </EditorModal>
      )}

      {/* =====================================
          TEXTAREA
      ===================================== */}
      {editing&&type==="textarea"&&(
        <EditorModal onCancel={handleCancel}>
          <div>
            <p className="text-sm font-medium text-gray-800 text-center">{descriptionText||title}</p>
            {descriptionExtraText&&descriptionExtraText!==""&&(
              <p className="text-sm font-small text-gray-500 text-center">{descriptionExtraText}</p>
            )}
            <textarea ref={textAreaRef} autoFocus value={draftValue??""} onChange={e=>updateValue(e.target.value)} rows={5} className="mt-3 w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"/>
            <div className="mt-4">
              {showSpecialCharacters&&(
                <div className="grid grid-cols-6 gap-1">
                  {specialCharacters.map(character=>(
                    <button key={character} type="button" onMouseDown={e=>e.preventDefault()} onClick={()=>insertSpecialCharacter(character)} className="rounded-md border border-gray-200 bg-gray-50 py-1.5 text-base leading-none hover:bg-orange-50">
                      {character}
                    </button>
                  ))}
                </div>
              )}
              <div className={showSpecialCharacters?"mt-3 flex justify-end gap-2":"flex items-center justify-between gap-2"}>
                {!showSpecialCharacters&&(
                  <button type="button" onClick={()=>setShowSpecialCharacters(true)} className="text-xs text-orange-600 underline hover:text-orange-700">
                    Emoticones
                  </button>
                )}
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={handleCancel} className="admin-button-secondary admin-button-xsmall !px-3 !py-1.5 !text-xs">Cancelar</button>
                  <button type="button" onClick={handleSave} className="admin-button admin-button-xsmall !px-3 !py-1.5 !text-xs">Aceptar</button>
                </div>
              </div>
            </div>
          </div>
        </EditorModal>
      )}

      {/* =====================================
          EDITABLE SELECT
      ===================================== */}
      {editing&&type==="editable-select"&&(
        <EditorModal onCancel={handleCancel} className="max-w-[360px]">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800">{descriptionText||title}</p>
            {descriptionExtraText&& descriptionExtraText!=="" && (
              <p className="text-sm font-small text-gray-500 text-center">{descriptionExtraText}</p>
            )}
            <input autoFocus value={draftValue??""} onChange={e=>updateValue(e.target.value)} className="mt-3 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"/>
            <p className="mt-3 text-left text-xs text-gray-500">Sugerencias:</p>
            <div className="mt-1 max-h-40 overflow-y-auto rounded-md border border-gray-200 bg-white">
              {options.map(option=>(
                <button key={option} type="button" onClick={()=>updateValue(option)} className="block w-full border-b border-gray-200 px-3 py-2 text-left text-sm text-gray-700 last:border-b-0 hover:bg-gray-50">{option}</button>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={handleCancel} className="admin-button-secondary admin-button-xsmall !px-3 !py-1.5 !text-xs">Cancelar</button>
              <button type="button" onClick={handleSave} className="admin-button admin-button-xsmall !px-3 !py-1.5 !text-xs">Aceptar</button>
            </div>
          </div>
        </EditorModal>
        )}

      {/* =====================================
          DATETIME
      ===================================== */}
      {editing&&type==="datetime"&&(
        <EditorModal onCancel={handleCancel}>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800">{descriptionText||title}</p>
            {descriptionExtraText&& descriptionExtraText!=="" && (
              <p className="text-sm font-small text-gray-500 text-center">{descriptionExtraText}</p>
            )}
            <input autoFocus type="datetime-local" value={formatDateTimeLocal(draftValue??"")} onChange={e=>updateValue(e.target.value)} className="mt-3 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"/>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={handleCancel} className="admin-button-secondary admin-button-xsmall !px-3 !py-1.5 !text-xs">Cancelar</button>
              <button type="button" onClick={handleSave} className="admin-button admin-button-xsmall !px-3 !py-1.5 !text-xs">Aceptar</button>
            </div>
          </div>
        </EditorModal>
        )}

      {/* =====================================
          ADDRESS
      ===================================== */}
      {editing&&type==="address"&&(
      <EditorModal onCancel={handleCancel} className="max-w-[380px]">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-800">{descriptionText||title}</p>
          {descriptionExtraText&& descriptionExtraText!=="" && (
              <p className="text-sm font-small text-gray-500 text-center">{descriptionExtraText}</p>
            )}
          <div className="mt-3 flex flex-col gap-2">
            <input placeholder="Calle y número *" value={street} onChange={e=>{const v=e.target.value;setStreet(v);updateAddressValue(v,extra,city,state,country);}} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"/>
            <input placeholder="Piso/Depto/Oficina/Otros" value={extra} onChange={e=>{const v=e.target.value;setExtra(v);updateAddressValue(street,v,city,state,country);}} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"/>
            <input placeholder="Ciudad *" value={city} onChange={e=>{const v=e.target.value;setCity(v);updateAddressValue(street,extra,v,state,country);}} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"/>
            <input placeholder="Provincia / Estado *" value={state} onChange={e=>{const v=e.target.value;setState(v);updateAddressValue(street,extra,city,v,country);}} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"/>
            <select value={country} onChange={e=>{const v=e.target.value;setCountry(v);updateAddressValue(street,extra,city,state,v);}} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300">
              {countries.map(country=><option key={country.code} value={country.name}>{country.name}</option>)}
            </select>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={handleCancel} className="admin-button-secondary admin-button-xsmall !px-3 !py-1.5 !text-xs">Cancelar</button>
            <button type="button" onClick={handleSave} className="admin-button admin-button-xsmall !px-3 !py-1.5 !text-xs">Aceptar</button>
          </div>
        </div>
      </EditorModal>
      )}

      {/* =====================================
          IMAGE
      ===================================== */}
      {editing&&type==="image"&&(
      <EditorModal onCancel={()=>{setOpeningFileDialog(false);setPreviewImage(originalImage);updateEvent({[field]:originalImage});setActiveEditMarker(null);}} className="max-w-[420px]">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-800">{descriptionText||title}</p>
          {descriptionExtraText&& descriptionExtraText!=="" && (
              <p className="text-sm font-small text-gray-500 text-center">{descriptionExtraText}</p>
           )}
          <button type="button" onClick={()=>{setOpeningFileDialog(true);fileInputRef.current?.click();}} className="mt-3 w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-600">
            {openingFileDialog?"Un momento por favor...":"Seleccionar imagen"}
          </button>
          <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,image/*" className="hidden" onChange={e=>{setOpeningFileDialog(false);const file=e.target.files?.[0];if(!file)return;const preview=URL.createObjectURL(file);setPreviewImage(preview);setPendingFile(field,file);if(liveUpdate)updateEvent({[field]:preview});}} onBlur={()=>setOpeningFileDialog(false)}/>
          <div className="mt-3 flex h-[220px] items-center justify-center overflow-hidden rounded-lg bg-gray-50">
            <Image src={previewImage} alt="Preview" width={400} height={250} className="max-h-full max-w-full object-contain"/>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={()=>{setOpeningFileDialog(false);setPreviewImage(originalImage);updateEvent({[field]:originalImage});setActiveEditMarker(null);}} className="admin-button-secondary admin-button-xsmall !px-3 !py-1.5 !text-xs">Cancelar</button>
            <button type="button" onClick={()=>{setOpeningFileDialog(false);if(!liveUpdate)updateEvent({[field]:previewImage});setActiveEditMarker(null);}} className="admin-button admin-button-xsmall !px-3 !py-1.5 !text-xs">Aceptar</button>
          </div>
        </div>
      </EditorModal>
      )}

      {/* =====================================
          GALLERY
      ===================================== */}
      {editing && type==="gallery" && createPortal(
        <>
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={()=>setActiveEditMarker(null)}
        />

        <div
          className="
            fixed left-1/2 top-1/2 z-50
            w-[92vw] max-w-xl max-h-[85vh]
            -translate-x-1/2 -translate-y-1/2
            overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl

          "
        >

          <h2 className="mb-0.5 text-xl text-center font-medium  text-gray-800">
            Editor de Galería
          </h2>
          <div className="text-center text-gray-400 text-sm mb-2" >Máxima cantidad imágenes: {(event ? event.maxPicsGallery: 0)}</div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={e=>{
              const file=e.target.files?.[0];
              if(!file)
                return;
              if(galleryEditingId===null)
                handleAddGalleryImage(file);
              else
                handleReplaceGalleryImage(file);

              setGalleryEditingId(null);
              e.target.value="";
            }}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1">
            <div className="">
              {gallery ?.filter(item=>item.status!=="deleted").map(item=>(
                <div
                  key={item.id}
                  className="space-y-3 border border-gray-100 p-12 rounded-xl mb-3 bg-gray-50"
                >
                  <Image
                    src={item.picture}
                    alt=""
                    width={500}
                    height={350}
                    className="w-full h-44 rounded-lg object-cover"
                  />
                  <textarea
                    className="admin-input text-gray-700 resize-none py-2 min-h-0 !text-sm "
                    rows={1}
                    placeholder="Descripción"
                    value={item.description??""}
                    onChange={e=>
                      handleGalleryDescription(
                        item.id,
                        e.target.value
                      )
                    }
                  />
    
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="admin-button-secondary flex-1 admin-button-medium admin-button-medium-bg px-4"
                      onClick={()=>{
                        setGalleryEditingId(String(item.id));
                        fileInputRef.current?.click();
                      }}
                    > Cambiar </button>

                    <button
                      type="button"
                      className="admin-button-secondary admin-button-medium admin-button-medium-bg px-4"
                      onClick={()=>
                        handleDeleteGalleryImage(item.id)
                      }
                    > ✕  </button>
                  </div>
                </div>
              ))} 
            </div>   
          </div>

          <div className="mt-8 flex justify-end gap-2">
            {event && event.maxPicsGallery && gallery.filter(x => x.status !== "deleted").length < event.maxPicsGallery && (
            <button
              type="button"
              className="admin-button-secondary admin-button-medium w-full"
              onClick={()=>{
                setGalleryEditingId(null);
                fileInputRef.current?.click();
              }}
            >
            Agregar imagen
            </button>
          )}  
            <button
              type="button"
              className="admin-button flex-1 admin-button-medium"
              onClick={()=>{
                setActiveEditMarker(null);
              }}
            >
            Aceptar
            </button>
          </div>     
        </div>
        </>
      ,document.body)}

    </div>
    </>
  );
}