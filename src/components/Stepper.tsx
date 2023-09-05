import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export type StepperProps = {
  step: number;
  onPrevClick?: () => void;
  onNextClick?: () => void;
};

export function Stepper({ step, onPrevClick, onNextClick }: StepperProps) {
  return (
    <div className="w-full justify-between pt-6">
      {onPrevClick !== undefined ? (
        <button
          className="flex justify-start"
          disabled={!onPrevClick}
          onClick={onPrevClick || undefined}
        >
          Prev <ChevronLeftIcon />
        </button>
      ) : (
        <div className="flex" />
      )}

      <p className="flex justify-center font-bold">{step.toString()}/3</p>

      {onNextClick !== undefined ? (
        <button
          className="flex justify-end"
          disabled={!onPrevClick}
          onClick={onPrevClick || undefined}
        >
          Next <ChevronRightIcon />
        </button>
      ) : (
        <div className="flex" />
      )}
    </div>
  );
}
