"use client";
import {useEffect,useRef,useState} from "react";
import {useEventStore} from "@/store/eventStore";
import {APPEARANCE_TEMPLATES,APPEARANCE_COLORS,APPEARANCE_FONTS,APPEARANCE_ANIMATIONS,APPEARANCE_BACKGROUNDS,AppearanceColorAudience,getDefaultAppearanceTemplate} from "@/lib/appearance";
import CustomSelect from "@/components/ui/CustomSelect";
import { OccasionType, OCCASION_OPTIONS } from "@/lib/constants";

type Props={
  visible?:boolean;
  topClass?:string;
  leftClass?:string;
  markerId?:string;
  tutorialActive:boolean;
};



export default function AppearanceMarker({visible=true,topClass="top-6",leftClass="left-6",markerId="",tutorialActive=false}:Props){
  const {event,updateEvent,setActivePanel}=useEventStore();
  const [editing,setEditing]=useState(false);
  const [advanced,setAdvanced]=useState(false);

  /** GENERADOR DE TEMPLATES! SOLO PARA DEBUG / CREACION DE TEMPLATES */
const CUSTOM_TEMPLATE="custom";
const SHOW_TEMPLATE_GENERATOR = false;

const resetEvent = useEventStore(state => state.resetEvent);

// this is only for debug -> generate template
const OCCASION_TYPE_NAMES:Record<OccasionType,string>={ [OccasionType.None]:"OccasionType.None", [OccasionType.Birthday]:"OccasionType.Birthday", [OccasionType.KidsBirthday]:"OccasionType.KidsBirthday", [OccasionType.FifteenthBirthday]:"OccasionType.FifteenthBirthday", [OccasionType.Party]:"OccasionType.Party", [OccasionType.WeddingAnniversary]:"OccasionType.WeddingAnniversary", [OccasionType.Baptism]:"OccasionType.Baptism", [OccasionType.Communion]:"OccasionType.Communion", [OccasionType.BarMitzvah]:"OccasionType.BarMitzvah", [OccasionType.BatMitzvah]:"OccasionType.BatMitzvah", [OccasionType.Graduation]:"OccasionType.Graduation", [OccasionType.Anniversary]:"OccasionType.Anniversary", [OccasionType.BabyShower]:"OccasionType.BabyShower", [OccasionType.BridalShower]:"OccasionType.BridalShower", [OccasionType.Wedding]:"OccasionType.Wedding", [OccasionType.GenderReveal]:"OccasionType.GenderReveal", [OccasionType.Corporate]:"OccasionType.Corporate", [OccasionType.Other]:"OccasionType.Other" };

/*const COLOR_GROUP_OPTIONS = [ "birthday","celebration", "natural", "formal", "special", "vibrant", "elegant", "soft",
  "none",] as const;
const COLOR_INTENSITY_OPTIONS = [ "soft", "medium", "vibrant", "elegant", "none",] as const;*/
const COLOR_AUDIENCE_OPTIONS = [ "kids", "teens", "adults", "universal",] as const;
const [templatePrimaryOccasions,setTemplatePrimaryOccasions]=useState<OccasionType[]>([  OccasionType.Birthday]);
const [templateCompatibleOccasions,setTemplateCompatibleOccasions]=useState<OccasionType[]>([ OccasionType.Party]);
/*const [templateGroup,setTemplateGroup]=useState<string>("birthday");
const [templateIntensity,setTemplateIntensity]=useState<string>("soft");*/
const [templateAudience,setTemplateAudience]=useState<AppearanceColorAudience[]>([
  "universal"
]);
const toggleArrayValue = <T,>( value:T, setter:React.Dispatch<React.SetStateAction<T[]>>
) => { setter(current =>   current.includes(value)   ? current.filter(item=>item!==value)
      : [...current,value] );};



/** FIN GENERACION DE TEMPLATES */


  const wrapperRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!editing)
      return;
    function handleClickOutside(e:MouseEvent){
      if(wrapperRef.current&&!wrapperRef.current.contains(e.target as Node))
        handleCancel();
    }
    document.addEventListener("mousedown",handleClickOutside);
    return()=>document.removeEventListener("mousedown",handleClickOutside);
  },[editing]);
  if(!visible||!event)
    return null;

  const effectiveAppearance = {
    theme: event.theme,
    fontType: event.fontType,
    animationType: Number(event.animationType),
    backgroundMotive: event.backgroundMotive,
  };

  const currentTemplate = APPEARANCE_TEMPLATES.find(
    template =>
      template.colorValue === effectiveAppearance.theme &&
      template.fontValue === effectiveAppearance.fontType &&
      Number(template.animationValue) === Number(effectiveAppearance.animationType) &&
      template.backgroundValue === effectiveAppearance.backgroundMotive
  );

  const selectedTemplate = currentTemplate?.value ?? CUSTOM_TEMPLATE;

  const handleOpen = () => {
    setAdvanced(false);
    setActivePanel("appearance");
    setEditing(true);
  };

  const handleCancel = () => {
    resetEvent();
    setActivePanel(null);
    setEditing(false);
    setAdvanced(false);
  };
  const handleSave=()=>{
    setActivePanel(null);
    setEditing(false);
    setAdvanced(false);
  };

  const handleTemplateChange = (value:string) => {
    const template = APPEARANCE_TEMPLATES.find(
      item => item.value === value
    );

    if(!template)
      return;

    updateEvent({
      theme:template.colorValue,
      fontType:template.fontValue,
      animationType:Number(template.animationValue),
      backgroundMotive:template.backgroundValue,
    });
  };

  const handleGenerateTemplate=()=>{
    const formatOccasions=(values:OccasionType[])=>values.length===0?"[]":`[\n  ${values.map(value=>OCCASION_TYPE_NAMES[value]).join(",\n  ")}\n]`;
    const generatedTemplate=`{
    value:"",
    label:"",
    englishLabel:"",
    description:"",
    colorValue:"${event.theme??""}",
    fontValue:"${event.fontType??""}",
    animationValue:${Number(event.animationType??0)},
    backgroundValue:"${event.backgroundMotive??""}",
    audience:[${templateAudience.map(value=>`"${value}"`).join(",")}],
    primaryOccasions:${formatOccasions(templatePrimaryOccasions)},
    compatibleOccasions:${formatOccasions(templateCompatibleOccasions)}
  },`;
    console.log("APPEARANCE_TEMPLATE generado:\n"+generatedTemplate);
  };

  const sortedColors= 
  [...APPEARANCE_COLORS].sort((a,b)=>{
    const getPriority=(item:typeof APPEARANCE_COLORS[number])=>{
      if(item.primaryOccasions.includes(event.occasionType)) return 0;
      if(item.compatibleOccasions.includes(event.occasionType)) return 1;
      return 2;
    };
    return getPriority(a)-getPriority(b);
  });

