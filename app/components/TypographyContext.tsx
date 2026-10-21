"use client";
import { createContext,useContext } from "react";
export type EventTypography={
  userFontClassName:string;
  bodyFontClassName:string;
  userFontScale:number;
  bodyFontScale:number;
};
export const TypographyContext=createContext<EventTypography|null>(null);
export function useEventTypography(){
  const typography=useContext(TypographyContext);
  if(!typography) throw new Error("useEventTypography must be used inside TypographyContext.Provider");
  return typography;
}