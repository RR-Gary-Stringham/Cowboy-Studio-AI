import React, { useState } from 'react';
import { RoomType, RateOption, SearchCriteria } from '../types';
import { RATE_OPTIONS } from '../data/hotelData';
import { getFeaturedReviewForRoom } from '../data/roomReviews';
import {
  AmenityWoodcutIcon,
  WaldenHausWoodcut,
  AlpineHausWoodcut,
  LodgeWoodcut,
  VintageKeyFob
} from './WoodcutArt';
import {
  ArrowLeft,
  Check,
  Info,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface RateSelectionViewProps {
  room: RoomType;
  criteria: SearchCriteria;
  selectedRate: RateOption | null;
  onSelectRate: (rate: RateOption) => void;
  onChangeRoom: () => void;
  onOpenRoomDetails: (room: RoomType) => void;
}

export const RateSelectionView: React.FC<RateSelectionViewProps> = ({
  room,
  criteria,
  selectedRate,
  onSelectRate,
  onChangeRoom,
  onOpenRoomDetails
}) => {
  // Active rate whose details/breakdown are expanded on the right (defaults to selected or first)
  const [activeRateId, setActiveRateId] = useState<string>(selectedRate?.id || 'ride-easy');
  const [showInclusionsMatrix, setShowInclusionsMatrix] = useState<boolean>(false);

  const featuredReview = getFeaturedReviewForRoom(room.id, room.buildingId);
  const activeRate = RATE_OPTIONS.find((r) => r.id === activeRateId) || RATE_OPTIONS[0];

  const calculateNightlyRate = (rate: RateOption) => {
    return Math.round(room.basePrice * rate.rateMultiplier);
  };

  const calculateStayTotal = (rate: RateOption) => {
    const rawNightly = calculateNightlyRate(rate);
    const subtotal = rawNightly * criteria.nights;
    const taxes = Math.round(subtotal * 0.085);
    const resortFee = 25;
    const isHalfDeposit = !rate.isNonRefundable;
    return {
      nightly: rawNightly,
      subtotal,
      taxes,
      resortFee,
      total: subtotal + taxes + resortFee,
      dueToday: isHalfDeposit ? Math.round((subtotal + taxes + resortFee) * 0.5) : subtotal + taxes + resortFee,
      remaining: isHalfDeposit ? Math.round((subtotal + taxes + resortFee) * 0.5) : 0
    };
  };

  const activePricing = calculateStayTotal(activeRate);

  return (
    <div className="w-full texture-linen min-h-screen pb-20">
      {/* Top Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <button
          onClick={onChangeRoom}
          className="inline-flex items-center gap-2 font-woodblock text-xs uppercase tracking-widest text-[#73716D] hover:text-[#4E332D] transition-colors cursor-pointer mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Rooms & Buildings</span>
        </button>
      </div>

      {/* Main Split Screen matching Screenshot 2! */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* ================= LEFT COLUMN: ROOM SPEC, NARRATIVE & AMENITIES ================= */}
          <div className="lg:col-span-6 space-y-8 bg-[#FAF9F9] rounded-[32px] p-6 sm:p-8 border-stitched shadow-md">
            {/* Top Room Header */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EBE8E0] border border-[#4E332D]/30 flex items-center justify-center shrink-0">
                    {room.buildingId === 'alpine' && <AlpineHausWoodcut className="w-8 h-8" />}
                    {room.buildingId === 'walden' && <WaldenHausWoodcut className="w-8 h-8" />}
                    {room.buildingId === 'lodge' && <LodgeWoodcut className="w-8 h-8" />}
                  </div>
                  <span className="font-woodblock text-xs uppercase tracking-widest text-[#9A5636] font-bold">
                    {room.buildingName.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={onChangeRoom}
                  className="font-woodblock text-xs uppercase tracking-wider text-[#4E332D] hover:underline cursor-pointer"
                >
                  Change Suite
                </button>
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#221C18] uppercase tracking-wide leading-tight">
                {room.name}
              </h1>

              <span className="font-woodblock text-xs uppercase tracking-wider text-[#9A5636] font-bold block mt-2 mb-3">
                {room.eyebrow}
              </span>

              <p className="font-editorial text-sm sm:text-base text-[#4E332D]/85 leading-relaxed">
                {room.description}
              </p>
            </div>

            {/* 3-Photo Editorial Masonry Strip (as in Screenshot 2) */}
            <div className="grid grid-cols-3 gap-3">
              {room.images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => onOpenRoomDetails(room)}
                  className="h-32 sm:h-40 rounded-2xl overflow-hidden border border-[#4E332D]/30 shadow-xs cursor-pointer group relative"
                >
                  <img
                    src={imgUrl}
                    alt={`${room.name} ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs font-woodblock uppercase tracking-wider text-[#73716D] pt-1">
              <span>{room.bedType} · {room.squareFeet} Sq Ft</span>
              <button
                onClick={() => onOpenRoomDetails(room)}
                className="text-[#4E332D] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>View Full Photo Gallery & Specs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Verified Guest Review Callout */}
            <div
              onClick={() => onOpenRoomDetails(room)}
              className="p-4 bg-[#EBE8E0]/70 rounded-2xl border border-[#4E332D]/20 shadow-2xs hover:border-[#4E332D]/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[11px] font-woodblock uppercase tracking-wider text-[#9A5636] font-bold mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span>★ 5.0 {featuredReview.site} Review</span>
                  <span className="text-[#73716D] font-normal">· {featuredReview.reviewer} ({featuredReview.date})</span>
                </span>
                <span className="text-[#4E332D] group-hover:underline">Read Review →</span>
              </div>
              <p className="font-editorial italic text-xs sm:text-sm text-[#221C18] line-clamp-2">
                "{featuredReview.quote}"
              </p>
            </div>

            {/* ================= TOP ROOM AMENITIES (Handcrafted Woodcut Icons from features.pdf) ================= */}
            <div className="pt-6 border-t border-[#4E332D]/15">
              <h3 className="font-woodblock text-xs uppercase tracking-[0.25em] text-[#221C18] font-bold text-center sm:text-left mb-8">
                Top Room Amenities
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-10 sm:gap-y-12 text-center">
                {/* 1. King Bed */}
                <div className="flex flex-col items-center text-center group">
                  <div className="h-20 sm:h-24 w-full flex items-center justify-center mb-3">
                    <AmenityWoodcutIcon
                      type="bed"
                      className="h-16 sm:h-20 md:h-22 w-auto max-w-[130px] transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="font-brothers font-bold text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[#221C18] leading-tight max-w-[130px]">
                    {room.bedType.toUpperCase().includes('KING') ? 'KING BED' : room.bedType.toUpperCase()}
                  </span>
                </div>

                {/* 2. Pendleton Wool Robes */}
                <div className="flex flex-col items-center text-center group">
                  <div className="h-20 sm:h-24 w-full flex items-center justify-center mb-3">
                    <AmenityWoodcutIcon
                      type="robes"
                      className="h-16 sm:h-20 md:h-22 w-auto max-w-[110px] transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="font-brothers font-bold text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[#221C18] leading-tight max-w-[130px]">
                    PENDLETON<br />WOOL ROBES
                  </span>
                </div>

                {/* 3. Signature Bath Amenities */}
                <div className="flex flex-col items-center text-center group">
                  <div className="h-20 sm:h-24 w-full flex items-center justify-center mb-3">
                    <AmenityWoodcutIcon
                      type="bath-amenities"
                      className="h-16 sm:h-20 md:h-22 w-auto max-w-[120px] transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="font-brothers font-bold text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[#221C18] leading-tight max-w-[130px]">
                    SIGNATURE<br />BATH AMENITIES
                  </span>
                </div>

                {/* 4. Minibar */}
                <div className="flex flex-col items-center text-center group">
                  <div className="h-20 sm:h-24 w-full flex items-center justify-center mb-3">
                    <AmenityWoodcutIcon
                      type="minibar"
                      className="h-16 sm:h-20 md:h-22 w-auto max-w-[110px] transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="font-brothers font-bold text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[#221C18] leading-tight max-w-[130px]">
                    MINIBAR
                  </span>
                </div>

                {/* 5. Letter-writing Desk */}
                <div className="flex flex-col items-center text-center group">
                  <div className="h-20 sm:h-24 w-full flex items-center justify-center mb-3">
                    <AmenityWoodcutIcon
                      type="desk"
                      className="h-16 sm:h-20 md:h-22 w-auto max-w-[120px] transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="font-brothers font-bold text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[#221C18] leading-tight max-w-[130px]">
                    LETTER<br />WRITING DESK
                  </span>
                </div>

                {/* 6. Radiant Heated Floors */}
                <div className="flex flex-col items-center text-center group">
                  <div className="h-20 sm:h-24 w-full flex items-center justify-center mb-3">
                    <AmenityWoodcutIcon
                      type="radiant"
                      className="h-16 sm:h-20 md:h-22 w-auto max-w-[125px] transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="font-brothers font-bold text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[#221C18] leading-tight max-w-[130px]">
                    RADIANT<br />HEATED FLOORS
                  </span>
                </div>

                {/* 7. Cast Iron Wood Stove */}
                <div className="flex flex-col items-center text-center group">
                  <div className="h-20 sm:h-24 w-full flex items-center justify-center mb-3">
                    <AmenityWoodcutIcon
                      type="stove"
                      className="h-16 sm:h-20 md:h-22 w-auto max-w-[110px] transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="font-brothers font-bold text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[#221C18] leading-tight max-w-[130px]">
                    CAST IRON<br />WOOD STOVE
                  </span>
                </div>

                {/* 8. Soaking Tub */}
                <div className="flex flex-col items-center text-center group">
                  <div className="h-20 sm:h-24 w-full flex items-center justify-center mb-3">
                    <AmenityWoodcutIcon
                      type={room.soakType === 'outdoor-cedar-tub' ? 'cedar-tub' : 'clawfoot-tub'}
                      className="h-16 sm:h-20 md:h-22 w-auto max-w-[130px] transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="font-brothers font-bold text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[#221C18] leading-tight max-w-[130px]">
                    {room.soakType === 'outdoor-cedar-tub' ? (
                      <>OUTDOOR CEDAR<br />SOAKING TUB</>
                    ) : (
                      <>COPPER CLAWFOOT<br />SOAKING TUB</>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: SELECT A RATE (Screenshot 2 right) ================= */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header: SELECT A RATE / DATES */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#4E332D]">
              <div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#221C18] uppercase tracking-[0.2em]">
                  Select a Rate
                </h2>
                <span className="font-woodblock text-xs uppercase tracking-wider text-[#73716D] block mt-0.5">
                  {criteria.checkIn} — {criteria.checkOut} | {criteria.guests} Adults
                </span>
              </div>

              <button
                onClick={() => setShowInclusionsMatrix(!showInclusionsMatrix)}
                className="font-woodblock text-xs uppercase tracking-wider text-[#9A5636] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>{showInclusionsMatrix ? 'Hide Inclusions Table' : 'Compare Inclusions'}</span>
                {showInclusionsMatrix ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Inclusions comparison table if opened */}
            {showInclusionsMatrix && (
              <div className="bg-white rounded-2xl p-5 border border-[#4E332D]/20 shadow-sm text-xs font-sans">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#4E332D]/20 text-[#73716D] font-woodblock uppercase tracking-wider text-[10px]">
                      <th className="pb-2">Rate Option</th>
                      <th className="pb-2">Nightly</th>
                      <th className="pb-2">Breakfast</th>
                      <th className="pb-2">Cancellation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE8E0]">
                    {RATE_OPTIONS.map((r) => (
                      <tr key={r.id} className="text-[#221C18]">
                        <td className="py-2.5 font-bold">{r.title}</td>
                        <td className="py-2.5">${calculateNightlyRate(r)}</td>
                        <td className="py-2.5">{r.isBreakfastIncluded ? '✓ Included' : 'A la carte'}</td>
                        <td className="py-2.5 text-[11px] text-[#73716D]">{r.cancellationPolicy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VERTICAL RATE CARDS ACCORDION & DETAILED BREAKDOWN (Matching Screenshot 2) */}
            <div className="space-y-4">
              {RATE_OPTIONS.map((rate) => {
                const pricing = calculateStayTotal(rate);
                const isSelected = selectedRate?.id === rate.id;
                const isExpanded = activeRateId === rate.id;

                // Specific styling per rate card from design
                if (rate.id === 'ride-easy') {
                  // RIDE EASY (Card 1 in Screenshot 2)
                  return (
                    <div
                      key={rate.id}
                      className={`rounded-3xl border-2 transition-all overflow-hidden ${
                        isExpanded
                          ? 'border-[#4E332D] bg-white shadow-xl'
                          : 'border-[#4E332D]/30 bg-[#FAF9F9] hover:border-[#4E332D]'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <span className="font-woodblock text-[10px] uppercase tracking-widest text-[#D65241] font-bold block mb-1">
                              {rate.eyebrow}
                            </span>
                            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[#221C18] tracking-tight leading-none uppercase">
                              Ride Easy
                            </h3>
                            <span className="font-editorial italic text-sm text-[#4E332D]/80 block mt-1">
                              Keep Your Options Open.
                            </span>
                          </div>

                          <div className="text-right sm:text-right">
                            <span className="font-display font-bold text-3xl text-[#221C18]">
                              ${pricing.nightly}
                            </span>
                            <span className="text-xs text-[#73716D] block font-sans">
                              Nightly · Excl. Taxes
                            </span>
                          </div>
                        </div>

                        {/* Action buttons on card */}
                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#4E332D]/10">
                          <button
                            onClick={() => onSelectRate(rate)}
                            className="bg-[#221C18] hover:bg-[#4E332D] text-white px-6 py-2.5 rounded-full font-woodblock text-xs uppercase tracking-widest cursor-pointer shadow-sm transition-transform active:scale-95"
                          >
                            Book Rate
                          </button>
                          <button
                            onClick={() => setActiveRateId(isExpanded ? '' : rate.id)}
                            className="px-4 py-2 rounded-full border border-[#4E332D]/30 font-woodblock text-xs uppercase tracking-wider text-[#4E332D] hover:bg-[#EBE8E0] cursor-pointer"
                          >
                            {isExpanded ? 'Hide Details' : 'Learn More'}
                          </button>
                          <span className="text-[11px] text-[#0E301A] font-sans font-medium ml-auto hidden sm:block">
                            Free cancellation until 7 days prior
                          </span>
                        </div>

                        {/* EXPANDED PRICE BREAKDOWN PANEL (Screenshot 2 Right Panel) */}
                        {isExpanded && (
                          <div className="mt-6 pt-6 border-t-2 border-dashed border-[#4E332D]/20 bg-[#FAF9F9] -mx-6 -mb-6 p-6">
                            <h4 className="font-woodblock text-xs uppercase tracking-wider text-[#221C18] font-bold mb-2">
                              RIDE EASY. KEEP YOUR OPTIONS OPEN.
                            </h4>
                            <p className="font-editorial text-xs text-[#4E332D]/85 leading-relaxed mb-4">
                              Our standard rate for guests who want a little more freedom around their plans.
                              Plans change. This one gives you room to move, with our most flexible cancellation terms.
                            </p>

                            <div className="bg-white rounded-xl p-4 border border-[#4E332D]/20 space-y-2 text-xs font-sans mb-4">
                              <div className="flex justify-between text-[#73716D]">
                                <span>Free cancellation policy:</span>
                                <span className="font-bold text-[#0E301A]">Full refund up to 7 days prior</span>
                              </div>
                              <div className="flex justify-between text-[#73716D]">
                                <span>Deposit terms:</span>
                                <span className="font-bold text-[#221C18]">50% deposit due today</span>
                              </div>
                              <div className="flex justify-between text-[#73716D]">
                                <span>Remaining balance:</span>
                                <span>Due at check-in</span>
                              </div>
                              <div className="pt-2 border-t border-[#EBE8E0] flex justify-between font-bold text-[#221C18]">
                                <span>Nightly Average Rate (Excl. taxes):</span>
                                <span>${pricing.nightly}</span>
                              </div>
                              <div className="flex justify-between text-[#73716D]">
                                <span>Taxes & Historic Trail Amenity:</span>
                                <span>${pricing.taxes + pricing.resortFee}</span>
                              </div>
                              <div className="pt-2 border-t border-[#4E332D]/20 flex justify-between font-bold text-sm text-[#4E332D]">
                                <span>Total Stay ({criteria.nights} nights):</span>
                                <span className="font-display text-lg">${pricing.total}</span>
                              </div>
                              <div className="flex justify-between text-xs text-[#9A5636] font-semibold pt-1">
                                <span>Due at booking today (50%):</span>
                                <span>${pricing.dueToday}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => onSelectRate(rate)}
                              className="w-full bg-[#4E332D] hover:bg-[#343833] text-white py-3 rounded-full font-woodblock text-xs uppercase tracking-widest cursor-pointer shadow-md"
                            >
                              Confirm Ride Easy Rate (${pricing.nightly}/nt)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                if (rate.id === 'plan-ahead') {
                  // plan ahead. save a little. (Card 2 in Screenshot 2)
                  return (
                    <div
                      key={rate.id}
                      className={`rounded-3xl border-2 transition-all overflow-hidden ${
                        isExpanded
                          ? 'border-[#221C18] bg-[#F4F4F2] shadow-xl'
                          : 'border-[#D1C9BE] bg-[#F7F7F5] hover:border-[#4E332D]'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <span className="font-woodblock text-[10px] uppercase tracking-widest text-[#73716D] font-bold block mb-1">
                              {rate.eyebrow}
                            </span>
                            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[#221C18] tracking-tight leading-none lowercase">
                              plan ahead. save a little.
                            </h3>
                          </div>

                          <div className="text-right">
                            <span className="font-display font-bold text-3xl text-[#221C18]">
                              ${pricing.nightly}
                            </span>
                            <span className="text-xs text-[#73716D] block font-sans">
                              Nightly · Excl. Taxes
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#4E332D]/10">
                          <button
                            onClick={() => onSelectRate(rate)}
                            className="bg-[#221C18] hover:bg-[#4E332D] text-white px-6 py-2.5 rounded-full font-woodblock text-xs uppercase tracking-widest cursor-pointer"
                          >
                            Commit to the Cowboy
                          </button>
                          <button
                            onClick={() => setActiveRateId(isExpanded ? '' : rate.id)}
                            className="px-4 py-2 rounded-full border border-[#4E332D]/30 font-woodblock text-xs uppercase tracking-wider text-[#4E332D] hover:bg-[#EBE8E0] cursor-pointer"
                          >
                            {isExpanded ? 'Hide' : 'Details'}
                          </button>
                          <span className="text-[11px] text-[#8A7E74] font-sans ml-auto">
                            Full Prepay · Non-Refundable
                          </span>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-[#4E332D]/10 text-xs font-sans space-y-2">
                            <p className="text-[#6B6259]">
                              Lock in our best rate when you know your travel dates. Requires 100% deposit
                              at booking. Non-refundable and non-changeable.
                            </p>
                            <div className="flex justify-between font-bold text-[#221C18] pt-2">
                              <span>Total Stay Due Today:</span>
                              <span className="font-display text-base">${pricing.total}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                if (rate.id === 'sunup') {
                  // SUNUP BEFORE THE TRAIL (Terracotta card)
                  return (
                    <div
                      key={rate.id}
                      className={`rounded-3xl border-2 transition-all overflow-hidden ${
                        isExpanded
                          ? 'border-[#9A5636] bg-[#FAF9F9] shadow-xl'
                          : 'border-[#9A5636]/40 bg-[#EBE8E0]/40 hover:border-[#9A5636]'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <span className="font-woodblock text-[10px] uppercase tracking-widest text-[#9A5636] font-bold block mb-1">
                              {rate.eyebrow}
                            </span>
                            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#4E332D] tracking-tight leading-none uppercase">
                              Sunup Before the Trail
                            </h3>
                            <span className="font-editorial italic text-xs text-[#9A5636] block mt-1">
                              Room + Farm-to-Table Breakfast for Two
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-display font-bold text-3xl text-[#4E332D]">
                              ${pricing.nightly}
                            </span>
                            <span className="text-xs text-[#73716D] block font-sans">
                              Nightly · Excl. Taxes
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#4E332D]/10">
                          <button
                            onClick={() => onSelectRate(rate)}
                            className="bg-[#9A5636] hover:bg-[#783224] text-white px-6 py-2.5 rounded-full font-woodblock text-xs uppercase tracking-widest cursor-pointer"
                          >
                            Book Room + Sunup
                          </button>
                          <button
                            onClick={() => setActiveRateId(isExpanded ? '' : rate.id)}
                            className="px-4 py-2 rounded-full border border-[#4E332D]/30 font-woodblock text-xs uppercase tracking-wider text-[#4E332D] hover:bg-[#EBE8E0] cursor-pointer"
                          >
                            {isExpanded ? 'Hide' : 'Details'}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-[#9A5636]/20 text-xs font-sans space-y-2">
                            <p className="text-[#6B6259]">
                              Daily hot breakfast in the dining parlor with farm eggs, sourdough, mountain
                              berries, and fresh pour-over coffee.
                            </p>
                            <div className="flex justify-between font-bold text-[#4E332D] pt-2">
                              <span>Total Stay Including Breakfast:</span>
                              <span className="font-display text-base">${pricing.total}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                if (rate.id === 'stay-while') {
                  // STAY A WHILE & UNCLINCH (Dark Charcoal Card)
                  return (
                    <div
                      key={rate.id}
                      className="rounded-3xl border-2 border-black bg-[#221C18] text-[#EBE8E0] p-6 shadow-lg"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                          <span className="font-woodblock text-[10px] uppercase tracking-widest text-[#F2AAA9] font-bold block mb-1">
                            {rate.eyebrow}
                          </span>
                          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-none uppercase">
                            Stay a While & Unclinch
                          </h3>
                          <span className="font-editorial italic text-xs text-[#EBE8E0]/70 block mt-1">
                            Includes $75 Dining Parlor Credit & Estonian Sauna Session
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-display font-bold text-3xl text-white">
                            ${pricing.nightly}
                          </span>
                          <span className="text-xs text-[#EBE8E0]/60 block font-sans">
                            Nightly · Excl. Taxes
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/15">
                        <button
                          onClick={() => onSelectRate(rate)}
                          className="bg-[#EBE8E0] hover:bg-white text-[#221C18] px-6 py-2.5 rounded-full font-woodblock text-xs uppercase tracking-widest cursor-pointer font-bold"
                        >
                          Book Extended Stay
                        </button>
                        <span className="text-[11px] text-[#F2AAA9] font-sans ml-auto">
                          Requires 5+ Nights Stay
                        </span>
                      </div>
                    </div>
                  );
                }

                // Member rate (WELCOME TO THE OUTFIT)
                return (
                  <div
                    key={rate.id}
                    className="rounded-3xl border-2 border-[#0E301A] bg-[#0E301A] text-[#EBE8E0] p-6 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <span className="font-woodblock text-[10px] uppercase tracking-widest text-[#F2AAA9] font-bold block mb-1">
                          COWBOY OUTFIT MEMBER RATE
                        </span>
                        <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F2AAA9] tracking-tight leading-none uppercase">
                          Welcome to the Outfit.
                        </h3>
                        <span className="font-editorial italic text-xs text-[#EBE8E0]/80 block mt-1">
                          A better rate, straight from Cowboy.
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-display font-bold text-3xl text-[#F2AAA9]">
                          ${pricing.nightly}
                        </span>
                        <span className="text-xs text-[#EBE8E0]/60 block font-sans">
                          Nightly · Member Price
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/15">
                      <button
                        onClick={() => onSelectRate(rate)}
                        className="bg-[#F2AAA9] hover:bg-[#fcd3d2] text-[#0E301A] px-6 py-2.5 rounded-full font-woodblock text-xs uppercase tracking-widest cursor-pointer font-bold"
                      >
                        Apply Member Rate
                      </button>
                      <span className="text-[11px] text-[#EBE8E0]/70 font-sans ml-auto">
                        Instant Member Unlock
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
