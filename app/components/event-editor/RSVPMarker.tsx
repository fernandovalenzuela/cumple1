"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useEventStore } from "@/store/eventStore";
import { AccessType } from "@/lib/constants";
import { getRsvpDateInputValue } from "@/lib/rsvp";
import { RSVP_ACCESS_TYPES } from "@/lib/rsvp";
type Props={
  visible?:boolean;
  markerId?:string;
  topClass?:string;
  leftClass?:string;
  tutorialActive:boolean;
};
type EditorModalProps={
  children:React.ReactNode;
  className?:string;
};
function EditorModal({children,className=""}:EditorModalProps){
  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/40"/>
      <div className={`fixed left-1/2 top-1/2 z-[9999] w-[92vw] max-w-[360px] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-4 shadow-2xl ${className}`}>
        {children}
      </div>
    </>,
    document.body
  );
}
export default function RSVPMarker({visible=true,markerId="",topClass="top-32",leftClass="left-6",tutorialActive=false}:Props){
  const {event,updateEvent,setActivePanel}=useEventStore();
  const [editing,setEditing]=useState(false);
  const [originalValues,setOriginalValues]=useState({
    accessType:3,
    maxGuests:0,
    askFoodType:false,
    allowMessages:true,
    showMessagesList:true,
    personMaxGuestOpenEvent:2,
  });
  if(!visible||!event)
    return null;
  const handleOpen=()=>{
    setOriginalValues({
      accessType:event.accessType??3,
      maxGuests:event.maxGuests??0,
      askFoodType:event.askFoodType??false,
      allowMessages:event.allowMessages??true,
      showMessagesList:event.showMessagesList??true,
      personMaxGuestOpenEvent:event.personMaxGuestOpenEvent??2,
    });
    setActivePanel("rsvp");
    setEditing(true);
  };
  const handleCancel=()=>{
    updateEvent(originalValues);
    setActivePanel(null);
    setEditing(false);
  };
  const handleSave=()=>{
    setActivePanel(null);
    setEditing(false);
  };
  const isOpen=Number(event.accessType)===AccessType.Open;
  return(
    <div id={markerId} className={`absolute ${topClass} ${leftClass} z-[999] marker-ui`}>
      <button type="button" title="Participación" onClick={handleOpen} className={`w-8 h-8 rounded-full text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 ${tutorialActive?"bg-violet-600 ring-4 ring-violet-300 shadow-2xl scale-125 animate-bounce":"bg-violet-600 hover:bg-violet-700 shadow-lg animate-pulse scale-110 ring-4 ring-orange-300"}`}>
        📋
      </button>
      {editing&&(
        <EditorModal className="max-w-[380px]">
          <div>
            <p className="text-sm font-medium text-gray-800 text-center">Configuración de asistencia</p>
            <p className="mt-1 text-sm text-gray-500 text-center">Configura si quieres que tus invitados confirmen la asistencia.</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-800">Tipo de evento</label>
                <select value={event.accessType??3} onChange={e=>updateEvent({accessType:Number(e.target.value)})} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300">
                  {RSVP_ACCESS_TYPES.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <div className="mt-1 text-xs text-gray-500">
                  <div><b>Confirmación de asistencia:</b> los invitados deberán confirmar su asistencia.</div>
                  <div><b>Sin confirmación de asistencia:</b> cualquiera puede asistir.</div>
                </div>
              </div>
              {isOpen?(
                <>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-800">Fecha límite para confirmar Asistencia</label>
                    <input type="date" value={getRsvpDateInputValue(event.eventBirthday,event.rsvpDeadline)} onChange={e=>{const selectedDate=e.target.value;if(!selectedDate)return;const deadline=new Date(selectedDate);deadline.setHours(23,59,59,0);updateEvent({rsvpDeadline:deadline.toISOString()});}} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"/>
                    <p className="mt-1 text-xs text-gray-500">Día hasta cuando los invitados pueden confirmar asistencia.</p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-800">Acompañantes permitidos</label>
                    <select value={(event.personMaxGuestOpenEvent??1)-1} onChange={e=>updateEvent({personMaxGuestOpenEvent:Number(e.target.value)+1})} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300">
                      <option value={0}>No permitir acompañantes</option>
                      <option value={1}>1 acompañante</option>
                      <option value={2}>2 acompañantes</option>
                      <option value={3}>3 acompañantes</option>
                      <option value={4}>4 acompañantes</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Cantidad de acompañantes que puede llevar el invitado/a.</p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-800">Capacidad máxima de asistentes</label>
                    <input type="number" min="0" max={event.planMaxGuests} value={event.maxGuests??""} onChange={e=>{const inputValue=e.target.value;if(inputValue===""){updateEvent({maxGuests:undefined});return;}const numValue=Number(inputValue);updateEvent({maxGuests:Math.min(numValue,event.planMaxGuests)});}} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"/>
                    <p className="mt-1 text-xs text-gray-500">Cantidad máxima de personas que quieres invitar.</p>
                    <p className="mt-1 text-xs text-gray-500">Este plan permite <b>máximo {event.planMaxGuests} personas</b>.</p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-800">Solicitar preferencia alimentaria</label>
                    <select value={event.askFoodType?"1":"0"} onChange={e=>updateEvent({askFoodType:e.target.value==="1"})} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300">
                      <option value="1">Sí</option>
                      <option value="0">No</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Los invitados pueden indicar si prefieren comida sin restricciones, vegetariana, vegana o sin gluten.</p>
                  </div>
                </>
              ):(
                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                  Los visitantes podrán acceder a la información del evento, pero no podrán confirmar asistencia.
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={handleCancel} className="admin-button-secondary admin-button-xsmall !px-3 !py-1.5 !text-xs">Cancelar</button>
              <button type="button" onClick={handleSave} className="admin-button admin-button-xsmall !px-3 !py-1.5 !text-xs">Aceptar</button>
            </div>
          </div>
        </EditorModal>
      )}
    </div>
  );
}