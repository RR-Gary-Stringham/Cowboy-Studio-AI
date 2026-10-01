import React, { useState } from 'react';
import { SearchCriteria } from '../../types';
import { ChevronDown, Calendar, Users } from 'lucide-react';

interface ProperDateSelectorProps {
  criteria: SearchCriteria;
  onUpdateCriteria: (criteria: SearchCriteria) => void;
  className?: string;
}

/**
 * ProperDateSelector
 * Modeled after the exact architectural date widget from the San Francisco Proper Hotel room page:
 * - Two equal columns for ARRIVAL and DEPARTURE
 * - Giant day number (e.g. 14 / 17) with month in clean all-caps below
 * - Full-width guest selector row
 * - Solid black action button: UPDATE DATES
 */
export const ProperDateSelector: React.FC<ProperDateSelectorProps> = ({
  criteria,
  onUpdateCriteria,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [checkIn, setCheckIn] = useState(criteria.checkIn || '2026-10-14');
  const [checkOut, setCheckOut] = useState(criteria.checkOut || '2026-10-17');
  const [guests, setGuests] = useState(criteria.guests || 2);

  // Helper to extract day and month string
  const parseDateParts = (iso: string) => {
    if (!iso) return { day: '14', month: 'OCTOBER', weekday: 'WED' };
    const [year, monthNum, dayNum] = iso.split('-').map(Number);
    const d = new Date(year, monthNum - 1, dayNum);
    const month = d.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const day = String(dayNum).padStart(2, '0');
    return { day, month, weekday };
  };

  const arrivalParts = parseDateParts(criteria.checkIn);
  const departureParts = parseDateParts(criteria.checkOut);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const [inY, inM, inD] = checkIn.split('-').map(Number);
    const [outY, outM, outD] = checkOut.split('-').map(Number);
    const dIn = new Date(inY, inM - 1, inD);
    const dOut = new Date(outY, outM - 1, outD);
    const diffDays = Math.max(1, Math.round((dOut.getTime() - dIn.getTime()) / (1000 * 60 * 60 * 24)));

    onUpdateCriteria({
      ...criteria,
      checkIn,
      checkOut,
      nights: diffDays,
      guests
    });
    setIsEditing(false);
  };

  return (
    <div className={`w-full max-w-sm ml-auto border border-black text-black bg-white select-none shadow-xs ${className}`}>
      {/* Top 2 Columns: ARRIVAL & DEPARTURE */}
      <div 
        onClick={() => setIsEditing(!isEditing)}
        className="grid grid-cols-2 divide-x divide-black border-b border-black cursor-pointer hover:bg-stone-50 transition-colors"
      >
        {/* Arrival Column */}
        <div className="p-4 sm:p-5 text-center">
          <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#73716D] mb-1 font-semibold">
            ARRIVAL
          </span>
          <span className="block font-display text-4xl sm:text-5xl font-light text-[#1C1917] tracking-tight leading-none my-1">
            {arrivalParts.day}
          </span>
          <span className="block font-sans text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#1C1917] font-medium">
            {arrivalParts.month}
          </span>
        </div>

        {/* Departure Column */}
        <div className="p-4 sm:p-5 text-center">
          <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#73716D] mb-1 font-semibold">
            DEPARTURE
          </span>
          <span className="block font-display text-4xl sm:text-5xl font-light text-[#1C1917] tracking-tight leading-none my-1">
            {departureParts.day}
          </span>
          <span className="block font-sans text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#1C1917] font-medium">
            {departureParts.month}
          </span>
        </div>
      </div>

      {/* Middle Row: GUEST SELECTION */}
      <div 
        onClick={() => setIsEditing(!isEditing)}
        className="px-5 py-3.5 border-b border-black text-center cursor-pointer hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
      >
        <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-[#1C1917] font-medium">
          {criteria.guests} {criteria.guests === 1 ? 'ADULT' : 'ADULTS'}
        </span>
        <span className="text-[11px] text-[#73716D] font-mono">({criteria.nights} NIGHTS)</span>
      </div>

      {/* Interactive Picker Dropdown */}
      {isEditing && (
        <form onSubmit={handleApply} className="p-4 bg-[#FAF9F9] border-b border-black space-y-3 animate-in fade-in duration-150">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#73716D] mb-1">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-white border border-black/40 px-2 py-1.5 text-xs text-black"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#73716D] mb-1">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-white border border-black/40 px-2 py-1.5 text-xs text-black"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#73716D] mb-1">Guests</label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-white border border-black/40 px-2 py-1.5 text-xs text-black"
            >
              <option value={1}>1 ADULT</option>
              <option value={2}>2 ADULTS</option>
              <option value={3}>3 ADULTS</option>
              <option value={4}>4 ADULTS</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-black text-white hover:bg-[#4E332D] py-2 text-[11px] font-woodblock uppercase tracking-widest cursor-pointer transition-colors"
            >
              APPLY DATES
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-2 text-[11px] font-mono uppercase text-[#73716D] hover:text-black cursor-pointer"
            >
              CANCEL
            </button>
          </div>
        </form>
      )}

      {/* Bottom Row: SOLID BLACK ACTION BUTTON */}
      {!isEditing && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="w-full bg-black hover:bg-[#4E332D] text-white py-3.5 text-xs font-woodblock uppercase tracking-[0.2em] transition-colors cursor-pointer block text-center"
        >
          UPDATE DATES
        </button>
      )}
    </div>
  );
};
