export type ListingType = 'all' | 'rent' | 'sale';

export type PropertyType = 
  | 'All Types'
  | 'Villa'
  | 'Modern Apartment'
  | 'Penthouse'
  | 'Duplex'
  | 'Bungalow'
  | 'Townhouse'
  | 'Waterfront Estate';

export type PropertyStatus = 'Available' | 'Pending' | 'For Sale' | 'For Rent' | 'Under Contract' | 'Sold';

export interface PropertyAgent {
  name: string;
  role: string;
  avatar: string;
  phone: string;
  email: string;
  rating: number;
}

export interface MonthlyExpenses {
  propertyTax: number;
  hoa: number;
  homeInsurance: number;
  utilitiesEst: number;
}

export interface Property {
  id: string;
  title: string;
  tagline: string;
  price: number;
  pricePeriod: 'month' | 'sale';
  currency: '$' | '€' | '£';
  type: PropertyType;
  status: PropertyStatus;
  listingType: 'rent' | 'sale';
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // 0-100% position on custom interactive map
    mapY: number; // 0-100% position on custom interactive map
  };
  beds: number;
  baths: number;
  sqft: number;
  lotSizeSqft?: number;
  garages: number;
  builtYear: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  galleryImages: string[];
  featured: boolean;
  verified: boolean;
  amenities: string[];
  agent: PropertyAgent;
  description: string;
  mlsId: string;
  addedDate: string;
  viewsCount: number;
  savedCount: number;
  monthlyExpenses: MonthlyExpenses;
}

export interface FilterState {
  searchQuery: string;
  listingType: ListingType;
  propertyType: string;
  status: string;
  minPrice: number;
  maxPrice: number;
  minBeds: number | 'any';
  minBaths: number | 'any';
  selectedAmenities: string[];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'sqft';
  viewMode: 'grid' | 'list' | 'map';
}
