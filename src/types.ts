export interface SearchCriteria {
  property: string;
  checkIn: string; // e.g. "2026-10-14"
  checkOut: string; // e.g. "2026-10-17"
  nights: number;
  guests: number;
  rooms: number;
  promoCode?: string;
}

export type BookingStep = 1 | 2 | 3 | 4 | 5;

export interface RoomAmenity {
  icon: string;
  label: string;
}

export interface RoomType {
  id: string;
  buildingId: string;
  buildingName: string;
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  longDescription: string;
  basePrice: number; // base nightly rate
  squareFeet: number;
  bedType: string;
  maxGuests: number;
  isDogFriendly: boolean;
  ageRestricted21: boolean;
  soakType: 'clawfoot-window' | 'copper-tub-fireplace' | 'outdoor-cedar-tub' | 'copper-den' | 'soaking-porch';
  soakHighlight: string;
  images: string[];
  features: string[];
  tags: string[];
}

export interface Building {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  ethos: string;
  badge?: string;
  heroImage: string;
  roomIds: string[];
}

export interface RateOption {
  id: 'ride-easy' | 'sunup' | 'plan-ahead' | 'stay-while' | 'member';
  title: string;
  subtitle?: string;
  eyebrow: string;
  tagline?: string;
  description: string;
  badge?: string;
  badgeIcon?: string;
  cancellationPolicy: string;
  rateMultiplier: number; // e.g. 1.0, 1.15 for breakfast, 0.88 for plan ahead, 0.84 for 5+ nights, 0.92 for member
  theme: {
    cardBg: string;
    border: string;
    headlineColor: string;
    eyebrowColor: string;
    bodyColor: string;
    ctaBg: string;
    ctaText: string;
    ctaBorder?: string;
    pillBg?: string;
    pillText?: string;
    footerCallout?: string;
  };
  inclusions: string[];
  isBreakfastIncluded?: boolean;
  isNonRefundable?: boolean;
  minNights?: number;
}

export interface ExtraItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  price: number;
  priceDisplay?: string;
  perPerson?: boolean;
  image: string;
  category?: 'wellness' | 'dining' | 'outdoors' | 'pets' | 'celebration';
}

export interface AddonSchedulePreference {
  deliveryType?: 'waiting-in-room' | 'scheduled-day' | 'gift-surprise';
  selectedDate?: string; // formatted e.g. "Thursday, 06/20 (Arrival Night)" or ISO string
  selectedDateIso?: string;
  selectedTime?: string; // e.g. "Prior to check-in (4:00 PM)", "Evening service (8:00 PM)"
  customTime?: string;
  isGift?: boolean;
  giftRecipient?: string;
  includeCard?: boolean;
  cardMessage?: string;
  itemCustomization?: string; // Cake inscription, wine varietal, dog's name, dietary notes
  dietaryNote?: string;
}

export interface BookingState {
  searchCriteria: SearchCriteria;
  currentStep: BookingStep;
  selectedRoom: RoomType | null;
  selectedRate: RateOption | null;
  selectedExtras: { [extraId: string]: number };
  extraPreferences?: { [extraId: string]: AddonSchedulePreference };
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes: string;
    hasDog: boolean;
    dogName?: string;
  };
}
