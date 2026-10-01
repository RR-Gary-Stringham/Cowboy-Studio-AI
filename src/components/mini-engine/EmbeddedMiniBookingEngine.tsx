import React, { useState, useEffect } from 'react';
import { RoomType, RateOption, SearchCriteria } from '../../types';
import { ROOMS, RATE_OPTIONS } from '../../data/hotelData';
import { Calendar, Users, Moon, ArrowRight, Check, Sparkles, Clock, AlertCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

export interface MiniEngineProps {
  /**
   * 'room': Displays multiple rates for a single room type
   * 'package': Displays multiple rooms for a single package
   */
  mode: 'room' | 'package';
  /** Target room when mode === 'room' */
  room?: RoomType;
  /** Package key when mode === 'package' */
  packageId?: 'spa-ritual' | 'sunup-breakfast' | 'stay-while';
  packageTitle?: string;
  packageSubtitle?: string;
  packageBadge?: string;
  /** Shared session criteria */
  criteria: SearchCriteria;
  onUpdateCriteria: (newCriteria: SearchCriteria) => void;
  /** Launch into main booking engine */
  onProceedToBooking: (room: RoomType, rate: RateOption, criteria: SearchCriteria) => void;
  className?: string;
}

export const EmbeddedMiniBookingEngine: React.FC<MiniEngineProps> = ({
  mode,
  room = ROOMS[0],
  packageId = 'spa-ritual',
  packageTitle = 'Forest Spa & Cedar Soaking Ritual',
  packageSubtitle = 'Cedar barrel sauna session, botanical soaking kit & private deck fireside tea',
  packageBadge = 'CURATED EXPERIENCE PACKAGE',
  criteria,
  onUpdateCriteria,
  onProceedToBooking,
  className = ''
}) => {
  const [checkIn, setCheckIn] = useState(criteria.checkIn || '2026-10-14');
  const [checkOut, setCheckOut] = useState(criteria.checkOut || '2026-10-17');
  const [nights, setNights] = useState(criteria.nights || 3);
  const [guests, setGuests] = useState(criteria.guests || 2);
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [selectedRateId, setSelectedRateId] = useState<string>('ride-easy');
  const [selectedRoomId, setSelectedRoomId] = useState<string>(room.id);
  const [sessionToast, setSessionToast] = useState<string | null>(null);

  // Sync internal state when external criteria change (e.g. from another page in the same session)
  useEffect(() => {
    setCheckIn(criteria.checkIn);
    setCheckOut(criteria.checkOut);
    setNights(criteria.nights);
    setGuests(criteria.guests);
  }, [criteria.checkIn, criteria.checkOut, criteria.nights, criteria.guests]);

  // Handle date changes and broadcast to session
  const handleApplyDates = (newIn: string, newOut: string, newNights: number, newGuests: number) => {
    const updated: SearchCriteria = {
      ...criteria,
      checkIn: newIn,
      checkOut: newOut,
      nights: newNights,
      guests: newGuests
    };
    onUpdateCriteria(updated);
    setIsEditingDates(false);
    setSessionToast('Dates updated across your session');
    setTimeout(() => setSessionToast(null), 3000);
  };

  const handleNightsPreset = (presetNights: number) => {
    const [year, month, day] = checkIn.split('-').map(Number);
    const start = new Date(year, month - 1, day);
    const end = new Date(start);
    end.setDate(start.getDate() + presetNights);
    const endIso = end.toISOString().split('T')[0];

    setNights(presetNights);
    setCheckOut(endIso);
    handleApplyDates(checkIn, endIso, presetNights, guests);
  };

  const currentSelectedRoom = ROOMS.find((r) => r.id === selectedRoomId) || room;
  const currentSelectedRate = RATE_OPTIONS.find((r) => r.id === selectedRateId) || RATE_OPTIONS[0];

  // Helper date formatter: "Wed, Oct 14"
  const formatDateFriendly = (iso: string) => {
    if (!iso) return '';
    const [year, month, day] = iso.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // =========================================================================
  // USE CASE 1: ROOM TYPE PAGE EMBED (Multiple rates for 1 room)
  // =========================================================================
  if (mode === 'room') {
    return (
      <div className={`bg-[#FAF9F9] border-2 border-[#4E332D] rounded-[24px] 2xl:rounded-[32px] p-6 sm:p-8 2xl:p-10 shadow-lg text-[#221C18] relative ${className}`}>
        
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#4E332D]/15">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0E301A] animate-pulse" />
            <span className="font-woodblock text-xs uppercase tracking-widest text-[#0E301A] font-bold">
              LIVE AVAILABILITY & RATES
            </span>
          </div>
          <span className="font-sans text-xs text-[#73716D]">
            ✦ 2 Suites Left for Selected Dates
          </span>
        </div>

        {/* Compact Date Bar (Natural, Organic, Inline) */}
        <div className="mt-5 p-4 rounded-2xl bg-[#EBE8E0]/70 border border-[#4E332D]/15">
          {!isEditingDates ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs sm:text-sm font-sans">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#9A5636] shrink-0" />
                  <span className="font-bold text-[#1C1917]">
                    {formatDateFriendly(checkIn)} – {formatDateFriendly(checkOut)}
                  </span>
                </div>
                <span className="text-[#4E332D]/30" aria-hidden="true">·</span>
                <div className="flex items-center gap-1.5 text-[#60605E]">
                  <Moon className="w-3.5 h-3.5 text-[#9A5636]" />
                  <span>{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                </div>
                <span className="text-[#4E332D]/30" aria-hidden="true">·</span>
                <div className="flex items-center gap-1.5 text-[#60605E]">
                  <Users className="w-3.5 h-3.5 text-[#9A5636]" />
                  <span>{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingDates(true)}
                className="text-xs font-woodblock uppercase tracking-wider text-[#9A5636] hover:text-[#4E332D] font-bold underline transition-colors cursor-pointer self-start sm:self-auto"
              >
                Change Dates
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#73716D] mb-1 font-bold">
                    Check-in Date:
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-white border border-[#4E332D]/20 rounded-xl px-3 py-2 text-xs font-sans text-[#1C1917]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#73716D] mb-1 font-bold">
                    Check-out Date:
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-white border border-[#4E332D]/20 rounded-xl px-3 py-2 text-xs font-sans text-[#1C1917]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#73716D] mb-1 font-bold">
                    Quick Stay Presets:
                  </label>
                  <div className="flex items-center gap-1 pt-0.5">
                    {[2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => handleNightsPreset(n)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition-colors ${
                          nights === n
                            ? 'bg-[#4E332D] text-white border-[#4E332D]'
                            : 'bg-white text-[#4E332D] border-[#4E332D]/20 hover:bg-[#FAF9F9]'
                        }`}
                      >
                        {n}n
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#73716D] mb-1 font-bold">
                    Guests:
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-white border border-[#4E332D]/20 rounded-xl px-3 py-2 text-xs font-sans text-[#1C1917]"
                  >
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Adults (Rollaway)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#4E332D]/10">
                <button
                  type="button"
                  onClick={() => setIsEditingDates(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-woodblock uppercase tracking-wider text-[#73716D] hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyDates(checkIn, checkOut, nights, guests)}
                  className="bg-[#4E332D] hover:bg-[#221C18] text-white px-4 py-1.5 rounded-lg text-xs font-woodblock uppercase tracking-widest font-bold shadow-xs cursor-pointer"
                >
                  Update & Check Rates
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Rates for this Room */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-brothers text-sm sm:text-base uppercase text-[#4E332D] tracking-wide">
              Select Your Preferred Rate Option:
            </span>
            <span className="text-xs text-[#73716D] font-sans">
              Base Suite Rate: ${room.basePrice}/night
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RATE_OPTIONS.map((rate) => {
              const nightly = Math.round(room.basePrice * rate.rateMultiplier);
              const stayTotal = nightly * nights;
              const isSelected = selectedRateId === rate.id;

              return (
                <div
                  key={rate.id}
                  onClick={() => setSelectedRateId(rate.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#4E332D] bg-[#EBE8E0]/70 shadow-sm ring-1 ring-[#4E332D]'
                      : 'border-[#4E332D]/15 bg-white hover:border-[#4E332D]/35 hover:bg-[#FAF9F9]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-brothers text-sm sm:text-base uppercase text-[#1C1917] font-bold leading-snug">
                        {rate.title}
                      </span>
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-[#0E301A] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-[#4E332D]/30 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] font-woodblock uppercase tracking-wider text-[#9A5636] block mt-1">
                      {rate.cancellationPolicy}
                    </span>
                    <p className="font-uchen text-xs text-[#60605E] mt-1 line-clamp-2">
                      {rate.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#4E332D]/10 flex items-baseline justify-between">
                    <div>
                      <span className="font-bold text-lg sm:text-xl text-[#343833]">
                        ${nightly}
                      </span>
                      <span className="text-[10px] font-mono text-[#73716D] uppercase ml-1">/ night</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#4E332D]">
                      ${stayTotal} total ({nights}n)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary CTA: Launch into Main Booking Engine */}
        <div className="mt-6 pt-5 border-t border-[#4E332D]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-[#73716D] font-sans">
            <span className="font-bold text-[#1C1917]">Ready to confirm: </span>
            <span>{room.name} · {currentSelectedRate.title} (${Math.round(room.basePrice * currentSelectedRate.rateMultiplier) * nights} total)</span>
          </div>

          <button
            type="button"
            onClick={() => onProceedToBooking(room, currentSelectedRate, { ...criteria, checkIn, checkOut, nights, guests })}
            className="w-full sm:w-auto bg-[#4E332D] hover:bg-[#221C18] text-white px-8 py-3.5 rounded-full font-woodblock text-xs sm:text-sm uppercase tracking-widest cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <span>Proceed to Reservation Flow</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Persistent Session Toast */}
        {sessionToast && (
          <div className="absolute top-4 right-4 bg-[#0E301A] text-white px-3.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#F2AAA9]" />
            <span>{sessionToast}</span>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // USE CASE 2 & 3: PACKAGE PAGE EMBED (Multiple rooms for 1 package)
  // =========================================================================
  const packageRateMultiplier = packageId === 'spa-ritual' ? 1.35 : packageId === 'sunup-breakfast' ? 1.14 : 0.80;
  const packageRateObj = RATE_OPTIONS.find((r) => r.id === (packageId === 'sunup-breakfast' ? 'sunup' : packageId === 'stay-while' ? 'stay-while' : 'ride-easy')) || RATE_OPTIONS[0];

  return (
    <div className={`bg-[#FAF9F9] border-2 border-[#4E332D] rounded-[24px] 2xl:rounded-[32px] p-6 sm:p-8 2xl:p-10 shadow-lg text-[#221C18] relative ${className}`}>
      
      {/* Package Header Banner */}
      <div className="pb-5 border-b border-[#4E332D]/15 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="font-woodblock text-xs uppercase tracking-widest text-[#9A5636] font-bold block mb-1">
            {packageBadge}
          </span>
          <h3 className="font-brothers text-xl sm:text-2xl 2xl:text-3xl text-[#1C1917] uppercase tracking-[-0.3px]">
            {packageTitle}
          </h3>
          <p className="font-uchen text-xs sm:text-sm text-[#60605E] mt-1 max-w-xl">
            {packageSubtitle}
          </p>
        </div>

        <div className="bg-[#EBE8E0]/70 px-4 py-2.5 rounded-xl border border-[#4E332D]/15 text-left md:text-right shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#73716D] block">Package Inclusions</span>
          <span className="font-bold text-xs sm:text-sm text-[#0E301A]">✦ Suite + All Spa & Ritual Access</span>
        </div>
      </div>

      {/* Date Bar with Stored Session Memory Banner */}
      <div className="mt-5 p-4 rounded-2xl bg-[#EBE8E0]/70 border border-[#4E332D]/15">
        {!isEditingDates ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-sans">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0E301A]/10 text-[#0E301A] font-mono text-[11px] font-bold">
                <Check className="w-3 h-3" />
                <span>Session Dates Active</span>
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#9A5636] shrink-0" />
                <span className="font-bold text-[#1C1917]">
                  {formatDateFriendly(checkIn)} – {formatDateFriendly(checkOut)}
                </span>
              </div>
              <span className="text-[#4E332D]/30" aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5 text-[#60605E]">
                <Moon className="w-3.5 h-3.5 text-[#9A5636]" />
                <span>{nights} Nights</span>
              </div>
              <span className="text-[#4E332D]/30" aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5 text-[#60605E]">
                <Users className="w-3.5 h-3.5 text-[#9A5636]" />
                <span>{guests} Guests</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingDates(true)}
              className="text-xs font-woodblock uppercase tracking-wider text-[#9A5636] hover:text-[#4E332D] font-bold underline transition-colors cursor-pointer self-start sm:self-auto"
            >
              Adjust Stay Dates
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#73716D] mb-1 font-bold">
                  Check-in Date:
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-white border border-[#4E332D]/20 rounded-xl px-3 py-2 text-xs font-sans text-[#1C1917]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#73716D] mb-1 font-bold">
                  Check-out Date:
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-white border border-[#4E332D]/20 rounded-xl px-3 py-2 text-xs font-sans text-[#1C1917]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#73716D] mb-1 font-bold">
                  Quick Stay Presets:
                </label>
                <div className="flex items-center gap-1 pt-0.5">
                  {[2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleNightsPreset(n)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition-colors ${
                        nights === n
                          ? 'bg-[#4E332D] text-white border-[#4E332D]'
                          : 'bg-white text-[#4E332D] border-[#4E332D]/20 hover:bg-[#FAF9F9]'
                      }`}
                    >
                      {n}n
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#73716D] mb-1 font-bold">
                  Guests:
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-white border border-[#4E332D]/20 rounded-xl px-3 py-2 text-xs font-sans text-[#1C1917]"
                >
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={3}>3 Adults</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#4E332D]/10">
              <button
                type="button"
                onClick={() => setIsEditingDates(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-woodblock uppercase tracking-wider text-[#73716D] hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApplyDates(checkIn, checkOut, nights, guests)}
                className="bg-[#4E332D] hover:bg-[#221C18] text-white px-4 py-1.5 rounded-lg text-xs font-woodblock uppercase tracking-widest font-bold shadow-xs cursor-pointer"
              >
                Save & Update Available Suites
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Package Rates by Suite (Live Rooms Grid) */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-brothers text-sm sm:text-base uppercase text-[#4E332D] tracking-wide">
            Select Your Suite for this Package:
          </span>
          <span className="text-xs text-[#73716D] font-sans">
            Showing all rooms available for {nights} nights
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {ROOMS.slice(0, 4).map((r) => {
            const nightly = Math.round(r.basePrice * packageRateMultiplier);
            const packageTotal = nightly * nights;
            const isSelected = selectedRoomId === r.id;

            return (
              <div
                key={r.id}
                onClick={() => setSelectedRoomId(r.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'border-[#4E332D] bg-[#EBE8E0]/70 shadow-sm ring-1 ring-[#4E332D]'
                    : 'border-[#4E332D]/15 bg-white hover:border-[#4E332D]/35 hover:bg-[#FAF9F9]'
                }`}
              >
                <div>
                  <div className="relative h-28 rounded-xl overflow-hidden mb-2.5 border border-[#4E332D]/15">
                    <img 
                      src={r.images[0]} 
                      alt={r.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute top-2 left-2 bg-[#FAF9F9]/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-woodblock uppercase tracking-wider text-[#4E332D] font-bold">
                      {r.buildingName}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-1">
                    <span className="font-brothers text-sm uppercase text-[#1C1917] font-bold leading-snug">
                      {r.name}
                    </span>
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-[#0E301A] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-[#4E332D]/30 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-[#73716D] font-sans block mt-1">
                    {r.bedType} · {r.squareFeet} sq ft
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#4E332D]/10 flex items-baseline justify-between">
                  <div>
                    <span className="font-bold text-lg text-[#343833]">
                      ${nightly}
                    </span>
                    <span className="text-[10px] font-mono text-[#73716D] uppercase ml-1">/ nt</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#4E332D]">
                    ${packageTotal} stay
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary CTA */}
      <div className="mt-6 pt-5 border-t border-[#4E332D]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs sm:text-sm text-[#73716D] font-sans">
          <span className="font-bold text-[#1C1917]">Selected: </span>
          <span>{packageTitle} in <strong>{currentSelectedRoom.name}</strong> (${Math.round(currentSelectedRoom.basePrice * packageRateMultiplier) * nights} for {nights} nights)</span>
        </div>

        <button
          type="button"
          onClick={() => onProceedToBooking(currentSelectedRoom, packageRateObj, { ...criteria, checkIn, checkOut, nights, guests })}
          className="w-full sm:w-auto bg-[#4E332D] hover:bg-[#221C18] text-white px-8 py-3.5 rounded-full font-woodblock text-xs sm:text-sm uppercase tracking-widest cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
        >
          <span>Reserve Package & Continue</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Persistent Session Toast */}
      {sessionToast && (
        <div className="absolute top-4 right-4 bg-[#0E301A] text-white px-3.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#F2AAA9]" />
          <span>{sessionToast}</span>
        </div>
      )}
    </div>
  );
};
