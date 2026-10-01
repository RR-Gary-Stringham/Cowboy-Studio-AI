import React from 'react';
import { RoomType, RateOption, SearchCriteria } from '../../types';
import { ROOMS, RATE_OPTIONS } from '../../data/hotelData';

interface ProperSuitePackageRowProps {
  packageTitle: string;
  packageMultiplier: number;
  rateOption: RateOption;
  criteria: SearchCriteria;
  onSelectSuiteAndBook: (room: RoomType, rate: RateOption) => void;
  className?: string;
}

/**
 * ProperSuitePackageRow
 * Shows rates BY ROOM TYPE for a specific experience package,
 * styled in the exact clean typographic 3-4 column layout from the Proper Hotel reference.
 */
export const ProperSuitePackageRow: React.FC<ProperSuitePackageRowProps> = ({
  packageTitle,
  packageMultiplier,
  rateOption,
  criteria,
  onSelectSuiteAndBook,
  className = ''
}) => {
  const formatDateSpan = () => {
    if (!criteria.checkIn || !criteria.checkOut) return 'Oct 14 - Oct 17; 2 Adults';
    const [y1, m1, d1] = criteria.checkIn.split('-').map(Number);
    const [y2, m2, d2] = criteria.checkOut.split('-').map(Number);
    const inDate = new Date(y1, m1 - 1, d1);
    const outDate = new Date(y2, m2 - 1, d2);
    const inStr = inDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const outStr = outDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${inStr} - ${outStr}; ${criteria.guests} Adults`;
  };

  const dateSpanText = formatDateSpan();

  return (
    <div className={`w-full border-t border-b border-[#D1C9BE] py-10 my-10 ${className}`}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="font-woodblock text-[11px] uppercase tracking-[0.2em] text-[#9A5636] font-bold block mb-1">
            PACKAGE PRICING BY SUITE
          </span>
          <h3 className="font-display font-light text-2xl uppercase tracking-wide text-[#1C1917]">
            Available Suites for {packageTitle}
          </h3>
        </div>
        <span className="text-xs font-mono text-[#73716D] hidden sm:block">
          All spa & experience inclusions bundled into nightly rate
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 divide-y md:divide-y-0 md:divide-x divide-[#D1C9BE]">
        {ROOMS.slice(0, 3).map((suite, idx) => {
          const nightly = Math.round(suite.basePrice * packageMultiplier);
          const totalStay = nightly * criteria.nights;

          return (
            <div 
              key={suite.id} 
              className={`flex flex-col justify-between ${idx > 0 ? 'md:pl-8 lg:pl-12 pt-6 md:pt-0' : ''}`}
            >
              <div>
                {/* Suite Name */}
                <h4 className="font-woodblock text-xs sm:text-[13px] uppercase tracking-[0.18em] text-[#1C1917] font-bold mb-3">
                  {suite.name}
                </h4>

                {/* Line 1: Bed type & Nightly Rate */}
                <div className="flex items-baseline justify-between text-xs sm:text-[13px] text-[#60605E] pb-1.5 font-sans">
                  <span>{suite.bedType} · {suite.squareFeet} sq ft</span>
                  <span className="font-sans font-medium text-[#1C1917]">
                    ${nightly}.00 / Nightly
                  </span>
                </div>

                {/* Line 2: Date Span & Total Stay (Bold) */}
                <div className="flex items-baseline justify-between text-xs sm:text-[13px] pb-3 border-b border-[#EBE8E0] font-sans">
                  <span className="text-[#73716D]">{dateSpanText}</span>
                  <span className="font-bold text-sm sm:text-base text-[#1C1917]">
                    ${totalStay}.00 Total Stay
                  </span>
                </div>
              </div>

              {/* Line 3: Policy & Solid Black Action Button */}
              <div className="flex items-center justify-between pt-4 mt-2">
                <span className="text-[11px] text-[#73716D] font-mono leading-tight max-w-[160px]">
                  {rateOption.cancellationPolicy}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectSuiteAndBook(suite, rateOption)}
                  className="bg-black hover:bg-[#4E332D] text-white px-7 py-2.5 text-xs font-woodblock uppercase tracking-[0.18em] font-bold transition-colors cursor-pointer shrink-0"
                >
                  BOOK
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