/*console.log("Valor actual en event.theme:", event.theme);
console.log("Valores disponibles en sortedColors:", sortedColors.map(i => i.value));

console.log("Valor actual en event.backgroundMotive:", event.backgroundMotive);
console.log("Valores disponibles en backgroundMotives:", APPEARANCE_BACKGROUNDS.map(i => i.value));*/


  return(
    <div id={markerId} ref={wrapperRef} className={`absolute ${topClass} ${leftClass} z-[999] marker-ui`}>
      <button type="button" title="Apariencia" onClick={handleOpen} className={`w-8 h-8 rounded-full text-white flex items-center justify-center transition-all duration-300 hover:scale-105 ${tutorialActive?"bg-violet-600 ring-4 ring-violet-300 shadow-2xl scale-125 animate-bounce":"bg-violet-600 hover:bg-violet-700 shadow-lg animate-pulse scale-110 ring-4 ring-orange-300"}`}>
        🎨
      </button>
      {editing&&(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20"/>
          <div className="relative font-sans bg-white rounded-xl shadow-2xl p-4 w-[95%] max-w-[420px]">
            <h2 className="text-base font-semibold text-gray-900">Editor: Tema del evento</h2>
            <p className="mt-1 text-xs text-gray-500">Permite seleccionar: paleta de colores, tipografía, animación en la presentación y fondo.</p>
            {!advanced&&(
              <div className="mt-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Tema</label>
                <select
                  value={selectedTemplate}
                  onChange={e=>handleTemplateChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  {selectedTemplate===CUSTOM_TEMPLATE&&
                    <option value={CUSTOM_TEMPLATE}>
                      Personalizado
                    </option>
                  }

                  {APPEARANCE_TEMPLATES.map(template=>(
                    <option
                      key={template.value}
                      value={template.value}
                    >
                      {template.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {advanced&&(
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">Paleta de Colores</label>
                  <select value={effectiveAppearance.theme??""} onChange={e=>updateEvent({theme:e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    {sortedColors.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">Animación</label>
                  <CustomSelect value={effectiveAppearance.animationType??0} onChange={e=>updateEvent({animationType:Number(e.target.value)})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    {APPEARANCE_ANIMATIONS.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}
                  </CustomSelect>
                </div>
                
                 <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">Fondo</label>
                  <select value={effectiveAppearance.backgroundMotive??""} onChange={e=>updateEvent({backgroundMotive:e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    {APPEARANCE_BACKGROUNDS.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">Tipografía</label>
                  <select value={effectiveAppearance.fontType??""} onChange={e=>updateEvent({fontType:e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    {APPEARANCE_FONTS.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </div>

              </div>
            )}





            {/** DESDE */}
            <div className="mt-4 w-full">
              {!SHOW_TEMPLATE_GENERATOR&&(
                <div className="flex w-full items-center justify-between">
                  <button type="button" onClick={()=>setAdvanced(value=>!value)} className="text-xs text-gray-600 underline hover:text-gray-900">{advanced?"Configuración básica":"Configuración avanzada"}</button>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={handleCancel} className="admin-button-secondary admin-button-xsmall !px-3 !py-1.5 !text-xs">Cancelar</button>
                    <button type="button" onClick={handleSave} className="admin-button admin-button-xsmall !px-3 !py-1.5 !text-xs">Aceptar</button>
                  </div>
                </div>
              )}
              {SHOW_TEMPLATE_GENERATOR&&(
                <>
                  <div className="flex w-full items-center justify-between">
                    <button type="button" onClick={()=>setAdvanced(value=>!value)} className="text-xs text-gray-600 underline hover:text-gray-900">{advanced?"Configuración básica":"Configuración avanzada"}</button>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={handleCancel} className="admin-button-secondary admin-button-xsmall !px-3 !py-1.5 !text-xs">Cancelar</button>
                      <button type="button" onClick={handleSave} className="admin-button admin-button-xsmall !px-3 !py-1.5 !text-xs">Aceptar</button>
                    </div>
                  </div>
                  {advanced&&(
                    <div className="mt-2 w-full">
                      <button type="button" onClick={handleGenerateTemplate} className="text-[10px] text-violet-600 underline hover:text-violet-800">Generar template</button>
                      <div className="mt-2 w-full text-[10px] leading-tight text-gray-700">
                        {/*<div className="flex w-full flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-semibold text-red-900">GRUPO:</span>
                          {COLOR_GROUP_OPTIONS.map(option=><label key={option} className="flex items-center gap-1 whitespace-nowrap"><input type="radio" name="template-group" checked={templateGroup===option} onChange={()=>setTemplateGroup(option)} className="h-3 w-3"/>{option}</label>)}
                        </div>
                        <div className="mt-1 flex w-full flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-semibold text-red-900">INTENSIDAD:</span>
                          {COLOR_INTENSITY_OPTIONS.map(option=><label key={option} className="flex items-center gap-1 whitespace-nowrap"><input type="radio" name="template-intensity" checked={templateIntensity===option} onChange={()=>setTemplateIntensity(option)} className="h-3 w-3"/>{option}</label>)}
                        </div> */}
                        <div className="mt-1 flex w-full flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-semibold text-red-900">PUBLICO:</span>
                          {COLOR_AUDIENCE_OPTIONS.map(option=><label key={option} className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" checked={templateAudience.includes(option)} onChange={()=>toggleArrayValue(option,setTemplateAudience)} className="h-3 w-3"/>{option}</label>)}
                        </div>
                        <div className="mt-1 flex w-full flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-semibold text-red-900">PRIMARY:</span>
                          {OCCASION_OPTIONS.map(option=><label key={option.value} className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" checked={templatePrimaryOccasions.includes(option.value)} onChange={()=>toggleArrayValue(option.value,setTemplatePrimaryOccasions)} className="h-3 w-3"/>{option.label}</label>)}
                        </div>
                        <div className="mt-1 flex w-full flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-semibold text-red-900">COMPATIBLE:</span>
                          {OCCASION_OPTIONS.map(option=><label key={option.value} className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" checked={templateCompatibleOccasions.includes(option.value)} onChange={()=>toggleArrayValue(option.value,setTemplateCompatibleOccasions)} className="h-3 w-3"/>{option.label}</label>)}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            {/** HASTA */}




          </div>
        </div>
      )}
    </div>
  );
}