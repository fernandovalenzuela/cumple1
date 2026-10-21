"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useEventStore } from "@/store/eventStore";
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
export default function MessagesMarker({visible=true,markerId="",topClass="top-32",leftClass="left-6",tutorialActive=false}:Props){
  const {event,updateEvent,setActivePanel}=useEventStore();
  const [editing,setEditing]=useState(false);
  const [originalValues,setOriginalValues]=useState({
    accessType:3,
    allowMessages:true,
    showMessagesList:true,
  });
  if(!visible||!event)
    return null;
  const handleOpen=()=>{
    setOriginalValues({
      accessType:event.accessType??3,
      allowMessages:event.allowMessages??true,
      showMessagesList:event.showMessagesList??true,
    });
    setActivePanel("messages");
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
  return(
    <div id={markerId} className={`absolute ${topClass} ${leftClass} z-[999] marker-ui`}>
      <button type="button" title="Participación" onClick={handleOpen} className={`w-8 h-8 rounded-full text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 ${tutorialActive?"bg-violet-600 ring-4 ring-violet-300 shadow-2xl scale-125 animate-bounce":"bg-violet-600 hover:bg-violet-700 shadow-lg animate-pulse scale-110 ring-4 ring-orange-300"}`}>
        ✉
      </button>
      {editing&&(
        <EditorModal>
          <div>
            <p className="text-sm font-medium text-gray-800 text-center">Configuración de mensajes</p>
            <p className="mt-1 text-sm text-gray-500 text-center">Puedes elegir si quieres que tus invitados/visitantes te dejen mensajes o saludos.</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-800">Permitir mensajes</label>
                <select value={event.allowMessages?"1":"0"} onChange={e=>updateEvent({allowMessages:e.target.value==="1"})} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300">
                  <option value="1">Sí</option>
                  <option value="0">No</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Los visitantes podrán dejar mensajes.</p>
              </div>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${event.allowMessages?"max-h-60 opacity-100":"max-h-0 opacity-0"}`}>
                <div className="ml-3 border-l-2 border-gray-200 pl-3">
                  <label className="block mb-1 text-sm font-medium text-gray-800">Mostrar mensajes públicamente</label>
                  <select value={event.showMessagesList?"1":"0"} onChange={e=>updateEvent({showMessagesList:e.target.value==="1"})} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300">
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Los mensajes podrán ser vistos por todos los visitantes.</p>
                  <p className="mt-1 text-xs text-gray-500">Si eliges No, sólo tú podrás verlos.</p>
                </div>
              </div>
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