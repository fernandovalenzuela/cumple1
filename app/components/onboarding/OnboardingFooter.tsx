"use client";
import { Loader2 } from "lucide-react";
interface OnboardingFooterProps{
  preview:boolean;
  loading:boolean;
  nextLabel:string;
  nextDisabled:boolean;
  onPreview:()=>void;
  onNext:()=>void;
}
export default function OnboardingFooter({
  preview,
  loading,
  nextLabel,
  nextDisabled,
  onPreview,
  onNext,
}:OnboardingFooterProps){
  return(
    <div className="sticky bottom-0 z-50 -mx-6 mt-0 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
      {preview?(
        <div className="flex gap-3">
          <button
            type="button"
            className="admin-button admin-button-medium w-full"
            onClick={onPreview}
          >
            Volver a editar
          </button>
        </div>
      ):(
        <div className="flex gap-3">
          <button
            type="button"
            className="admin-button-secondary admin-button-medium flex-1"
            onClick={onPreview}
          >
            Vista previa
          </button>
          <button
            type="button"
            className="admin-button admin-button-medium flex-1"
            disabled={loading||nextDisabled}
            onClick={onNext}
          >
            {loading?(
              <span className="flex items-center justify-center gap-2">
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Guardando...
              </span>
            ):(
              nextLabel
            )}
          </button>
        </div>
      )}
    </div>
  );
}