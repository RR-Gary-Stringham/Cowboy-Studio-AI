import React, { useState } from 'react';
import { SearchCriteria } from '../types';
import { Calendar, Users, Tag, ArrowRight, Check, X } from 'lucide-react';

interface SearchBarProps {
  criteria: SearchCriteria;
  onUpdateCriteria: (criteria: SearchCriteria) => void;
  onSearch: () => void;
  compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  criteria,
  onUpdateCriteria,
  onSearch,
  compact = false
}) => {
  const [activeDropdown, setActiveDropdown] = useState<'dates' | 'guests' | 'promo' | null>(null);
  const [promoInput, setPromoInput] = useState(criteria.promoCode || '');
  const [promoApplied, setPromoApplied] = useState(false);

  // Format date helper: "14 Oct 2026"
  const formatDateDisplay = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handleDatesChange = (checkIn: string, checkOut: string) => {
    // Calculate nights
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    onUpdateCriteria({
      ...criteria,
      checkIn,
      checkOut,
      nights
    });
    setActiveDropdown(null);
  };

  const handleApplyPromo = () => {
    if (promoInput.trim()) {
      onUpdateCriteria({ ...criteria, promoCode: promoInput.trim().toUpperCase() });
      setPromoApplied(true);
      setActiveDropdown(null);
    }
  };

  if (compact) {
    return (
      <div className="relative inline-flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full border border-[#D1C9BE] text-[#221C18] text-xs font-woodblock tracking-wider uppercase shadow-xs">
        <span className="font-semibold text-[#4E332D]">
          {formatDateDisplay(criteria.checkIn).slice(0, 6)} - {formatDateDisplay(criteria.checkOut).slice(0, 6)}
        </span>
        <span className="text-[#CCC7BB]">|</span>
        <span className="text-[#6B6259]">
          {criteria.guests} ADULTS · {criteria.rooms} ROOM
        </span>
        {criteria.promoCode && (
          <>
            <span className="text-[#CCC7BB]">|</span>
            <span className="text-[#9A5636] font-bold">CODE: {criteria.promoCode}</span>
          </>
        )}
        <button
          onClick={() => setActiveDropdown(activeDropdown ? null : 'dates')}
          className="ml-2 text-[10px] text-[#9A5636] hover:underline font-serif cursor-pointer underline"
        >
          Change
        </button>

        {/* Quick Dropdown in Compact mode */}
        {activeDropdown && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-[#FAF9F9] border-2 border-[#4E332D] rounded-2xl shadow-xl p-4 z-50 text-left normal-case">
            <div className="flex items-center justify-between pb-2 border-b border-[#D1C9BE]/50 mb-3">
              <span className="font-woodblock text-xs uppercase tracking-wider text-[#4E332D] font-bold">
                Update Dates & Guests
              </span>
              <button
                onClick={() => setActiveDropdown(null)}
                className="text-[#767470] hover:text-[#4E332D]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#4E332D] mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={criteria.checkIn}
                  onChange={(e) => handleDatesChange(e.target.value, criteria.checkOut)}
                  className="w-full border border-[#D1C9BE] rounded-lg px-2.5 py-1.5 bg-white text-[#221C18]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#4E332D] mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={criteria.checkOut}
                  onChange={(e) => handleDatesChange(criteria.checkIn, e.target.value)}
                  className="w-full border border-[#D1C9BE] rounded-lg px-2.5 py-1.5 bg-white text-[#221C18]"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-[#4E332D] mb-1">
                    Guests (21+)
                  </label>
                  <select
                    value={criteria.guests}
                    onChange={(e) =>
                      onUpdateCriteria({ ...criteria, guests: parseInt(e.target.value) })
                    }
                    className="w-full border border-[#D1C9BE] rounded-lg px-2.5 py-1.5 bg-white text-[#221C18]"
                  >
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Adults</option>
                    <option value={4}>4 Adults</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setActiveDropdown(null)}
                className="w-full mt-2 bg-[#4E332D] text-white py-2 rounded-full font-woodblock text-xs uppercase tracking-wider hover:bg-[#343833]"
              >
                Apply Changes
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Outer Pill Container matching Figma */}
      <div className="relative bg-[#FAF9F9] border-2 border-[#4E332D] rounded-full shadow-[0px_4px_12px_rgba(0,0,0,0.08)] p-2 md:p-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-0">
          {/* 1. Property */}
          <div className="flex-1 px-4 py-2 text-left border-b md:border-b-0 md:border-r border-[#EBE8E0]">
            <span className="block font-woodblock text-[10px] uppercase tracking-wider text-[#4E332D]/70 font-semibold">
              PROPERTY
            </span>
            <span className="block font-display font-bold text-sm md:text-base text-[#4E332D] tracking-wider">
              {criteria.property}
            </span>
          </div>

          {/* 2. Check-in */}
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'dates' ? null : 'dates')}
            className="flex-1 px-4 py-2 text-left cursor-pointer hover:bg-[#EBE8E0]/40 rounded-full transition-colors border-b md:border-b-0 md:border-r border-[#EBE8E0]"
          >
            <span className="block font-woodblock text-[10px] uppercase tracking-wider text-[#4E332D]/70 font-semibold">
              CHECK-IN
            </span>
            <span className="block font-serif text-xs md:text-sm text-[#4E332D] font-medium truncate">
              {formatDateDisplay(criteria.checkIn)}
            </span>
          </div>

          {/* 3. Check-out */}
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'dates' ? null : 'dates')}
            className="flex-1 px-4 py-2 text-left cursor-pointer hover:bg-[#EBE8E0]/40 rounded-full transition-colors border-b md:border-b-0 md:border-r border-[#EBE8E0]"
          >
            <span className="block font-woodblock text-[10px] uppercase tracking-wider text-[#4E332D]/70 font-semibold">
              CHECK-OUT
            </span>
            <span className="block font-serif text-xs md:text-sm text-[#4E332D] font-medium truncate">
              {formatDateDisplay(criteria.checkOut)} ({criteria.nights}n)
            </span>
          </div>

          {/* 4. Guests */}
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'guests' ? null : 'guests')}
            className="px-4 py-2 text-left cursor-pointer hover:bg-[#EBE8E0]/40 rounded-full transition-colors border-b md:border-b-0 md:border-r border-[#EBE8E0] min-w-[110px]"
          >
            <span className="block font-woodblock text-[10px] uppercase tracking-wider text-[#4E332D]/70 font-semibold">
              GUESTS
            </span>
            <span className="block font-serif text-xs md:text-sm text-[#4E332D] font-medium">
              {criteria.guests} Adults
            </span>
          </div>

          {/* 5. Promo code */}
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'promo' ? null : 'promo')}
            className="px-4 py-2 text-left cursor-pointer hover:bg-[#EBE8E0]/40 rounded-full transition-colors min-w-[120px]"
          >
            <span className="block font-woodblock text-[10px] uppercase tracking-wider text-[#4E332D]/70 font-semibold">
              PROMO
            </span>
            <span className="block font-serif text-xs md:text-sm text-[#4E332D]/80 truncate">
              {criteria.promoCode ? (
                <span className="text-[#9A5636] font-bold">{criteria.promoCode}</span>
              ) : (
                'add code'
              )}
            </span>
          </div>

          {/* Search CTA Button */}
          <div className="p-1">
            <button
              onClick={onSearch}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#4E332D] hover:bg-[#343833] text-[#FAF9F9] px-6 py-3 rounded-full font-woodblock text-sm uppercase tracking-widest transition-transform active:scale-95 shadow-md cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Dropdown Panels */}
        {activeDropdown === 'dates' && (
          <div className="absolute left-0 right-0 top-full mt-3 bg-[#FAF9F9] border-2 border-[#4E332D] rounded-3xl p-6 shadow-2xl z-50">
            <div className="flex items-center justify-between pb-3 border-b border-[#D1C9BE]">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#9A5636]" />
                <h4 className="font-display font-bold text-base text-[#4E332D] tracking-wide">
                  Select Dates of Stay
                </h4>
              </div>
              <button
                onClick={() => setActiveDropdown(null)}
                className="text-[#767470] hover:text-[#4E332D] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block font-woodblock text-xs uppercase tracking-wider text-[#4E332D] mb-1.5 font-semibold">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={criteria.checkIn}
                  onChange={(e) => handleDatesChange(e.target.value, criteria.checkOut)}
                  className="w-full bg-white border border-[#D1C9BE] rounded-xl px-4 py-2.5 text-[#221C18] focus:outline-none focus:border-[#4E332D]"
                />
              </div>
              <div>
                <label className="block font-woodblock text-xs uppercase tracking-wider text-[#4E332D] mb-1.5 font-semibold">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={criteria.checkOut}
                  onChange={(e) => handleDatesChange(criteria.checkIn, e.target.value)}
                  className="w-full bg-white border border-[#D1C9BE] rounded-xl px-4 py-2.5 text-[#221C18] focus:outline-none focus:border-[#4E332D]"
                />
              </div>
            </div>

            {/* Quick date presets */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#EBE8E0]">
              <span className="font-woodblock text-[11px] text-[#767470] uppercase mr-2">
                Quick Select:
              </span>
              <button
                onClick={() => handleDatesChange('2026-10-14', '2026-10-17')}
                className="text-xs bg-[#EBE8E0] hover:bg-[#D1C9BE] text-[#4E332D] px-3 py-1 rounded-full font-serif"
              >
                Fall Foliage (Oct 14-17)
              </button>
              <button
                onClick={() => handleDatesChange('2027-06-02', '2027-06-05')}
                className="text-xs bg-[#EBE8E0] hover:bg-[#D1C9BE] text-[#4E332D] px-3 py-1 rounded-full font-serif"
              >
                Summer Solstice (Jun 2-5)
              </button>
              <button
                onClick={() => handleDatesChange('2026-11-05', '2026-11-08')}
                className="text-xs bg-[#EBE8E0] hover:bg-[#D1C9BE] text-[#4E332D] px-3 py-1 rounded-full font-serif"
              >
                Cozy Fireside Weekend (Nov 5-8)
              </button>
            </div>
          </div>
        )}

        {activeDropdown === 'guests' && (
          <div className="absolute left-1/4 right-1/4 top-full mt-3 bg-[#FAF9F9] border-2 border-[#4E332D] rounded-3xl p-6 shadow-2xl z-50">
            <div className="flex items-center justify-between pb-3 border-b border-[#D1C9BE]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#9A5636]" />
                <h4 className="font-display font-bold text-base text-[#4E332D] tracking-wide">
                  Guests & Rooms
                </h4>
              </div>
              <button
                onClick={() => setActiveDropdown(null)}
                className="text-[#767470] hover:text-[#4E332D] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-woodblock text-sm uppercase text-[#4E332D] block font-semibold">
                    Adults (Ages 21+)
                  </span>
                  <span className="text-xs text-[#767470]">
                    Urban Cowboy is an adult sanctuary
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      onUpdateCriteria({
                        ...criteria,
                        guests: Math.max(1, criteria.guests - 1)
                      })
                    }
                    className="w-8 h-8 rounded-full border border-[#4E332D] flex items-center justify-center text-sm font-bold text-[#4E332D] hover:bg-[#EBE8E0]"
                  >
                    -
                  </button>
                  <span className="font-display font-bold text-base w-6 text-center text-[#4E332D]">
                    {criteria.guests}
                  </span>
                  <button
                    onClick={() =>
                      onUpdateCriteria({
                        ...criteria,
                        guests: Math.min(4, criteria.guests + 1)
                      })
                    }
                    className="w-8 h-8 rounded-full border border-[#4E332D] flex items-center justify-center text-sm font-bold text-[#4E332D] hover:bg-[#EBE8E0]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EBE8E0]">
                <p className="text-xs text-[#9A5636] italic font-editorial">
                  ✦ Note: Suited for romantic duos or quiet solo explorers.
                </p>
              </div>

              <button
                onClick={() => setActiveDropdown(null)}
                className="w-full bg-[#4E332D] text-white py-2.5 rounded-full font-woodblock text-xs uppercase tracking-wider hover:bg-[#343833]"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {activeDropdown === 'promo' && (
          <div className="absolute right-0 md:right-10 top-full mt-3 w-80 bg-[#FAF9F9] border-2 border-[#4E332D] rounded-3xl p-5 shadow-2xl z-50">
            <div className="flex items-center justify-between pb-2 border-b border-[#D1C9BE]">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#9A5636]" />
                <h4 className="font-display font-bold text-sm text-[#4E332D]">
                  Promotional Code
                </h4>
              </div>
              <button
                onClick={() => setActiveDropdown(null)}
                className="text-[#767470] hover:text-[#4E332D]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3">
              <input
                type="text"
                placeholder="e.g. OUTFIT10 or SOAKAWAY"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="w-full bg-white border border-[#D1C9BE] rounded-xl px-3 py-2 text-sm text-[#4E332D] uppercase tracking-wider mb-2"
              />
              <button
                onClick={handleApplyPromo}
                className="w-full bg-[#4E332D] text-white py-2 rounded-full font-woodblock text-xs uppercase tracking-wider hover:bg-[#343833]"
              >
                Apply Code
              </button>

              <div className="mt-3 text-[11px] text-[#767470]">
                <span>Try promo: </span>
                <button
                  onClick={() => {
                    setPromoInput('OUTFIT10');
                    onUpdateCriteria({ ...criteria, promoCode: 'OUTFIT10' });
                    setPromoApplied(true);
                    setActiveDropdown(null);
                  }}
                  className="font-bold text-[#9A5636] hover:underline"
                >
                  OUTFIT10
                </button>{' '}
                (10% Member Perk)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
