interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps = 5,
}: StepIndicatorProps) {
  return (
    <section className="mb-8">

      <p className="admin-step text-center">
        Paso {currentStep} de {totalSteps}
      </p>

      <div className="flex items-center gap-2 mt-4">

        {Array.from({ length: totalSteps }).map((_, index) => {

          const active = index < currentStep;

          return (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all ${
                active
                  ? "bg-orange-500"
                  : "bg-gray-200"
              }`}
            />
          );
        })}
      </div>

    </section>
  );
}


