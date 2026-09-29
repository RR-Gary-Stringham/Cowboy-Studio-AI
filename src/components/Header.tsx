import React from 'react';
import { BookingStep } from '../types';

interface HeaderProps {
  currentStep: BookingStep;
  onStepChange: (step: BookingStep) => void;
  canNavigateToStep: (step: BookingStep) => boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onStepChange,
  canNavigateToStep
}) => {
  const steps = [
    { number: 1, label: 'Stay' },
    { number: 2, label: 'Room' },
    { number: 3, label: 'Details' },
    { number: 4, label: 'Extras' },
    { number: 5, label: 'Pay' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#EBE8E0]/95 backdrop-blur-md border-b border-[#4E332D]/10">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 sm:h-[67px] max-w-[1600px] w-full mx-auto">
          {/* Logo */}
          <button
            onClick={() => onStepChange(1)}
            className="flex items-center group text-left cursor-pointer focus:outline-none py-1"
            aria-label="Cowboy Home"
          >
            <img
              src="/assets/logos/cowboy.svg"
              alt="Cowboy"
              className="h-6 sm:h-7 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03] select-none"
            />
          </button>

          {/* Stepper Progress (Center Desktop) */}
          <nav aria-label="Booking Progress" className="hidden md:flex items-center">
            <div className="flex items-center bg-white/70 p-1.5 rounded-full border border-[#D1C9BE] shadow-xs">
              {steps.map((step, idx) => {
                const isActive = currentStep === step.number;
                const isPast = currentStep > step.number;
                const isClickable = canNavigateToStep(step.number as BookingStep);

                return (
                  <React.Fragment key={step.number}>
                    <button
                      onClick={() => isClickable && onStepChange(step.number as BookingStep)}
                      disabled={!isClickable}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-woodblock tracking-wider uppercase transition-all ${
                        isActive
                          ? 'bg-[#9A5636] text-[#EBE8E0] shadow-xs font-semibold'
                          : isPast
                          ? 'text-[#4E332D] hover:bg-[#EBE8E0]/60 cursor-pointer'
                          : 'text-[#767470] opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-sans font-medium border ${
                          isActive
                            ? 'border-[#EBE8E0] text-[#EBE8E0]'
                            : isPast
                            ? 'border-[#4E332D] text-[#4E332D] bg-[#EBE8E0]/40'
                            : 'border-[#CCC7BB] text-[#767470]'
                        }`}
                      >
                        {step.number}
                      </span>
                      <span>{step.label}</span>
                    </button>

                    {idx < steps.length - 1 && (
                      <span className="mx-1 text-[#CCC7BB] font-serif text-sm select-none">
                        /
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </nav>

          {/* Best Rate Guaranteed Badge */}
          <div className="flex items-center gap-1.5 text-[#4E332D] border-b sm:border-b-0 border-[#4E332D]/20 pb-0.5">
            <img
              src="/assets/badges/sheriff-badge.svg"
              alt="Sheriff Badge"
              className="w-4 h-4 object-contain select-none"
            />
            <span className="font-woodblock text-[11px] sm:text-xs tracking-wider uppercase font-semibold text-[#4E332D]">
              Best Price Guaranteed
            </span>
          </div>
        </div>

        {/* Mobile Stepper Bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-[#4E332D]/10 overflow-x-auto hide-scrollbar">
          {steps.map((step) => {
            const isActive = currentStep === step.number;
            const isClickable = canNavigateToStep(step.number as BookingStep);

            return (
              <button
                key={step.number}
                onClick={() => isClickable && onStepChange(step.number as BookingStep)}
                disabled={!isClickable}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-woodblock uppercase tracking-wider whitespace-nowrap ${
                  isActive
                    ? 'bg-[#9A5636] text-white font-bold'
                    : 'text-[#767470]'
                }`}
              >
                <span>{step.number}.</span>
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
