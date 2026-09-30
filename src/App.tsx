import React, { useState } from 'react';
import { RideEasySoloPage } from './components/RideEasySoloPage';
import {
  BookingStep,
  SearchCriteria,
  RoomType,
  RateOption,
  BookingState,
  RecommendationPreferences
} from './types';
import { ROOMS, RATE_OPTIONS } from './data/hotelData';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { PillarFeatures } from './components/PillarFeatures';
import { BuildingExperienceList } from './components/BuildingExperienceList';
import { RateSelectionView } from './components/RateSelectionView';
import { RoomDetailModal } from './components/RoomDetailModal';
import { ExtrasStep } from './components/ExtrasStep';
import { CheckoutStep } from './components/CheckoutStep';
import { Footer } from './components/Footer';
import { FindYourStay } from './features/find-your-stay/components/flows/FindYourStay';
import { HelpMeChoose } from './features/find-your-stay/components/flows/HelpMeChoose';
import { MatchResults } from './features/find-your-stay/components/flows/MatchResults';
import { rankRecommendedRooms } from './features/find-your-stay/roomMatching';

type RoomDiscoveryView = 'explore' | 'quiz' | 'matches' | 'rooms';

export default function App() {
  const [viewMode, setViewMode] = useState<'solo-ride-easy' | 'full-app'>('full-app');

  // If in solo mode, render strictly the blank page with RideEasy component centered
  if (viewMode === 'solo-ride-easy') {
    return (
      <div className="relative">
        <RideEasySoloPage />
        {/* Discreet toggle button in bottom-right corner */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setViewMode('full-app')}
            className="text-[11px] font-mono px-3 py-1.5 rounded-full bg-[#343833]/10 hover:bg-[#343833]/20 text-[#343833] transition-all cursor-pointer backdrop-blur-xs opacity-60 hover:opacity-100"
          >
            Switch to Full Booking Page
          </button>
        </div>
      </div>
    );
  }

  const [rateVersion, setRateVersion] = useState<'v1' | 'v2'>('v2');
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [roomDiscoveryView, setRoomDiscoveryView] = useState<RoomDiscoveryView>('explore');
  const [recommendationPreferences, setRecommendationPreferences] =
    useState<RecommendationPreferences | null>(null);
  
  const [criteria, setCriteria] = useState<SearchCriteria>({
    property: 'Catskills',
    checkIn: '2026-10-14',
    checkOut: '2026-10-17',
    nights: 3,
    guests: 2,
    children: 0,
    accessible: false,
    rooms: 1,
    promoCode: ''
  });

  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(ROOMS[0]); // default to Alpine Bathing Suite for seamless rate preview
  const [selectedRate, setSelectedRate] = useState<RateOption | null>(RATE_OPTIONS[0]); // default to Ride Easy
  const [selectedExtras, setSelectedExtras] = useState<{ [extraId: string]: number }>({});
  
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
  const canNavigateToStep = (step: BookingStep) => {
    if (step === 1 || step === 2) return true;
    if (step === 3) return selectedRoom !== null;
    if (step === 4) return selectedRoom !== null && selectedRate !== null;
    if (step === 5) return selectedRoom !== null && selectedRate !== null;
    return false;
  };

  const handleStepChange = (step: BookingStep) => {
    if (step === 2 && currentStep !== 2) setRoomDiscoveryView('explore');
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openRoomDiscovery = (view: RoomDiscoveryView) => {
    setRoomDiscoveryView(view);
    setCurrentStep(2);
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
  };

  const handleResetBooking = () => {
    setSelectedRoom(ROOMS[0]);
    setSelectedRate(RATE_OPTIONS[0]);
    setSelectedExtras({});
    setRoomDiscoveryView('explore');
    setRecommendationPreferences(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    guestInfo
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EBE8E0] text-[#4E332D]">
      {/* Top Header & Progress Stepper matching Figma */}
      <Header
        currentStep={currentStep}
        onStepChange={handleStepChange}
        canNavigateToStep={canNavigateToStep}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* STEP 1: Availability Criteria / Landing */}
        {currentStep === 1 && (
          <div className="w-full py-12 md:py-16">
            <div className="booking-shell mb-10 text-center">
              <span className="font-bianco text-xs uppercase tracking-widest text-[#9A5636] font-bold block mb-2">
                CATSKILLS · BIG INDIAN, NY
              </span>
              <h1 className="mb-3 font-desert text-[55px] font-bold uppercase leading-none tracking-[2px] text-[#4E332D]">
                Book Your Stay
              </h1>
              <p className="font-editorial text-lg text-[#4E332D]/80 sm:text-xl">
                Arrive as Strangers. Leave as Friends.
              </p>
            </div>

            {/* Figma Search Bar */}
            <div className="mb-14">
              <SearchBar
                criteria={criteria}
                onUpdateCriteria={setCriteria}
                onSearch={() => openRoomDiscovery('explore')}
              />
            </div>

            {/* Three Iconic Pillars */}
            <PillarFeatures />

          </div>
        )}

        {/* STEP 2: Choose a discovery path after date entry */}
        {currentStep === 2 && roomDiscoveryView === 'explore' && (
          <FindYourStay
            criteria={criteria}
            availableCount={ROOMS.length}
            onChangeSearch={() => handleStepChange(1)}
            onHelpMeChoose={() => openRoomDiscovery('quiz')}
            onBrowseAll={() => openRoomDiscovery('rooms')}
          />
        )}

        {currentStep === 2 && roomDiscoveryView === 'quiz' && (
          <HelpMeChoose
            initialPreferences={recommendationPreferences}
            onBack={() => openRoomDiscovery('explore')}
            onSubmit={(preferences) => {
              setRecommendationPreferences(preferences);
              openRoomDiscovery('matches');
            }}
          />
        )}

        {currentStep === 2 && roomDiscoveryView === 'matches' && recommendationPreferences && (
          <MatchResults
            rooms={rankRecommendedRooms(ROOMS, recommendationPreferences, criteria)}
            criteria={criteria}
            preferences={recommendationPreferences}
            onBack={() => openRoomDiscovery('quiz')}
            onBrowseAll={() => openRoomDiscovery('rooms')}
            onSelectRoom={handleSelectRoom}
            onOpenRoomDetails={(room) => setModalRoom(room)}
          />
        )}

        {/* Browse-all room experience */}
        {currentStep === 2 && roomDiscoveryView === 'rooms' && (
          <BuildingExperienceList
            criteria={criteria}
            onUpdateCriteria={setCriteria}
            onSelectRoom={handleSelectRoom}
            onOpenRoomDetails={(room) => setModalRoom(room)}
            onOpenHelpMeChoose={() => openRoomDiscovery('quiz')}
            onBackToSearch={() => openRoomDiscovery('explore')}
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

      {/* Footer matching Figma */}
      <Footer />
    </div>
  );
}
