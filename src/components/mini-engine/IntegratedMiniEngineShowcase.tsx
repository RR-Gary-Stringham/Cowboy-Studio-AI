import React, { useState } from 'react';
import { RoomType, RateOption, SearchCriteria } from '../../types';
import { ROOMS, RATE_OPTIONS } from '../../data/hotelData';
import { ProperDateSelector } from './ProperDateSelector';
import { ProperRatesRow } from './ProperRatesRow';
import { ProperSuitePackageRow } from './ProperSuitePackageRow';
import { Plus, Minus, ArrowRight, Check, Sparkles, ChevronDown, Instagram, Mail, Phone, MapPin } from 'lucide-react';

interface IntegratedMiniEngineShowcaseProps {
  sessionCriteria: SearchCriteria;
  onUpdateSessionCriteria: (newCriteria: SearchCriteria) => void;
  onLaunchMainBooking: (room: RoomType, rate: RateOption, criteria: SearchCriteria) => void;
  onSwitchToFullBookingFlow: () => void;
}

export const IntegratedMiniEngineShowcase: React.FC<IntegratedMiniEngineShowcaseProps> = ({
  sessionCriteria,
  onUpdateSessionCriteria,
  onLaunchMainBooking,
  onSwitchToFullBookingFlow
}) => {
  const [activeTab, setActiveTab] = useState<'suite-page' | 'spa-page' | 'breakfast-page'>('suite-page');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);

  // Selected suite for Suite Page (Alpine Bathing Suite with Den)
  const currentSuite = ROOMS[0];

  const handleBookRate = (room: RoomType, rate: RateOption) => {
    onLaunchMainBooking(room, rate, sessionCriteria);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#1C1917] font-sans antialiased selection:bg-[#4E332D] selection:text-white">
      
      {/* ================= SIMULATION MODE SWITCHER BAR ================= */}
      <div className="bg-[#1C1917] text-white py-2 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0E301A] border border-white/40" />
          <span className="uppercase tracking-wider text-white/90">
            Hotel Website Simulation · Organic Rates Inline Pattern
          </span>
        </div>

        {/* 3 Page Switcher Pills */}
        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-full">
          <button
            type="button"
            onClick={() => setActiveTab('suite-page')}
            className={`px-3 py-1 rounded-full text-[11px] font-sans uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'suite-page' ? 'bg-white text-black font-bold' : 'text-white/70 hover:text-white'
            }`}
          >
            1. Room Page
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('spa-page')}
            className={`px-3 py-1 rounded-full text-[11px] font-sans uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'spa-page' ? 'bg-white text-black font-bold' : 'text-white/70 hover:text-white'
            }`}
          >
            2. Spa Package Page
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('breakfast-page')}
            className={`px-3 py-1 rounded-full text-[11px] font-sans uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'breakfast-page' ? 'bg-white text-black font-bold' : 'text-white/70 hover:text-white'
            }`}
          >
            3. Breakfast Package Page
          </button>
        </div>

        <button
          type="button"
          onClick={onSwitchToFullBookingFlow}
          className="text-[11px] text-[#D1C9BE] hover:text-white uppercase tracking-wider underline cursor-pointer"
        >
          Open Main Booking Flow →
        </button>
      </div>

      {/* ================= PROPER-STYLE LUXURY HEADER ================= */}
      <header className="border-b border-[#D1C9BE] bg-white sticky top-0 z-30">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          
          {/* Left Brand Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-woodblock uppercase tracking-[0.2em] text-[#1C1917]">
            <a href="#stay" className="hover:text-[#9A5636] transition-colors">HOTEL</a>
            <a href="#suites" className="hover:text-[#9A5636] transition-colors font-bold underline underline-offset-8">STAY</a>
            <a href="#offers" className="hover:text-[#9A5636] transition-colors">OFFERS</a>
            <a href="#eat-drink" className="hover:text-[#9A5636] transition-colors">EAT & DRINK</a>
            <a href="#amenities" className="hover:text-[#9A5636] transition-colors">AMENITIES</a>
          </nav>

          {/* Center Brand Logo (Proper / Cowboy Heritage) */}
          <div className="text-center">
            <span className="font-woodblock text-lg sm:text-2xl tracking-[0.28em] text-[#1C1917] font-bold block">
              URBAN COWBOY
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#73716D] block">
              CATSKILLS LODGE
            </span>
          </div>

          {/* Right Reserve Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onSwitchToFullBookingFlow}
              className="bg-black text-white hover:bg-[#4E332D] px-6 py-2.5 text-[11px] font-woodblock uppercase tracking-[0.22em] transition-colors cursor-pointer"
            >
              RESERVE
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. ROOM PAGE (EXACT PROPER HOTEL REFERENCE PATTERN)                       */}
      {/* ========================================================================= */}
      {activeTab === 'suite-page' && (
        <main className="w-full">
          
          {/* Full-width Hero Banner with Centered Title */}
          <div className="relative w-full h-[65vh] sm:h-[75vh] max-h-[800px] overflow-hidden bg-black">
            <img
              src={currentSuite.images[0]}
              alt={currentSuite.name}
              className="w-full h-full object-cover opacity-90 transition-transform duration-1000 scale-[1.01]"
            />
            
            {/* Centered Overlay Title (Exact Proper Hotel Style) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/20">
              <h1 className="font-display font-normal text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-[0.16em] max-w-4xl drop-shadow-sm">
                {currentSuite.name}
              </h1>
              <span className="font-woodblock text-xs sm:text-sm text-white/90 uppercase tracking-[0.3em] mt-3">
                URBAN COWBOY CATSKILLS
              </span>
            </div>

            {/* Exclusive Offer Pill */}
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 bg-black text-white px-4 py-2 text-[10px] sm:text-[11px] font-woodblock uppercase tracking-[0.2em]">
              EXCLUSIVE OFFER ✕
            </div>
          </div>

          {/* Content Container (Standard 1400px baseline) */}
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-14 lg:py-20">
            
            {/* Top Section: Room Intro (Left) & Architectural Date Selector (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-12">
              
              {/* Left Column: Room Narrative & Specs (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="font-display font-light text-2xl sm:text-3xl text-[#1C1917] uppercase tracking-[0.12em]">
                  {currentSuite.name}
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#60605E] leading-relaxed max-w-2xl">
                  {currentSuite.description} Built into the hillside above the Lodge, this suite features a hand-hammered copper soaking tub and built-in chaise den by the crackling cast-iron stove.
                </p>
                
                <div className="pt-2 text-xs sm:text-sm text-[#73716D] font-sans">
                  <span>{currentSuite.squareFeet} square feet* | {Math.round(currentSuite.squareFeet * 0.0929)} square meters*</span>
                  <p className="text-[11px] text-[#A0988E] mt-1 font-sans italic">
                    *Room dimensions and architectural fixtures are approximate; actual layout is individually crafted.
                  </p>
                </div>

                {/* Additional Details Accordion */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
                    className="flex items-center gap-2 text-xs font-woodblock uppercase tracking-[0.2em] text-[#1C1917] hover:text-[#9A5636] cursor-pointer"
                  >
                    <span>ADDITIONAL DETAILS</span>
                    {showAdditionalDetails ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>

                  {showAdditionalDetails && (
                    <div className="mt-3 p-4 bg-[#FAF9F9] border border-[#D1C9BE] text-xs text-[#60605E] space-y-1.5 animate-in fade-in">
                      <div><strong>Bed:</strong> {currentSuite.bedType}</div>
                      <div><strong>Occupancy:</strong> Up to {currentSuite.maxGuests} Guests (21+ only)</div>
                      <div><strong>Bath:</strong> Freestanding Copper Tub + Walk-in Rain Shower</div>
                      <div><strong>Sound:</strong> Custom Marshall Bluetooth Speaker + Turntable</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Exact Proper Hotel Date Selector (5 cols) */}
              <div className="lg:col-span-5">
                <ProperDateSelector
                  criteria={sessionCriteria}
                  onUpdateCriteria={onUpdateSessionCriteria}
                />
              </div>

            </div>

            {/* ================= EDITORIAL STORY ROW 1: THE BED & DEN ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-stretch">
              <div className="bg-[#FAF9F9] p-8 sm:p-12 flex flex-col justify-center border border-[#EBE8E0]">
                <h3 className="font-woodblock text-sm uppercase tracking-[0.2em] text-[#1C1917] font-bold mb-3">
                  THE BED & CHAISE DEN
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#60605E] leading-relaxed">
                  A Catskill night's rest is paramount. We've sourced plush California Aireloom mattresses paired with crisp Bellino fine linens, layered against rustic hand-hewn cedar walls and heavy custom Pendleton blankets.
                </p>
              </div>

              <div className="h-72 sm:h-96 overflow-hidden">
                <img
                  src={currentSuite.images[1] || currentSuite.images[0]}
                  alt="The Bed"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* ================= THE RATES SECTION (ORGANIC INLINE GRID) ================= */}
            {/* Notice how this sits directly on the page, feeling 100% natural and part of the editorial content! */}
            <ProperRatesRow
              room={currentSuite}
              criteria={sessionCriteria}
              onSelectRateAndBook={handleBookRate}
            />

            {/* ================= EDITORIAL STORY ROW 2: THE BATH ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-stretch">
              <div className="h-72 sm:h-96 overflow-hidden order-2 md:order-1">
                <img
                  src={currentSuite.images[2] || currentSuite.images[0]}
                  alt="The Bath"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-[#FAF9F9] p-8 sm:p-12 flex flex-col justify-center border border-[#EBE8E0] order-1 md:order-2">
                <h3 className="font-woodblock text-sm uppercase tracking-[0.2em] text-[#1C1917] font-bold mb-3">
                  THE SOAKING BATH
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#60605E] leading-relaxed">
                  Our iconic bathing suites pair freestanding copper and clawfoot soaking tubs positioned directly before panoramic picture windows. Enjoy walk-in tiled showers, Aesop botanical bath products, and plush waffle robes.
                </p>
              </div>
            </div>

            {/* ================= EDITORIAL STORY ROW 3: TECHNOLOGY & HEARTH ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-stretch">
              <div className="bg-[#FAF9F9] p-8 sm:p-12 flex flex-col justify-center border border-[#EBE8E0]">
                <h3 className="font-woodblock text-sm uppercase tracking-[0.2em] text-[#1C1917] font-bold mb-3">
                  CAST-IRON HEARTH & SOUND
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#60605E] leading-relaxed">
                  Blazing fast complimentary fiber Wi-Fi, Marshall Bluetooth speaker, and an authentic wood-burning cast iron stove with firewood replenished daily by our grounds team.
                </p>
              </div>

              <div className="h-72 sm:h-96 overflow-hidden">
                <img
                  src={currentSuite.images[0]}
                  alt="The Hearth"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* ================= FEATURED RECOMMENDATION ================= */}
            <div className="relative my-16 bg-black text-white overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-8 h-80 sm:h-96 overflow-hidden">
                <img
                  src={ROOMS[1].images[0]}
                  alt="The Penthouse"
                  className="w-full h-full object-cover opacity-85"
                />
              </div>

              <div className="lg:col-span-4 p-8 sm:p-12 space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#73716D]">
                  YOU MAY ALSO LIKE
                </span>
                <h3 className="font-display font-normal text-2xl uppercase tracking-wider text-white">
                  ALPINE PENTHOUSE SUITE
                </h3>
                <p className="font-sans text-xs text-[#A0988E] leading-relaxed">
                  Up where the rooftops meet the mountain. Cathedral ceilings, private cedar deck, and copper clawfoot tub by the fireplace.
                </p>
                <button
                  type="button"
                  onClick={onSwitchToFullBookingFlow}
                  className="inline-flex items-center gap-1.5 text-xs font-woodblock uppercase tracking-[0.2em] text-white hover:text-[#9A5636] pt-2 cursor-pointer"
                >
                  <span>EXPLORE SUITE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ================= FAQ ACCORDION ================= */}
            <div className="my-16 max-w-4xl mx-auto">
              <h3 className="font-woodblock text-sm uppercase tracking-[0.2em] text-center text-[#1C1917] mb-8 font-bold">
                FAQ
              </h3>

              <div className="divide-y divide-[#D1C9BE] border-t border-b border-[#D1C9BE]">
                {[
                  {
                    q: 'WHAT IS THE CHECK-IN AND CHECK-OUT TIME FOR THE ALPINE SUITE?',
                    a: 'Check-in begins at 4:00 PM. Check-out is at 11:00 AM. Early check-in or late check-out can be coordinated with the front desk based on availability.'
                  },
                  {
                    q: 'IS THE ALPINE BATHING SUITE WITH DEN DOG-FRIENDLY?',
                    a: 'Yes! This suite is designated dog-friendly. We provide a plush dog bed, ceramic water bowl, and house-made treats upon arrival.'
                  },
                  {
                    q: 'WHAT IS INCLUDED IN THE NIGHTLY RESORT AMENITY FEE?',
                    a: 'Access to property hiking trails along Esopus Creek, evening campfire gatherings with s’mores, red cedar barrel sauna sessions, and morning pour-over coffee.'
                  },
                  {
                    q: 'CAN WE ARRANGE FRESH FLOWERS OR CELEBRATION CAKES PRIOR TO ARRIVAL?',
                    a: 'Yes. Once you select a rate, our bespoke add-ons step allows you to schedule in-room flowers, cakes with handwritten notes, and chilled wine waiting upon arrival.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="py-4">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between text-left text-xs font-woodblock uppercase tracking-[0.16em] text-[#1C1917] hover:text-[#9A5636] cursor-pointer py-1"
                    >
                      <span>{item.q}</span>
                      {openFaq === idx ? <Minus className="w-4 h-4 shrink-0" /> : <Plus className="w-4 h-4 shrink-0" />}
                    </button>
                    {openFaq === idx && (
                      <p className="mt-2 text-xs sm:text-sm text-[#60605E] font-sans leading-relaxed pb-2 animate-in fade-in">
                        {item.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 2. SPA PACKAGE PAGE (ORGANIC SUITE RATES FOR THE EXPERIENCE)              */}
      {/* ========================================================================= */}
      {activeTab === 'spa-page' && (
        <main className="w-full">
          {/* Full-width Hero Banner */}
          <div className="relative w-full h-[65vh] sm:h-[75vh] max-h-[800px] overflow-hidden bg-black">
            <img
              src={ROOMS[1].images[0]}
              alt="Forest Spa Soaking"
              className="w-full h-full object-cover opacity-90 transition-transform duration-1000 scale-[1.01]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/30">
              <h1 className="font-display font-normal text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-[0.16em] max-w-4xl drop-shadow-sm">
                FOREST SPA & CEDAR SAUNA
              </h1>
              <span className="font-woodblock text-xs sm:text-sm text-white/90 uppercase tracking-[0.3em] mt-3">
                CATSKILL MOUNTAIN RITUAL PACKAGE
              </span>
            </div>
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 bg-black text-white px-4 py-2 text-[10px] sm:text-[11px] font-woodblock uppercase tracking-[0.2em]">
              WELLNESS PACKAGE ✕
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-14 lg:py-20">
            {/* Top Narrative & Date Selector with Session Memory */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-12">
              <div className="lg:col-span-7 space-y-4">
                <h2 className="font-display font-light text-2xl sm:text-3xl text-[#1C1917] uppercase tracking-[0.12em]">
                  THE SOAKING & SAUNA RETREAT
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#60605E] leading-relaxed max-w-2xl">
                  Slip away into the hemlock groves. This curated package bundles your private suite with a 90-minute red cedar barrel sauna session by Esopus Creek, botanical herbal soak kit, and private deck tea service.
                </p>
                <div className="pt-2 text-xs font-mono text-[#0E301A] font-bold">
                  ✦ Session Dates Remembered · Oct 14 - Oct 17 ({sessionCriteria.nights} Nights)
                </div>
              </div>

              <div className="lg:col-span-5">
                <ProperDateSelector
                  criteria={sessionCriteria}
                  onUpdateCriteria={onUpdateSessionCriteria}
                />
              </div>
            </div>

            {/* Organic Suite Package Rates Row */}
            <ProperSuitePackageRow
              packageTitle="Forest Spa & Cedar Soaking Ritual"
              packageMultiplier={1.35}
              rateOption={RATE_OPTIONS[0]}
              criteria={sessionCriteria}
              onSelectSuiteAndBook={handleBookRate}
            />

            {/* Alternating Story Rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-stretch">
              <div className="bg-[#FAF9F9] p-8 sm:p-12 flex flex-col justify-center border border-[#EBE8E0]">
                <h3 className="font-woodblock text-sm uppercase tracking-[0.2em] text-[#1C1917] font-bold mb-3">
                  RED CEDAR BARREL SAUNAS
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#60605E] leading-relaxed">
                  Handcrafted from western red cedar, our outdoor wood-fired barrel saunas nestle quietly along the banks of the creek. Eucalyptus aromatherapy water is provided for deep respiratory relaxation.
                </p>
              </div>
              <div className="h-72 sm:h-96 overflow-hidden">
                <img src={ROOMS[2].images[0]} alt="Sauna" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 3. BREAKFAST PACKAGE PAGE (CROSS-PAGE SESSION MEMORY)                    */}
      {/* ========================================================================= */}
      {activeTab === 'breakfast-page' && (
        <main className="w-full">
          {/* Full-width Hero Banner */}
          <div className="relative w-full h-[65vh] sm:h-[75vh] max-h-[800px] overflow-hidden bg-black">
            <img
              src={ROOMS[2].images[0]}
              alt="Dining Parlor"
              className="w-full h-full object-cover opacity-90 transition-transform duration-1000 scale-[1.01]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/30">
              <h1 className="font-display font-normal text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-[0.16em] max-w-4xl drop-shadow-sm">
                SUNUP BEFORE THE TRAIL
              </h1>
              <span className="font-woodblock text-xs sm:text-sm text-white/90 uppercase tracking-[0.3em] mt-3">
                ROOM & FARM-TO-TABLE BREAKFAST PACKAGE
              </span>
            </div>
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 bg-black text-white px-4 py-2 text-[10px] sm:text-[11px] font-woodblock uppercase tracking-[0.2em]">
              CULINARY PACKAGE ✕
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-14 lg:py-20">
            {/* Top Narrative & Date Selector with Session Memory */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-12">
              <div className="lg:col-span-7 space-y-4">
                <h2 className="font-display font-light text-2xl sm:text-3xl text-[#1C1917] uppercase tracking-[0.12em]">
                  START SLOW. EAT WELL.
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#60605E] leading-relaxed max-w-2xl">
                  Daily breakfast for two at The Dining Parlor wrapped into your stay. Enjoy house sourdough, pasture-raised eggs, hot Chemex pour-over coffee, and packed trail provisions.
                </p>
                <div className="pt-2 text-xs font-mono text-[#0E301A] font-bold">
                  ✦ Session Search Synced · Rates Calculated for {sessionCriteria.nights} Nights
                </div>
              </div>

              <div className="lg:col-span-5">
                <ProperDateSelector
                  criteria={sessionCriteria}
                  onUpdateCriteria={onUpdateSessionCriteria}
                />
              </div>
            </div>

            {/* Organic Suite Package Rates Row */}
            <ProperSuitePackageRow
              packageTitle="Sunup Before The Trail (Breakfast Included)"
              packageMultiplier={1.14}
              rateOption={RATE_OPTIONS[1]}
              criteria={sessionCriteria}
              onSelectSuiteAndBook={handleBookRate}
            />

            {/* Alternating Story Rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-stretch">
              <div className="bg-[#FAF9F9] p-8 sm:p-12 flex flex-col justify-center border border-[#EBE8E0]">
                <h3 className="font-woodblock text-sm uppercase tracking-[0.2em] text-[#1C1917] font-bold mb-3">
                  THE DINING PARLOR
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#60605E] leading-relaxed">
                  Located in the historic 1800s timber Lodge, breakfast is cooked over our cast iron range. Sourced directly from neighboring Catskill and Hudson Valley growers.
                </p>
              </div>
              <div className="h-72 sm:h-96 overflow-hidden">
                <img src={ROOMS[0].images[0]} alt="Dining" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ================= INSTAGRAM SOCIAL GRID ================= */}
      <section className="border-t border-[#D1C9BE] py-14 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#73716D]">
              FOLLOW ALONG
            </span>
            <h4 className="font-woodblock text-sm sm:text-base uppercase tracking-[0.2em] text-[#1C1917] font-bold mt-1">
              @URBANCOWBOYHOTELS
            </h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ROOMS.slice(0, 4).map((r, i) => (
              <div key={i} className="aspect-square overflow-hidden group cursor-pointer border border-[#EBE8E0]">
                <img
                  src={r.images[0]}
                  alt={`Instagram ${i}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SIGN UP FOR EXCLUSIVE OFFERS ================= */}
      <section className="bg-[#F5F2EB] py-16 border-t border-[#D1C9BE]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-md space-y-1">
            <h4 className="font-woodblock text-sm sm:text-base uppercase tracking-[0.18em] text-[#1C1917] font-bold">
              SIGN UP FOR EXCLUSIVE OFFERS
            </h4>
            <p className="font-sans text-xs text-[#73716D]">
              By signing up, you agree to our Terms of Service and Privacy Policy. You may unsubscribe at any time.
            </p>
          </div>

          <div className="flex w-full max-w-md items-center gap-2">
            <input
              type="email"
              placeholder="Email Address..."
              className="flex-1 bg-white border border-[#D1C9BE] px-4 py-3 text-xs text-black focus:outline-none"
            />
            <button
              type="button"
              className="bg-black hover:bg-[#4E332D] text-white px-7 py-3 text-xs font-woodblock uppercase tracking-[0.2em] font-bold cursor-pointer transition-colors shrink-0"
            >
              SUBMIT
            </button>
          </div>
        </div>
      </section>

      {/* ================= PROPER-STYLE BRAND FOOTER ================= */}
      <footer className="bg-white py-12 border-t border-[#D1C9BE] text-xs font-sans text-[#73716D]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-start justify-between gap-8">
          <div>
            <span className="font-woodblock text-sm uppercase tracking-[0.2em] text-[#1C1917] font-bold block mb-2">
              URBAN COWBOY CATSKILLS
            </span>
            <p className="text-xs leading-relaxed text-[#60605E]">
              378 The Drive<br />
              Big Indian, NY 12410<br />
              Front Desk: (845) 254-5200<br />
              catskills@urbancowboy.com
            </p>
          </div>

          <div className="text-right sm:self-end">
            <span className="font-mono text-[10px] text-[#A0988E] uppercase tracking-wider block">
              © 2026 URBAN COWBOY · ALL RIGHTS RESERVED
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};
