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
  type?: "text" | "editable-select" | "datetime" | "address" | "image" | "gallery";
  icon?: "pencil" | "image";
  value: any;
  options?: string[];
  liveUpdate?: boolean;
  topClass?: string;
  leftClass?: string;
  descriptionText?: string;
};

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

  useEffect(() => {
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
    /*if (type === "datetime") {
      return;
    }*/

    return () => { document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editing, value, originalValue, field, updateEvent]);

  useEffect(() => {
    if (!openingFileDialog) return;
    const handleWindowFocus = () => {
      setOpeningFileDialog(false);
    };
    window.addEventListener("focus",handleWindowFocus);
    return () => { window.removeEventListener( "focus", handleWindowFocus  );
    };
  }, [openingFileDialog]);

  if ( !visible || activePanel || anotherMarkerIsOpen) {
    return null;
  }

  const handleSave = () => {
    //console.log("SAVE", field, draftValue);
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
        x.id!==id    ?x :{ ...x, picture:preview, status:x.status==="new"
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
      ref={wrapperRef}
      className={`
        absolute
        ${leftClass}
        ${topClass}
        -translate-x-1/2
        z-[995]
      `}
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

          setActiveEditMarker(editing? null: markerKey);
        }}
        className="
          w-7
          h-7
          rounded-full
          bg-red-500
          text-white
          flex
          items-center
          justify-center
          shadow-lg
          animate-pulse
          hover:scale-105
          transition
        "
      >
       { dynamicIcon(icon) }
      </button>

      {/* =====================================
          TEXT
      ===================================== */}
      {editing && type === "text" && (
       
        <div
          className="
            absolute
            top-10
            left-1/2
            -translate-x-1/2
            editmarker-bg
            rounded-lg
            shadow-xl
            border
            p-2
            flex
            items-center
            gap-2
            min-w-[280px]
          "
        >
          <div className="flex flex-col"> 
            <div>
              {descriptionText && (
                <p
                  className="
                    mb-1
                    text-xs
                    text-gray-500
                    text-left
                    pl-1
                  "
                >
                  {descriptionText}
                </p>
              )}  
            </div>

            <div>
              <input
                autoFocus
                value={(draftValue)?? ""}
                onChange={(e) => {
                  const newValue = e.target.value;

                  updateValue(newValue);
                }}
                className="
                  flex-1
                  border
                  border-gray-400
                  px-2
                  py-1
                  outline-none
                  editmarker-input-bg
                  text-gray-800
                "
              />

              <button
                type="button"
                onClick={handleSave}
                className="
                  text-green-600
                  font-bold
                  text-lg
                  pr-3
                  pl-5
                "
              >
                ✓
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="
                  text-red-600
                  font-bold
                  text-lg
                "
              >
                ✕
              </button>
            </div>

          </div>
        </div>
        
      )}

      {/* =====================================
          EDITABLE SELECT
      ===================================== */}
      {editing && type === "editable-select" && (
        <div
          className="
            absolute
            top-10
            left-1/2
            -translate-x-1/2
            rounded-lg
            shadow-xl
            border
            pl-2
            pr-2
            pb-2
            editmarker-bg
            min-w-[320px]
          "
        >
          <div>
            {descriptionText && (
              <p
                className="
                  mt-2
                  text-xs
                  text-gray-500
                  text-left
                  pl-1
                  pb-2
                  mt-0
                "
              >
                {descriptionText}
              </p>
            )}  
          </div>

          <div className="flex items-center gap-2 mb-2">
            <input
              autoFocus
              value={(draftValue ?? "")}
              onChange={(e) => {
                const newValue = e.target.value;

                updateValue(newValue);
              }}
              className="
                flex-1
                border
                border-gray-400
                px-2
                py-1
                outline-none
                editmarker-input-bg
              "
            />

            <button
              type="button"
              onClick={handleSave}
              className="
                text-green-600
                font-bold
                text-lg
              "
            >
              ✓
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="
                text-red-600
                font-bold
                text-lg
              "
            >
              ✕
            </button>
          </div>

          <p
                className="
                  mt-2
                  text-xs
                  text-gray-500
                  text-left
                  pl-1
                  pb-2
                  mt-0
                "
              >
                Sugerencias:
              </p>
          <div
            className="
              border
              border-gray-300
              editmarker-input-bg
              max-h-48
              overflow-y-auto
            "
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  updateValue(option);
                }}
                className="
                  block
                  w-full

                  text-left

                  px-3
                  py-2

                  hover:bg-gray-100

                  border-b
                  border-gray-300
                  last:border-b-0
                  
                "
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* =====================================
          DATETIME
      ===================================== */}
      {editing && type === "datetime" && (
        <div
          className="
            absolute
            top-10
            left-1/2
            -translate-x-1/2

            bg-white
            rounded-lg
            shadow-xl
            border
            p-2
   
          "
        >
          <div className="flex flex-col">
            <div>
              <p
                  className="
                   
                    text-xs
                    text-gray-500
                    text-left
                    pl-1
                    pb-2
                    mt-0
                  "
                >
                  {descriptionText}
                </p>
            </div>
            <div className=" flex items-center gap-2">
              <input
                autoFocus
                type="datetime-local"
                value={formatDateTimeLocal(draftValue ?? "")}
                onChange={(e) => {
                  const newValue = e.target.value;

                  updateValue(newValue);
                }}
                className="
                  border
                  rounded
                  px-2
                  py-1
                  outline-none
                  editmarker-input-bg
                "
              />

              <button
                type="button"
                onClick={handleSave}
                className="
                  text-green-600
                  font-bold
                  text-lg
                "
              >
                ✓
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="
                  text-red-600
                  font-bold
                  text-lg
                "
              >
                ✕
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* =====================================
          ADDRESS
      ===================================== */}
      {editing && type === "address" && (
        <div
          className="
            absolute
            top-10
            left-1/2
            -translate-x-1/2

            editmarker-bg
            rounded-lg
            shadow-xl
            border

            p-3

            min-w-[360px]

            
          "
        >
          <div className="flex flex-col">
            <div>
              <p
              className="
                mt-0
                mb-2
                text-xs
                text-gray-500
                text-left
              "
            >
              {descriptionText}
            </p>
            </div>  

            <div className="flex flex-col gap-2">  
            <input
              placeholder="Calle y número *"
              value={street}
              onChange={(e) => {
                const v = e.target.value;

                setStreet(v);

                updateAddressValue(
                  v,
                  extra,
                  city,
                  state,
                  country
                );
              }}
              className="border rounded px-2 py-1 editmarker-input-bg"
            />

            <input
              placeholder="Piso/Depto/Oficina/Otros"
              value={extra}
              onChange={(e) => {
                const v = e.target.value;

                setExtra(v);

                updateAddressValue(
                  street,
                  v,
                  city,
                  state,
                  country
                );
              }}
              className="border rounded px-2 py-1 editmarker-input-bg"
            />

            <input
              placeholder="Ciudad *"
              value={city}
              onChange={(e) => {
                const v = e.target.value;

                setCity(v);

                updateAddressValue(
                  street,
                  extra,
                  v,
                  state,
                  country
                );
              }}
              className="border rounded px-2 py-1 editmarker-input-bg"
            />

            <input
              placeholder="Provincia / Estado *"
              value={state}
              onChange={(e) => {
                const v = e.target.value;

                setState(v);

                updateAddressValue(
                  street,
                  extra,
                  city,
                  v,
                  country
                );
              }}
              className="border rounded px-2 py-1 editmarker-input-bg"
            />

            <select
              value={country}
              onChange={(e)=>{

                const value=e.target.value;

                setCountry(value);

                updateAddressValue(
                  street,
                  extra,
                  city,
                  state,
                  value
                );

              }}
              className="border rounded px-2 py-1 editmarker-input-bg"
            >
              {countries.map(country=>(
                <option
                  key={country.code}
                  value={country.name}
                >
                  {country.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="
                  text-green-600
                  font-bold
                  text-lg
                "
              >
                ✓
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="
                  text-red-600
                  font-bold
                  text-lg
                "
              >
                ✕
              </button>
            </div>
            
          </div>
     

          </div>
        </div>
      )}

      {/* =====================================
          IMAGE
      ===================================== */}
      {editing && type === "image" && (
        <div
          className="
            fixed

            top-1/2
            left-1/2

            -translate-x-1/2
            -translate-y-1/2

            z-[9999]

            editmarker-bg
            rounded-xl
            shadow-2xl
            border

            p-4

            w-[90vw]
            max-w-[420px]
          "
        >
          {/* SELECTOR */}
          <button
            type="button"
            onClick={() => {
              setOpeningFileDialog(true);

              fileInputRef.current?.click();
            }}
            className="
              w-full

              bg-blue-600
              text-white

              rounded-lg

              px-4
              py-3

              font-medium

              shadow

              hover:bg-blue-700
              transition

              flex
              items-center
              justify-center
              gap-2
            "
          >
            {openingFileDialog ? (
              <>
                <span
                  className="
                    inline-block
                    animate-spin
                  "
                >
                  ⟳
                </span>

                Un momento por favor...
              </>
            ) : (
              <>
                Seleccionar imagen
              </>
            )}
          </button>

          {descriptionText && (
            <p
              className="
                mt-2
                text-xs
                text-gray-500
                text-left
              "
            >
              {descriptionText}
            </p>
          )}  

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,image/*"
            className="hidden"

            onChange={(e) => {

              setOpeningFileDialog(false);

              const file =
                e.target.files?.[0];

              if (!file) {
                return;
              }

              const preview =
                URL.createObjectURL(file);

              setPreviewImage(preview);

              setPendingFile(field, file);

              if (liveUpdate) {
                updateEvent({
                  [field]: preview,
                });
              }
            }}
            
            onBlur={() => {
              setOpeningFileDialog(false);
            }}
          />

          {/* PREVIEW */}
          <div
            className="
              mt-3
              h-[250px]

              border
              border-gray-300

              rounded

              editmarker-bg

              flex
              items-center
              justify-center

              relative
            "
          >
            <Image
              src={previewImage}
              alt="Preview"
              width={400}
              height={250}

              className="
                max-w-full
                max-h-full
                object-contain
              "
            />
          </div>
          { /* BUTTONS */}
          <div
            className="
              flex
              justify-end
              gap-3
              pt-3
            "
          > 
            { /* SAVE */}
            <button
              type="button"
              onClick={() => {
                setOpeningFileDialog(false);
                if (!liveUpdate) {
                  updateEvent({
                    [field]: previewImage,
                  });
                }

                setActiveEditMarker(null);
              }}
              className="
                text-green-600
                font-bold
                text-lg
                pr-4
              "
            >
              ✓
            </button>

            { /* CANCEL */}
            <button
              type="button"
              onClick={() => {
                setOpeningFileDialog(false);

                setPreviewImage(originalImage);

                updateEvent({
                  [field]: originalImage,
                });

                setActiveEditMarker(null);
              }}
              className="
                text-red-600
                font-bold
                text-lg
              "
            >
              ✕
            </button>
          </div>
        </div>
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