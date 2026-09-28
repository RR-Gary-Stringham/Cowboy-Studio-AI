import React, { useState } from 'react';
import { SearchCriteria, RoomType, Building } from '../types';
import { BUILDINGS, ROOMS } from '../data/hotelData';
import { ROOM_IMAGE_ASSETS } from '../data/roomImagePlaceholders';
import {
  AlpineHausWoodcut,
  WaldenHausWoodcut,
  LodgeWoodcut,
  VintageKeyFob,
  AmenityWoodcutIcon
} from './WoodcutArt';
import {
  Calendar,
  Sparkles,
  Bath,
  Dog,
  Flame,
  ArrowRight,
  ArrowLeft,
  Check,
  Compass,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  LayoutGrid
} from 'lucide-react';

interface BuildingExperienceListProps {
  criteria: SearchCriteria;
  onUpdateCriteria: (c: SearchCriteria) => void;
  onSelectRoom: (room: RoomType) => void;
  onOpenRoomDetails: (room: RoomType) => void;
  onOpenHelpMeChoose: () => void;
  onBackToSearch: () => void;
}

export const BuildingExperienceList: React.FC<BuildingExperienceListProps> = ({
  criteria,
  onUpdateCriteria,
  onSelectRoom,
  onOpenRoomDetails,
  onOpenHelpMeChoose,
  onBackToSearch
}) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('all');
  const [activeFeatureFilter, setActiveFeatureFilter] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<'spread' | 'catalog'>('spread');

  // Filter rooms
  const filteredRooms = ROOMS.filter((room) => {
    if (selectedBuildingId !== 'all' && room.buildingId !== selectedBuildingId) {
      return false;
    }
    if (activeFeatureFilter === 'dog' && !room.isDogFriendly) return false;
    if (activeFeatureFilter === 'cedar' && room.soakType !== 'outdoor-cedar-tub') return false;
    if (
      activeFeatureFilter === 'fireplace' &&
      !room.features.some((f) => f.toLowerCase().includes('stove') || f.toLowerCase().includes('fire'))
    )
      return false;
    return true;
  });

  return (
    <div className="w-full texture-linen min-h-screen pb-24">
      {/* Top Editorial Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 border-b border-[#4E332D]/15">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <button
              onClick={onBackToSearch}
              className="inline-flex items-center gap-2 font-woodblock text-[11px] uppercase tracking-widest text-[#73716D] hover:text-[#4E332D] mb-3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dates</span>
            </button>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#221C18] uppercase tracking-tight">
              Find Your Stay
            </h1>
            <p className="font-editorial text-sm sm:text-base text-[#4E332D]/80 mt-1 max-w-2xl">
              8 Distinct Room Experiences Available. Each one with its own way of doing Cowboy.
              Whether you’re looking for a quiet retreat, a little adventure, or room to gather,
              explore the soul of each building.
            </p>
          </div>

          {/* Action buttons & View toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenHelpMeChoose}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF9F9] border border-[#4E332D]/30 hover:border-[#4E332D] font-woodblock text-xs uppercase tracking-wider text-[#4E332D] shadow-xs transition-all hover:bg-white cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9A5636]" />
              <span>Help Me Choose</span>
            </button>

            {/* Layout switch: Magazine Spread vs Catalog */}
            <div className="flex items-center bg-[#FAF9F9] border border-[#4E332D]/20 rounded-full p-1 text-xs font-woodblock uppercase tracking-wider text-[#4E332D]">
              <button
                onClick={() => setLayoutMode('spread')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                  layoutMode === 'spread'
                    ? 'bg-[#4E332D] text-[#EBE8E0] shadow-xs'
                    : 'text-[#73716D] hover:text-[#4E332D]'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>Editorial Spread</span>
              </button>
              <button
                onClick={() => setLayoutMode('catalog')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                  layoutMode === 'catalog'
                    ? 'bg-[#4E332D] text-[#EBE8E0] shadow-xs'
                    : 'text-[#73716D] hover:text-[#4E332D]'
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Story Catalog</span>
              </button>
            </div>

            {/* Active search pill */}
            <div className="px-4 py-2 rounded-full border border-[#4E332D]/20 bg-[#FAF9F9] font-woodblock text-xs uppercase tracking-wider text-[#4E332D] flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#9A5636]" />
              <span>
                {criteria.checkIn} — {criteria.checkOut} · {criteria.guests} Adults
              </span>
            </div>
          </div>
        </div>

        {/* Building Filter Pills & Craft Tags */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-[#4E332D]/10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#73716D] mr-2">
              Filter by Building:
            </span>
            <button
              onClick={() => setSelectedBuildingId('all')}
              className={`px-3.5 py-1 rounded-full text-xs font-woodblock uppercase tracking-wider transition-colors cursor-pointer ${
                selectedBuildingId === 'all'
                  ? 'bg-[#4E332D] text-[#EBE8E0]'
                  : 'bg-[#FAF9F9] text-[#4E332D] border border-[#4E332D]/20 hover:border-[#4E332D]'
              }`}
            >
              All Buildings
            </button>
            {BUILDINGS.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBuildingId(b.id)}
                className={`px-3.5 py-1 rounded-full text-xs font-woodblock uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedBuildingId === b.id
                    ? 'bg-[#4E332D] text-[#EBE8E0]'
                    : 'bg-[#FAF9F9] text-[#4E332D] border border-[#4E332D]/20 hover:border-[#4E332D]'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveFeatureFilter(activeFeatureFilter === 'cedar' ? 'all' : 'cedar')}
              className={`px-3 py-1 rounded-full text-[11px] font-woodblock uppercase tracking-wider transition-colors cursor-pointer ${
                activeFeatureFilter === 'cedar'
                  ? 'bg-[#9A5636] text-[#EBE8E0]'
                  : 'bg-[#FAF9F9] text-[#4E332D] border border-[#4E332D]/20 hover:border-[#4E332D]'
              }`}
            >
              Outdoor Cedar Tub
            </button>
            <button
              onClick={() => setActiveFeatureFilter(activeFeatureFilter === 'dog' ? 'all' : 'dog')}
              className={`px-3 py-1 rounded-full text-[11px] font-woodblock uppercase tracking-wider transition-colors cursor-pointer ${
                activeFeatureFilter === 'dog'
                  ? 'bg-[#9A5636] text-[#EBE8E0]'
                  : 'bg-[#FAF9F9] text-[#4E332D] border border-[#4E332D]/20 hover:border-[#4E332D]'
              }`}
            >
              Dog-Friendly
            </button>
            <button
              onClick={() => setActiveFeatureFilter(activeFeatureFilter === 'fireplace' ? 'all' : 'fireplace')}
              className={`px-3 py-1 rounded-full text-[11px] font-woodblock uppercase tracking-wider transition-colors cursor-pointer ${
                activeFeatureFilter === 'fireplace'
                  ? 'bg-[#9A5636] text-[#EBE8E0]'
                  : 'bg-[#FAF9F9] text-[#4E332D] border border-[#4E332D]/20 hover:border-[#4E332D]'
              }`}
            >
              Fireplace / Stove
            </button>
          </div>
        </div>
      </div>

      {/* SPREAD MODE: Exact Artboards from User PDF Screenshots 1 & 4 */}
      {layoutMode === 'spread' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
          {/* SECTION 1: ALPINE HAUS SPREAD (Exact layout from Screenshot 1!) */}
          {(selectedBuildingId === 'all' || selectedBuildingId === 'alpine') && (
            <div className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Architectural Woodcut + Story (Screenshot 1 left) */}
                <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left pt-2 pb-6 border-b lg:border-b-0 lg:border-r border-[#4E332D]/15 pr-0 lg:pr-8">
                  <div className="mb-4 inline-block">
                    <AlpineHausWoodcut className="w-60 h-36 sm:w-64 sm:h-40" />
                  </div>

                  <h2 className="font-desert font-bold text-4xl sm:text-5xl text-[#221C18] tracking-tight leading-none mb-1">
                    Alpine Haus
                  </h2>
                  <span className="font-woodblock text-xs uppercase tracking-[0.25em] text-[#9A5636] font-bold block mt-1 mb-4">
                    The Iconic Indoor Soak
                  </span>

                  <p className="font-editorial text-sm sm:text-base text-[#4E332D]/85 leading-relaxed mb-4">
                    Built into the hillside above the Lodge, Alpine is home to ten of the Cowboy's
                    most iconic rooms. Every suite puts a freestanding clawfoot tub in front of a
                    picture window, with the forest and mountains doing the decorating outside.
                  </p>
                  <p className="font-editorial italic text-sm text-[#4E332D]/90 font-medium mb-5">
                    This is where you come to soak, slow down and disappear for a while.
                  </p>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE8E0] border border-[#4E332D]/20 text-[11px] font-woodblock uppercase tracking-wider text-[#4E332D] font-bold">
                    <span>✦ Alpine is reserved for guests 21+</span>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#4E332D]/15 w-full hidden lg:block">
                    <span className="font-woodblock text-[10px] uppercase tracking-widest text-[#73716D] block mb-2">
                      Alpine Artifacts:
                    </span>
                    <div className="flex items-center gap-4">
                      <VintageKeyFob roomNumber="1" className="w-16 h-32" />
                      <div className="text-[11px] font-editorial italic text-[#4E332D]/70 max-w-[140px]">
                        Original brass-ringed leather room key given upon arrival at the desk.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Bento / Collage Grid: 3 Editorial Rooms + Photo Collages (Screenshot 1) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Top Card: Alpine Bathing Suite with Den */}
                  <div className="bg-[#FAF9F9] border-stitched rounded-[24px] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row gap-5 items-stretch relative">
                    {/* Polaroid-style photo strip */}
                    <div className="md:w-56 shrink-0 flex flex-col gap-2">
                      <div className="h-32 rounded-xl overflow-hidden border border-[#4E332D]/30 shadow-xs">
                        <img
                          src={ROOM_IMAGE_ASSETS.ALPINE_HEADBOARD}
                          alt="Alpine handcrafted headboard and bedroom"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="h-20 rounded-xl overflow-hidden border border-[#4E332D]/30 shadow-xs">
                        <img
                          src={ROOM_IMAGE_ASSETS.ALPINE_BATHING_SUITE}
                          alt="Alpine clawfoot soaking tub"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-brothers font-bold text-xl sm:text-2xl text-[#221C18] uppercase tracking-wide">
                            Alpine Bathing Suite with Den
                          </h3>
                          <span className="font-woodblock text-sm font-bold text-[#4E332D] shrink-0">
                            $245/nt
                          </span>
                        </div>
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#9A5636] block mb-2 font-bold">
                          A Little More Room to Disappear.
                        </span>
                        <p className="font-editorial text-xs sm:text-sm text-[#4E332D]/80 leading-relaxed mb-3">
                          There's only one like this. Stretch out in the built-in chaise den by the
                          fire, or climb into the copper clawfoot tub and take in one of Alpine's
                          best mountain views. It's part bathing suite, part hideaway, and exactly
                          the kind of room that makes leaving for dinner feel optional.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#4E332D]/15 mt-2">
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#73716D]">
                          21+ · Dog-friendly · 520 Sq Ft
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onOpenRoomDetails(ROOMS.find((r) => r.id === 'alpine-bathing-suite-den')!)
                            }
                            className="font-woodblock text-xs uppercase tracking-wider text-[#4E332D] hover:underline cursor-pointer px-2 py-1"
                          >
                            Learn More
                          </button>
                          <button
                            onClick={() =>
                              onSelectRoom(ROOMS.find((r) => r.id === 'alpine-bathing-suite-den')!)
                            }
                            className="bg-[#4E332D] hover:bg-[#343833] text-[#FAF9F9] px-4 py-1.5 rounded-full font-woodblock text-xs uppercase tracking-wider cursor-pointer transition-transform active:scale-95"
                          >
                            Select Rate →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Card: Alpine Penthouse Bathing Suite (Dusty Rose Palette from Screenshot 1) */}
                  <div className="bg-[#F2AAA9]/35 border-stitched rounded-[24px] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row gap-5 items-stretch relative">
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-brothers font-bold text-xl sm:text-2xl text-[#4E332D] uppercase tracking-wide">
                            Alpine Penthouse Bathing Suite
                          </h3>
                          <span className="font-woodblock text-sm font-bold text-[#4E332D] shrink-0">
                            $320/nt
                          </span>
                        </div>
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#9A5636] block mb-2 font-bold">
                          Up Where the Rooftops Meet the Mountain.
                        </span>
                        <p className="font-editorial text-xs sm:text-sm text-[#4E332D]/85 leading-relaxed mb-3">
                          Tucked beneath the eaves at the top of Alpine, these are the building's
                          biggest and most playful suites—dormered ceilings, exposed beams,
                          unexpected angles and a balcony made for two. There's a copper clawfoot
                          tub, naturally. And a fireplace for everything that comes after.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#4E332D]/15 mt-2">
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#4E332D]/80">
                          21+ · Dog-friendly · Fireplace · Balcony
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onOpenRoomDetails(ROOMS.find((r) => r.id === 'alpine-penthouse')!)
                            }
                            className="font-woodblock text-xs uppercase tracking-wider text-[#4E332D] hover:underline cursor-pointer px-2 py-1"
                          >
                            Learn More
                          </button>
                          <button
                            onClick={() =>
                              onSelectRoom(ROOMS.find((r) => r.id === 'alpine-penthouse')!)
                            }
                            className="bg-[#9A5636] hover:bg-[#783224] text-white px-4 py-1.5 rounded-full font-woodblock text-xs uppercase tracking-wider cursor-pointer transition-transform active:scale-95"
                          >
                            Reserve Penthouse →
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Arched Photo Frame (as seen in Screenshot 1) */}
                    <div className="md:w-56 shrink-0 h-44 rounded-t-full rounded-b-xl overflow-hidden border-2 border-[#9A5636]/40 shadow-xs">
                      <img
                        src={ROOM_IMAGE_ASSETS.ALPINE_PENTHOUSE_COPPER_TUB}
                        alt="Alpine Penthouse copper soaking tub"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Bottom Card: Alpine Bathing Suite (Deep Noir / Forest Teal Card from Screenshot 1) */}
                  <div className="bg-[#1C2020] text-[#EBE8E0] border-stitched rounded-[24px] p-5 sm:p-6 shadow-lg flex flex-col md:flex-row gap-5 items-stretch relative">
                    <div className="md:w-52 shrink-0 h-44 rounded-xl overflow-hidden border border-white/20 shadow-xs">
                      <img
                        src={ROOM_IMAGE_ASSETS.ALPINE_BATHING_SUITE}
                        alt="Freestanding clawfoot tub by window"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-brothers font-bold text-xl sm:text-2xl text-[#EBE8E0] uppercase tracking-wide">
                            Alpine Bathing Suite
                          </h3>
                          <span className="font-woodblock text-sm font-bold text-[#F2AAA9] shrink-0">
                            $195/nt
                          </span>
                        </div>
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#F2AAA9] block mb-2 font-bold">
                          The Iconic Soak.
                        </span>
                        <p className="font-editorial text-xs sm:text-sm text-[#EBE8E0]/80 leading-relaxed mb-3">
                          Out into the woods. Fill the tub. Put on a robe. Watch the mountain change
                          with the light. Dinner can wait a minute. Signature details include a king
                          bed, cast-iron stove, private deck, heated bathroom floors, hand-printed
                          wallpaper and walk-in shower.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/15 mt-2">
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#EBE8E0]/70">
                          21+ · Dog-friendly · Clawfoot Tub
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onOpenRoomDetails(ROOMS.find((r) => r.id === 'alpine-bathing-suite')!)
                            }
                            className="font-woodblock text-xs uppercase tracking-wider text-[#EBE8E0] hover:underline cursor-pointer px-2 py-1"
                          >
                            Learn More
                          </button>
                          <button
                            onClick={() =>
                              onSelectRoom(ROOMS.find((r) => r.id === 'alpine-bathing-suite')!)
                            }
                            className="bg-[#EBE8E0] hover:bg-white text-[#221C18] px-4 py-1.5 rounded-full font-woodblock text-xs uppercase tracking-wider cursor-pointer font-bold transition-transform active:scale-95"
                          >
                            Select Rate →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: WALDEN HAUS SPREAD */}
          {(selectedBuildingId === 'all' || selectedBuildingId === 'walden') && (
            <div className="relative text-[#221C18] border-t border-[#4E332D]/15 pt-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Woodcut + Walden Story */}
                <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left pt-2 pb-6 border-b lg:border-b-0 lg:border-r border-[#4E332D]/15 pr-0 lg:pr-8">
                  <div className="mb-4 inline-block">
                    <WaldenHausWoodcut className="w-60 h-36 sm:w-64 sm:h-40" />
                  </div>

                  <h2 className="font-desert font-bold text-4xl sm:text-5xl text-[#221C18] tracking-tight leading-none mb-1">
                    Walden Haus
                  </h2>
                  <span className="font-woodblock text-xs uppercase tracking-[0.25em] text-[#9A5636] font-bold block mt-1 mb-4">
                    Deep in the Pines · Outdoor Soaks
                  </span>

                  <p className="font-editorial text-sm sm:text-base text-[#4E332D]/85 leading-relaxed mb-4">
                    Walden sits closer to the woods. Its ten cabin-style rooms trade Alpine’s
                    lodge-like romance for something quieter and more elemental: private decks,
                    forest views and, in the bathing suites, cedar tubs made for soaking outside.
                  </p>
                  <p className="font-editorial italic text-sm text-[#4E332D]/90 font-medium mb-5">
                    This is where the Cowboy gets a little wilder.
                  </p>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4E332D]/10 border border-[#4E332D]/20 text-[11px] font-woodblock uppercase tracking-wider text-[#4E332D] font-bold">
                    <span>✦ Walden is reserved for guests 21+</span>
                  </div>
                </div>

                {/* Right Rooms Grid for Walden */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Walden Forest Bathing Suite */}
                  <div className="bg-[#FAF9F9] text-[#221C18] rounded-[24px] p-5 sm:p-6 border-stitched shadow-md flex flex-col md:flex-row gap-5 items-stretch">
                    <div className="md:w-56 shrink-0 h-44 rounded-xl overflow-hidden border border-[#4E332D]/30 shadow-xs">
                      <img
                        src={ROOM_IMAGE_ASSETS.WALDEN_FOREST_BATHING_SUITE}
                        alt="Outdoor cedar soaking tub on porch"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-brothers font-bold text-xl sm:text-2xl text-[#221C18] uppercase tracking-wide">
                            Walden Forest Bathing Suite
                          </h3>
                          <span className="font-woodblock text-sm font-bold text-[#4E332D] shrink-0">
                            $265/nt
                          </span>
                        </div>
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#9A5636] block mb-2 font-bold">
                          For Morning People. And People Who Might Become Morning People.
                        </span>
                        <p className="font-editorial text-xs sm:text-sm text-[#4E332D]/85 leading-relaxed mb-3">
                          Some of the best sunrise views on the property belong to this room. Watch
                          the first light arrive through the diamond-shaped window or, better yet,
                          from the cedar soaking tub on your private porch. Two leather loungers
                          inside give you somewhere to do very little afterward.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#4E332D]/15 mt-2">
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#73716D]">
                          21+ · Dog-friendly · Outdoor Cedar Tub
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onOpenRoomDetails(ROOMS.find((r) => r.id === 'walden-forest-bathing')!)
                            }
                            className="font-woodblock text-xs uppercase tracking-wider text-[#4E332D] hover:underline cursor-pointer px-2 py-1"
                          >
                            Learn More
                          </button>
                          <button
                            onClick={() =>
                              onSelectRoom(ROOMS.find((r) => r.id === 'walden-forest-bathing')!)
                            }
                            className="bg-[#4E332D] hover:bg-[#343833] text-white px-4 py-1.5 rounded-full font-woodblock text-xs uppercase tracking-wider cursor-pointer"
                          >
                            Select Rate →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Walden King (Simple, warm, cabin era) */}
                  <div className="bg-[#EBE8E0] text-[#221C18] rounded-[24px] p-5 sm:p-6 border-stitched shadow-md flex flex-col md:flex-row gap-5 items-stretch">
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-brothers font-bold text-xl sm:text-2xl text-[#221C18] uppercase tracking-wide">
                            Walden King
                          </h3>
                          <span className="font-woodblock text-sm font-bold text-[#4E332D] shrink-0">
                            $175/nt
                          </span>
                        </div>
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#9A5636] block mb-2 font-bold">
                          Your Cabin-Era Begins Here.
                        </span>
                        <p className="font-editorial text-xs sm:text-sm text-[#4E332D]/85 leading-relaxed mb-3">
                          Simple, warm and tucked into the woods, the Walden King is for guests who
                          want the forest outside and just enough Cowboy inside. Take your coffee to
                          the deck. Write something at the desk. Wander off for the day. Or don't.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#4E332D]/15 mt-2">
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#73716D]">
                          21+ · Dog-friendly · Private Deck
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onOpenRoomDetails(ROOMS.find((r) => r.id === 'walden-king')!)
                            }
                            className="font-woodblock text-xs uppercase tracking-wider text-[#4E332D] hover:underline cursor-pointer px-2 py-1"
                          >
                            Learn More
                          </button>
                          <button
                            onClick={() =>
                              onSelectRoom(ROOMS.find((r) => r.id === 'walden-king')!)
                            }
                            className="bg-[#9A5636] hover:bg-[#783224] text-white px-4 py-1.5 rounded-full font-woodblock text-xs uppercase tracking-wider cursor-pointer"
                          >
                            Select Rate →
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-56 shrink-0 h-44 rounded-xl overflow-hidden border border-[#4E332D]/30 shadow-xs">
                      <img
                        src={ROOM_IMAGE_ASSETS.WALDEN_SUNRISE_BATHING_SUITE}
                        alt="Walden Cabin Porch and Soak"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: THE LODGE SPREAD (Exact layout from Screenshot 4!) */}
          {(selectedBuildingId === 'all' || selectedBuildingId === 'lodge') && (
            <div className="relative border-t border-[#4E332D]/15 pt-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left/Middle Column: 3 Lodge Rooms Collage (Screenshot 4) */}
                <div className="lg:col-span-8 order-2 lg:order-1 space-y-6">
                  {/* Card 1: Lodge Three-Bedroom Suite */}
                  <div className="bg-[#FAF9F9] border-stitched rounded-[24px] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row gap-5 items-stretch">
                    <div className="md:w-52 shrink-0 flex flex-col gap-2">
                      <div className="h-28 rounded-xl overflow-hidden border border-[#4E332D]/30">
                        <img
                          src={ROOM_IMAGE_ASSETS.LODGE_PENTHOUSE_LIVING_ROOM}
                          alt="Lodge gathering parlor"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="h-20 rounded-xl overflow-hidden border border-[#4E332D]/30">
                        <img
                          src={ROOM_IMAGE_ASSETS.LODGE_PENTHOUSE_BEDROOM}
                          alt="Lodge bedroom and headboard"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-brothers font-bold text-xl sm:text-2xl text-[#221C18] uppercase tracking-wide">
                            Lodge Three-Bedroom Suite
                          </h3>
                          <span className="font-woodblock text-sm font-bold text-[#4E332D] shrink-0">
                            $580/nt
                          </span>
                        </div>
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#9A5636] block mb-2 font-bold">
                          Bring Your People.
                        </span>
                        <p className="font-editorial text-xs sm:text-sm text-[#4E332D]/85 leading-relaxed mb-3">
                          Three bedrooms plus a generous shared living space make this one for
                          families, old friends and celebrations that deserve more than adjoining
                          hotel rooms. You've got a fireplace, wet bar, deck and plenty of room to
                          gather.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#4E332D]/15 mt-2">
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#73716D]">
                          Family-friendly · Dog-friendly · 1100 Sq Ft
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onOpenRoomDetails(ROOMS.find((r) => r.id === 'lodge-three-bedroom')!)
                            }
                            className="font-woodblock text-xs uppercase tracking-wider text-[#4E332D] hover:underline cursor-pointer px-2 py-1"
                          >
                            Learn More
                          </button>
                          <button
                            onClick={() =>
                              onSelectRoom(ROOMS.find((r) => r.id === 'lodge-three-bedroom')!)
                            }
                            className="bg-[#4E332D] hover:bg-[#343833] text-white px-4 py-1.5 rounded-full font-woodblock text-xs uppercase tracking-wider cursor-pointer"
                          >
                            Select Rate →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Lodge Penthouse (Terracotta clay card from Screenshot 4) */}
                  <div className="bg-[#D48B60]/35 border-stitched rounded-[24px] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row gap-5 items-stretch">
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-brothers font-bold text-xl sm:text-2xl text-[#221C18] uppercase tracking-wide">
                            Lodge Penthouse
                          </h3>
                          <span className="font-woodblock text-sm font-bold text-[#4E332D] shrink-0">
                            $345/nt
                          </span>
                        </div>
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#9A5636] block mb-2 font-bold">
                          The Honeymoon Suite. Officially Unofficial.
                        </span>
                        <p className="font-editorial text-xs sm:text-sm text-[#4E332D]/85 leading-relaxed mb-3">
                          The biggest single room in the Lodge gives you a bedroom, living room,
                          private deck and some of the property's most dramatic views. The
                          handcrafted black-willow headboard turns the bedroom into its own little
                          forest. The copper clawfoot tub makes a strong argument for staying there.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#4E332D]/15 mt-2">
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#73716D]">
                          Family-friendly · Dog-friendly · Copper Tub
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onOpenRoomDetails(ROOMS.find((r) => r.id === 'lodge-penthouse')!)
                            }
                            className="font-woodblock text-xs uppercase tracking-wider text-[#4E332D] hover:underline cursor-pointer px-2 py-1"
                          >
                            Learn More
                          </button>
                          <button
                            onClick={() =>
                              onSelectRoom(ROOMS.find((r) => r.id === 'lodge-penthouse')!)
                            }
                            className="bg-[#9A5636] hover:bg-[#783224] text-white px-4 py-1.5 rounded-full font-woodblock text-xs uppercase tracking-wider cursor-pointer"
                          >
                            Select Rate →
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-52 shrink-0 h-44 rounded-xl overflow-hidden border border-[#4E332D]/30 shadow-xs">
                      <img
                        src={ROOM_IMAGE_ASSETS.LODGE_PENTHOUSE_BEDROOM}
                        alt="Lodge Penthouse bedroom"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Card 3: Lodge King (Deep teal/charcoal card from Screenshot 4) */}
                  <div className="bg-[#1C2826] text-[#EBE8E0] border-stitched rounded-[24px] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row gap-5 items-stretch">
                    <div className="md:w-48 shrink-0 h-40 rounded-xl overflow-hidden border border-white/20">
                      <img
                        src={ROOM_IMAGE_ASSETS.LODGE_PENTHOUSE_LIVING_ROOM}
                        alt="Lodge King & Parlor"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-brothers font-bold text-xl sm:text-2xl text-[#EBE8E0] uppercase tracking-wide">
                            Lodge King
                          </h3>
                          <span className="font-woodblock text-sm font-bold text-[#F2AAA9] shrink-0">
                            $165/nt
                          </span>
                        </div>
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#F2AAA9] block mb-2 font-bold">
                          The Easiest Way into Lodge Life.
                        </span>
                        <p className="font-editorial text-xs sm:text-sm text-[#EBE8E0]/80 leading-relaxed mb-3">
                          A comfortable King room directly above the heart of the Cowboy. Dinner
                          downstairs. Drinks around the corner. The sauna and trails just beyond the
                          front door.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/15 mt-2">
                        <span className="font-woodblock text-[11px] uppercase tracking-wider text-[#EBE8E0]/70">
                          Family-friendly · Dog-friendly · King Bed
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onOpenRoomDetails(ROOMS.find((r) => r.id === 'lodge-king')!)
                            }
                            className="font-woodblock text-xs uppercase tracking-wider text-[#EBE8E0] hover:underline cursor-pointer px-2 py-1"
                          >
                            Learn More
                          </button>
                          <button
                            onClick={() =>
                              onSelectRoom(ROOMS.find((r) => r.id === 'lodge-king')!)
                            }
                            className="bg-[#EBE8E0] text-[#221C18] hover:bg-white px-4 py-1.5 rounded-full font-woodblock text-xs uppercase tracking-wider cursor-pointer font-bold"
                          >
                            Select Rate →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Woodcut + Lodge Narrative (Screenshot 4 right) */}
                <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col items-center lg:items-start text-center lg:text-left pt-2 pb-6 border-b lg:border-b-0 lg:border-l border-[#4E332D]/15 pl-0 lg:pl-8">
                  <div className="mb-4 inline-block">
                    <LodgeWoodcut className="w-64 h-40 sm:w-72 sm:h-44" />
                  </div>

                  <h2 className="font-desert font-bold text-4xl sm:text-5xl text-[#221C18] tracking-tight leading-none mb-1">
                    The Lodge
                  </h2>
                  <span className="font-woodblock text-xs uppercase tracking-[0.25em] text-[#9A5636] font-bold block mt-1 mb-4">
                    Stay in the Middle of It All.
                  </span>

                  <p className="font-editorial text-sm sm:text-base text-[#4E332D]/85 leading-relaxed mb-4">
                    The Lodge rooms sit directly above the restaurant, bar and fireside gathering
                    spaces—the right choice for guests who want the Cowboy close at hand.
                  </p>
                  <p className="font-editorial italic text-sm text-[#4E332D]/90 font-medium mb-5">
                    Book one room or take over the floor with your people. Either way, you're never
                    far from dinner, drinks or the fire.
                  </p>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE8E0] border border-[#4E332D]/20 text-[11px] font-woodblock uppercase tracking-wider text-[#4E332D] font-bold">
                    <span>✦ Family-friendly & Gathering Suites</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CATALOG MODE: Longitudinal narrative with tactile room cards */}
      {layoutMode === 'catalog' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {BUILDINGS.filter(
            (b) => selectedBuildingId === 'all' || selectedBuildingId === b.id
          ).map((building) => {
            const buildingRooms = filteredRooms.filter((r) => r.buildingId === building.id);
            if (buildingRooms.length === 0) return null;

            return (
              <div key={building.id} className="space-y-6">
                {/* Building Header Banner */}
                <div className="bg-[#FAF9F9] border-2 border-[#4E332D] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                  <div className="flex-1">
                    <span className="font-woodblock text-xs uppercase tracking-widest text-[#9A5636] font-bold block mb-1">
                      {building.number} · {building.badge}
                    </span>
                    <h2 className="font-desert font-bold text-3xl sm:text-4xl text-[#221C18]">
                      {building.name}
                    </h2>
                    <p className="font-editorial text-sm text-[#4E332D]/80 mt-2 max-w-xl">
                      {building.description}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {building.id === 'alpine' && <AlpineHausWoodcut className="w-48 h-32" />}
                    {building.id === 'walden' && <WaldenHausWoodcut className="w-48 h-32" />}
                    {building.id === 'lodge' && <LodgeWoodcut className="w-52 h-36" />}
                  </div>
                </div>

                {/* Rooms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {buildingRooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-white rounded-3xl border-stitched overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                    >
                      <div className="h-56 relative overflow-hidden">
                        <img
                          src={room.images[0]}
                          alt={room.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-[#FAF9F9]/90 px-3 py-1 rounded-full text-[10px] font-woodblock uppercase tracking-wider text-[#4E332D] font-bold">
                          {room.soakHighlight}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="font-woodblock text-[10px] uppercase tracking-wider text-[#9A5636] block mb-1 font-bold">
                            {room.eyebrow}
                          </span>
                          <h3 className="font-brothers font-bold text-xl text-[#221C18] uppercase tracking-wide">
                            {room.name}
                          </h3>
                          <p className="font-editorial text-xs text-[#4E332D]/80 mt-2 line-clamp-3">
                            {room.description}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-[#4E332D]/15 flex items-center justify-between">
                          <div>
                            <span className="font-woodblock text-sm font-bold text-[#4E332D]">
                              ${room.basePrice}
                            </span>
                            <span className="text-[11px] text-[#73716D] font-sans"> / night</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onOpenRoomDetails(room)}
                              className="font-woodblock text-xs uppercase tracking-wider text-[#4E332D] hover:underline cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => onSelectRoom(room)}
                              className="bg-[#4E332D] hover:bg-[#343833] text-white px-4 py-1.5 rounded-full font-woodblock text-xs uppercase tracking-wider cursor-pointer"
                            >
                              Rates →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
