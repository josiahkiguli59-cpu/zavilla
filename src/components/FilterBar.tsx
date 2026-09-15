import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  MapPin, 
  ChevronDown, 
  RotateCcw,
  Sparkles,
  Check
} from 'lucide-react';
import { FilterState, ListingType } from '../types';
import { PROPERTY_TYPES, AMENITY_OPTIONS } from '../data/propertiesData';
import { CurrencyCode, formatCompactCurrency } from '../utils/currency';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  currency: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalFiltered,
  currency
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const listingTabs: { id: ListingType; label: string }[] = [
    { id: 'all', label: 'All Properties' },
    { id: 'rent', label: 'For Rent' },
    { id: 'sale', label: 'For Sale' },
  ];

  const statusTabs = ['All', 'Available', 'Pending', 'For Sale', 'For Rent', 'Under Contract', 'Sold'] as const;

  const handleAmenityToggle = (amenity: string) => {
    const exists = filters.selectedAmenities.includes(amenity);
    const updated = exists 
      ? filters.selectedAmenities.filter(a => a !== amenity)
      : [...filters.selectedAmenities, amenity];
    onFilterChange({ selectedAmenities: updated });
  };

  const hasActiveFilters = 
    filters.listingType !== 'all' || 
    filters.propertyType !== 'All Types' || 
    filters.status !== 'All' ||
    filters.minBeds !== 'any' ||
    filters.minBaths !== 'any' ||
    filters.maxPrice < 10000000 ||
    filters.selectedAmenities.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 mb-6 space-y-4">
      {/* Top Row: Listing Tabs + Sort By + View Switchers */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Listing Type Segmented Control */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl max-w-fit">
          {listingTabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-listing-${tab.id}`}
              onClick={() => onFilterChange({ listingType: tab.id })}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                filters.listingType === tab.id
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right side: Sort Dropdown + Advanced Filter Toggle + View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Sort:</span>
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="text-xs sm:text-sm font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer"
            >
              <option value="featured">Featured / Curated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Added</option>
              <option value="rating">Highest Rated</option>
              <option value="sqft">Living Area (Sq Ft)</option>
            </select>
          </div>

          {/* Advanced Filter Popover Trigger */}
          <button
            id="advanced-filter-toggle-btn"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
              isAdvancedOpen || hasActiveFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {filters.selectedAmenities.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {filters.selectedAmenities.length}
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* View Mode Buttons (Grid, List, Map) */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60">
            <button
              id="view-mode-grid-btn"
              onClick={() => onFilterChange({ viewMode: 'grid' })}
              className={`p-1.5 rounded-lg transition-all ${
                filters.viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="view-mode-list-btn"
              onClick={() => onFilterChange({ viewMode: 'list' })}
              className={`p-1.5 rounded-lg transition-all ${
                filters.viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              id="view-mode-map-btn"
              onClick={() => onFilterChange({ viewMode: 'map' })}
              className={`p-1.5 rounded-lg transition-all ${
                filters.viewMode === 'map'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Map & Split View"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Second Row: Property Type Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        {PROPERTY_TYPES.map((type) => (
          <button
            key={type}
            id={`filter-type-${type.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => onFilterChange({ propertyType: type })}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              filters.propertyType === type
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        {statusTabs.map((status) => (
          <button
            key={status}
            id={`filter-status-${status.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => onFilterChange({ status })}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              filters.status === status
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Advanced Filter Expandable Panel */}
      {isAdvancedOpen && (
        <div 
          id="advanced-filters-panel"
          className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-in fade-in duration-200"
        >
          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-700">Max Budget</span>
              <span className="text-blue-600 font-bold">
                {formatCompactCurrency(filters.maxPrice, currency as CurrencyCode)}
              </span>
            </div>
            <input
              id="price-range-slider"
              type="range"
              min={10000}
              max={10000000}
              step={50000}
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>{formatCompactCurrency(10000, currency as CurrencyCode)}</span>
              <span>{formatCompactCurrency(10000000, currency as CurrencyCode)}+</span>
            </div>
          </div>

          {/* Bedrooms Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Bedrooms</label>
            <div className="flex items-center gap-1.5">
              {(['any', 2, 3, 4, 5] as const).map((b) => (
                <button
                  key={b.toString()}
                  id={`filter-beds-${b}`}
                  onClick={() => onFilterChange({ minBeds: b })}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    filters.minBeds === b
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {b === 'any' ? 'Any' : `${b}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Bathrooms</label>
            <div className="flex items-center gap-1.5">
              {(['any', 2, 3, 4, 6] as const).map((ba) => (
                <button
                  key={ba.toString()}
                  id={`filter-baths-${ba}`}
                  onClick={() => onFilterChange({ minBaths: ba })}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    filters.minBaths === ba
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {ba === 'any' ? 'Any' : `${ba}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters action */}
          <div className="flex flex-col justify-end space-y-2">
            <div className="text-xs font-semibold text-slate-500">
              Showing <span className="text-slate-900 font-bold">{totalFiltered}</span> properties
            </div>
            <button
              id="reset-filters-btn"
              onClick={onResetFilters}
              disabled={!hasActiveFilters}
              className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                hasActiveFilters
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer'
                  : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>

          {/* Amenities Multi-Checklist */}
          <div className="md:col-span-3 lg:col-span-4 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Premium Amenities & Features</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => {
                const isSelected = filters.selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    id={`amenity-chip-${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
