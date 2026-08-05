import { Loader2 } from "lucide-react";

interface FooterActionsProps {
  nextLabel: string;
  loading: boolean;
  disabled: boolean;
  loadingLabel?: string;
  information?:React.ReactNode;
  onNext: () => void;
}

export default function FooterActions({
  nextLabel,
  loading,
  disabled,
  loadingLabel = "Procesando...",
  information,
  onNext,
}: FooterActionsProps) {
    
  return (
    <div className="admin-actions flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {information && (
        <div className="text-sm text-gray-600">
          {information}
        </div>
      )}

      <button
        type="button"
        className="admin-button w-full sm:w-auto"
        disabled={disabled || loading}
        onClick={onNext}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2
              size={18}
              className="animate-spin"
            />
            {loadingLabel}
          </span>
        ) : (
          nextLabel
        )}
      </button>
    </div>
  );
}