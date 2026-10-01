import React, { useState } from 'react';
import { RideEasySoloPage } from './components/RideEasySoloPage';
import { IntegratedMiniEngineShowcase } from './components/mini-engine/IntegratedMiniEngineShowcase';
import { RoomMatcherPage } from './components/room-matcher/RoomMatcherPage';
import { MatchOrBrowseScreen } from './components/MatchOrBrowseScreen';
import { BookingStep, SearchCriteria, RoomType, RateOption, BookingState, AddonSchedulePreference } from './types';
import { ROOMS, BUILDINGS, RATE_OPTIONS } from './data/hotelData';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { PillarFeatures } from './components/PillarFeatures';
import { BuildingExperienceList } from './components/BuildingExperienceList';
import { RateSelectionView } from './components/RateSelectionView';
import { RoomDetailModal } from './components/RoomDetailModal';
import { HelpMeChooseModal } from './components/HelpMeChooseModal';
import { ExtrasStep } from './components/ExtrasStep';
import { CheckoutStep } from './components/CheckoutStep';
import { Footer } from './components/Footer';
import { ArrowRight, Compass, Sparkles, Bath, Shield, Eye } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'room-matcher' | 'mini-engine-showcase' | 'full-app' | 'solo-ride-easy'>('full-app');
  const [rateVersion, setRateVersion] = useState<'v1' | 'v2'>('v2');
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [isMatchPromptActive, setIsMatchPromptActive] = useState<boolean>(false);
  
  const [criteria, setCriteria] = useState<SearchCriteria>({
    property: 'Catskills',
    checkIn: '2026-10-14',
    checkOut: '2026-10-17',
    nights: 3,
    guests: 2,
    rooms: 1,
    promoCode: ''
  });

  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(ROOMS[0]); // default to Alpine Bathing Suite for seamless rate preview
  const [selectedRate, setSelectedRate] = useState<RateOption | null>(RATE_OPTIONS[0]); // default to Ride Easy
  const [selectedExtras, setSelectedExtras] = useState<{ [extraId: string]: number }>({});
  const [extraPreferences, setExtraPreferences] = useState<{ [extraId: string]: AddonSchedulePreference }>({});
  
  const [guestInfo, setGuestInfo] = useState<BookingState['guestInfo']>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
    hasDog: false,
    dogName: ''
  });

  // Modal states
  const [modalRoom, setModalRoom] = useState<RoomType | null>(null);
  const [isHelpMeChooseOpen, setIsHelpMeChooseOpen] = useState(false);

  const canNavigateToStep = (step: BookingStep) => {
    if (step === 1 || step === 2) return true;
    if (step === 3) return selectedRoom !== null;
    if (step === 4) return selectedRoom !== null && selectedRate !== null;
    if (step === 5) return selectedRoom !== null && selectedRate !== null;
    return false;
  };

  const handleStepChange = (step: BookingStep) => {
    setIsMatchPromptActive(false);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRoom = (room: RoomType) => {
    setSelectedRoom(room);
    setCurrentStep(3); // Go to Rate Selection
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRate = (rate: RateOption) => {
    setSelectedRate(rate);
    setCurrentStep(4); // Go to Extras
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchFromMiniEngine = (room: RoomType, rate: RateOption, newCriteria: SearchCriteria) => {
    setSelectedRoom(room);
    setSelectedRate(rate);
    setCriteria(newCriteria);
    setViewMode('full-app');
    setCurrentStep(4); // Advance into Extras/Add-ons or Rate details with selection pre-loaded!
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateExtras = (extraId: string, count: number) => {
    setSelectedExtras(prev => {
      const next = { ...prev };
      if (count <= 0) {
        delete next[extraId];
      } else {
        next[extraId] = count;
      }
      return next;
    });

    if (count <= 0) {
      setExtraPreferences(prev => {
        const next = { ...prev };
        delete next[extraId];
        return next;
      });
    }
  };

  const handleUpdateExtraPreference = (extraId: string, preference: AddonSchedulePreference) => {
    setExtraPreferences(prev => ({
      ...prev,
      [extraId]: preference
    }));
  };

  const handleResetBooking = () => {
    setSelectedRoom(ROOMS[0]);
    setSelectedRate(RATE_OPTIONS[0]);
    setSelectedExtras({});
    setExtraPreferences({});
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Room Matcher mode (Blank page dedicated option matching user flow)
  if (viewMode === 'room-matcher') {
    return (
      <div className="relative min-h-screen bg-[#FAF9F9]">
        <RoomMatcherPage
          criteria={criteria}
          onSelectRoomAndBook={(room) => {
            setSelectedRoom(room);
            setViewMode('full-app');
            setIsMatchPromptActive(false);
            setCurrentStep(3); // Direct into Rate Selection & booking flow with room selected
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onViewAllRooms={() => {
            setViewMode('full-app');
            setIsMatchPromptActive(false);
            setCurrentStep(2); // Browse All Rooms
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onReturnToSite={() => {
            setViewMode('full-app');
            setIsMatchPromptActive(false);
            setCurrentStep(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Floating switcher in bottom-right corner */}
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 p-1 bg-[#221C18]/90 text-white rounded-full shadow-2xl backdrop-blur-md border border-white/20">
          <button
            onClick={() => setViewMode('room-matcher')}
            className="text-[11px] font-mono px-3 py-1.5 rounded-full bg-[#9A5636] text-white font-bold transition-all cursor-pointer"
          >
            ✦ Room Matcher
          </button>
          <button
            onClick={() => setViewMode('mini-engine-showcase')}
            className="text-[11px] font-mono px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-all cursor-pointer"
          >
            Mini Engine Embed
          </button>
          <button
            onClick={() => setViewMode('full-app')}
            className="text-[11px] font-mono px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-all cursor-pointer"
          >
            Main Booking Flow
          </button>
          <button
            onClick={() => setViewMode('solo-ride-easy')}
            className="text-[11px] font-mono px-2.5 py-1.5 rounded-full text-white/50 hover:text-white transition-all cursor-pointer"
          >
            Solo Card
          </button>
        </div>
      </div>
    );
  }

  // If in solo mode, render strictly the blank page with RideEasy component centered
  if (viewMode === 'solo-ride-easy') {
    return (
      <div className="relative min-h-screen bg-[#FAF9F9]">
        <RideEasySoloPage />
        {/* Floating switcher in bottom-right corner */}
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 p-1 bg-[#221C18]/90 text-white rounded-full shadow-2xl backdrop-blur-md border border-white/20">
          <button
            onClick={() => setViewMode('room-matcher')}
            className="text-[11px] font-mono px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-all cursor-pointer"
          >
            ✦ Room Matcher
          </button>
          <button
            onClick={() => setViewMode('mini-engine-showcase')}
            className="text-[11px] font-mono px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-all cursor-pointer"
          >
            Mini Engine Embed
          </button>
          <button
            onClick={() => setViewMode('full-app')}
            className="text-[11px] font-mono px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-all cursor-pointer"
          >
            Main Booking Flow
          </button>
        </div>
      </div>
    );
  }

  // If in Mini Engine Showcase mode, render the interactive marketing pages with embedded booking
  if (viewMode === 'mini-engine-showcase') {
    return (
      <div className="relative min-h-screen bg-[#EBE8E0]">
        <IntegratedMiniEngineShowcase
          sessionCriteria={criteria}
          onUpdateSessionCriteria={setCriteria}
          onLaunchMainBooking={handleLaunchFromMiniEngine}
          onSwitchToFullBookingFlow={() => setViewMode('full-app')}
        />

        {/* Floating Quick Mode Switcher */}
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 p-1 bg-[#221C18]/90 text-white rounded-full shadow-2xl backdrop-blur-md border border-white/20">
          <button
            onClick={() => setViewMode('room-matcher')}
            className="text-[11px] font-mono px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-all cursor-pointer"
          >
            ✦ Room Matcher
          </button>
          <button
            onClick={() => setViewMode('mini-engine-showcase')}
            className="text-[11px] font-mono px-3 py-1.5 rounded-full bg-[#9A5636] text-white font-bold transition-all cursor-pointer"
          >
            Mini Engine Embed
          </button>
          <button
            onClick={() => setViewMode('full-app')}
            className="text-[11px] font-mono px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-all cursor-pointer"
          >
            Main Booking Flow
          </button>
          <button
            onClick={() => setViewMode('solo-ride-easy')}
            className="text-[11px] font-mono px-2.5 py-1.5 rounded-full text-white/50 hover:text-white transition-all cursor-pointer"
          >
            Solo Card
          </button>
        </div>
      </div>
    );
  }

  /**
   * Fail-safe execution wrapper:
   * Tries once, allows at most 1 retry, then reports error and halts.
   */
  const executeWithFailsafe = async <T,>(
    actionName: string,
    actionFn: () => Promise<T>
  ): Promise<{ success: boolean; data?: T; error?: string }> => {
    const maxAttempts = 2; // Try once + 1 retry
    let lastError = '';

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`[API Flow: ${actionName}] Attempt ${attempt} of ${maxAttempts} starting...`);
      try {
        const result = await actionFn();
        console.log(`[API Flow: ${actionName}] Succeeded on attempt ${attempt}:`, result);
        return { success: true, data: result };
      } catch (err: any) {
        lastError = err?.message || String(err);
        console.warn(`[API Flow: ${actionName}] Attempt ${attempt} failed with error:`, lastError);

        if (attempt < maxAttempts) {
          console.log(`[API Flow: ${actionName}] Preparing 1 retry before reporting back...`);
        }
      }
    }

    console.error(`[API Flow: ${actionName}] Failsafe triggered: All ${maxAttempts} attempts failed. Stopping retries and awaiting instructions. Last error: ${lastError}`);
    return { success: false, error: lastError };
  };

  /**
   * handleGenerate: Handles generation requests with debug logging and failsafe retries
   */
  const handleGenerate = async (prompt?: string, options: Record<string, any> = {}) => {
    console.log('[handleGenerate] Triggered with prompt:', prompt, 'options:', options);
    return await executeWithFailsafe('handleGenerate', async () => {
      // Stub/handler logic with validation
      if (!prompt && Object.keys(options).length === 0) {
        console.log('[handleGenerate] Generating default recommendations for current search criteria:', criteria);
      }
      return { status: 'completed', timestamp: new Date().toISOString(), criteria };
    });
  };

  /**
   * handleIterate: Handles iterative refinement requests with debug logging and failsafe retries
   */
  const handleIterate = async (iterationInput?: string, changes: Record<string, any> = {}) => {
    console.log('[handleIterate] Triggered with iteration input:', iterationInput, 'changes:', changes);
    return await executeWithFailsafe('handleIterate', async () => {
      console.log('[handleIterate] Applying iteration modifications to current booking state');
      return { status: 'iterated', timestamp: new Date().toISOString(), changes };
    });
  };

  /**
   * handleCritiqueSubmit: Handles critique submission with debug logging and failsafe retries
   */
  const handleCritiqueSubmit = async (critique: string, metadata: Record<string, any> = {}) => {
    console.log('[handleCritiqueSubmit] Submitting critique:', critique, 'metadata:', metadata);
    return await executeWithFailsafe('handleCritiqueSubmit', async () => {
      if (!critique || critique.trim() === '') {
        throw new Error('Critique text cannot be empty');
      }
      console.log('[handleCritiqueSubmit] Critique recorded successfully');
      return { status: 'submitted', critique, timestamp: new Date().toISOString() };
    });
  };

  const bookingState: BookingState = {
    searchCriteria: criteria,
    currentStep,
    selectedRoom,
    selectedRate,
    selectedExtras,
    extraPreferences,
    guestInfo
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EBE8E0] text-[#4E332D]">
      {/* Top Header & Progress Stepper matching Figma */}
      <Header
        currentStep={currentStep}
        onStepChange={handleStepChange}
        canNavigateToStep={canNavigateToStep}
        onToggleMiniEngine={() => setViewMode('mini-engine-showcase')}
        isMiniEngineActive={false}
        onOpenRoomMatcher={() => setViewMode('room-matcher')}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* INTERMEDIATE DECISION SCREEN: Match or Browse Choice */}
        {isMatchPromptActive && (
          <MatchOrBrowseScreen
            criteria={criteria}
            onFindYourStay={() => {
              setIsMatchPromptActive(false);
              setViewMode('room-matcher');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowAllRooms={() => {
              setIsMatchPromptActive(false);
              setCurrentStep(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onChangeDates={() => {
              setIsMatchPromptActive(false);
              setCurrentStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* STEP 1: Availability Criteria / Landing */}
        {!isMatchPromptActive && currentStep === 1 && (
          <div className="w-full py-12 md:py-16">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
              <span className="font-woodblock text-xs uppercase tracking-widest text-[#9A5636] font-bold block mb-2">
                CATSKILLS · BIG INDIAN, NY
              </span>
              <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl text-[#4E332D] tracking-wide uppercase leading-none mb-3">
                Book Your Stay
              </h1>
              <p className="font-editorial italic text-lg sm:text-xl text-[#4E332D]/80">
                Arrive as Strangers. Leave as Friends.
              </p>
            </div>

            {/* Figma Search Bar */}
            <div className="mb-14">
              <SearchBar
                criteria={criteria}
                onUpdateCriteria={setCriteria}
                onSearch={() => {
                  setIsMatchPromptActive(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>

            {/* Three Iconic Pillars */}
            <PillarFeatures />

            {/* Quick Preview of Building Experiences */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-[#D1C9BE]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display font-bold text-2xl uppercase text-[#221C18]">
                    Explore Buildings & Soaking Suites
                  </h3>
                  <p className="font-editorial text-sm text-[#6B6259]">
                    Choose from Alpine's picture windows, Walden's outdoor cedar tubs, or The Lodge's stone hearths.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsMatchPromptActive(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 bg-[#4E332D] hover:bg-[#343833] text-white px-6 py-3 rounded-full font-woodblock text-xs uppercase tracking-widest cursor-pointer shadow-sm transition-transform active:scale-95"
                >
                  <span>Browse All 8 Rooms</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BUILDINGS.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setIsMatchPromptActive(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group cursor-pointer rounded-2xl overflow-hidden border border-[#D1C9BE] bg-white shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="h-44 overflow-hidden relative">
                      <img
                        src={b.heroImage}
                        alt={b.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#FAF9F9]/90 px-2.5 py-0.5 rounded-full text-[10px] font-woodblock uppercase tracking-wider text-[#4E332D] font-bold">
                        {b.number}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-display font-bold text-lg text-[#221C18] uppercase">
                        {b.name}
                      </h4>
                      <p className="font-editorial text-xs text-[#6B6259] mt-1 line-clamp-2">
                        {b.tagline}
                      </p>
                      <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#9A5636] font-bold mt-3 block group-hover:underline">
                        Explore Rooms →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Find Your Stay (Building & Room Experiences) */}
        {!isMatchPromptActive && currentStep === 2 && (
          <BuildingExperienceList
            criteria={criteria}
            onUpdateCriteria={setCriteria}
            onSelectRoom={handleSelectRoom}
            onOpenRoomDetails={(room) => setModalRoom(room)}
            onOpenHelpMeChoose={() => setIsHelpMeChooseOpen(true)}
            onBackToSearch={() => handleStepChange(1)}
          />
        )}

        {/* STEP 3: Rate Selection ("SELECT YOUR EXPERIENCE" Visual Cards) */}
        {currentStep === 3 && selectedRoom && (
          <RateSelectionView
            room={selectedRoom}
            criteria={criteria}
            selectedRate={selectedRate}
            onSelectRate={handleSelectRate}
            onChangeRoom={() => handleStepChange(2)}
            onOpenRoomDetails={(room) => setModalRoom(room)}
            activeVersion={rateVersion}
            onSelectVersion={setRateVersion}
          />
        )}

        {/* STEP 4: Extras & Add-ons */}
        {currentStep === 4 && (
          <ExtrasStep
            bookingState={bookingState}
            onUpdateExtras={handleUpdateExtras}
            onUpdateExtraPreference={handleUpdateExtraPreference}
            onProceedToPay={() => handleStepChange(5)}
            onBackToRates={() => handleStepChange(3)}
          />
        )}

        {/* STEP 5: Guest Details & Payment */}
        {currentStep === 5 && (
          <CheckoutStep
            bookingState={bookingState}
            onUpdateGuestInfo={setGuestInfo}
            onBackToExtras={() => handleStepChange(4)}
            onResetBooking={handleResetBooking}
          />
        )}
      </main>

      {/* Room Detail Modal (Photos, Floorplan, Soaking Specs) */}
      <RoomDetailModal
        room={modalRoom}
        criteria={criteria}
        onClose={() => setModalRoom(null)}
        onProceedToRates={(room) => {
          setSelectedRoom(room);
          setModalRoom(null);
          handleStepChange(3);
        }}
      />

      {/* "Help Me Choose" Experiential Vibe Matcher */}
      <HelpMeChooseModal
        isOpen={isHelpMeChooseOpen}
        onClose={() => setIsHelpMeChooseOpen(false)}
        onSelectRoom={(room) => {
          setSelectedRoom(room);
          handleStepChange(3);
        }}
      />

      {/* Footer matching Figma */}
      <Footer />

      {/* Floating Quick Mode Switcher */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 p-1 bg-[#221C18]/90 text-white rounded-full shadow-2xl backdrop-blur-md border border-white/20">
        <button
          onClick={() => setViewMode('room-matcher')}
          className="text-[11px] font-mono px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-all cursor-pointer"
        >
          ✦ Room Matcher
        </button>
        <button
          onClick={() => setViewMode('mini-engine-showcase')}
          className="text-[11px] font-mono px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-all cursor-pointer"
        >
          Mini Engine Embed
        </button>
        <button
          onClick={() => setViewMode('full-app')}
          className="text-[11px] font-mono px-3 py-1.5 rounded-full bg-[#9A5636] text-white font-bold transition-all cursor-pointer"
        >
          Main Booking Flow
        </button>
        <button
          onClick={() => setViewMode('solo-ride-easy')}
          className="text-[11px] font-mono px-2.5 py-1.5 rounded-full text-white/50 hover:text-white transition-all cursor-pointer"
        >
          Solo Card
        </button>
      </div>
    </div>
  );
}
