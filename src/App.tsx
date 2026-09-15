/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { PropertyCard } from './components/PropertyCard';
import { PropertyRow } from './components/PropertyRow';
import { PropertyMapSplitView } from './components/PropertyMapSplitView';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AddPropertyModal } from './components/AddPropertyModal';
import { ScheduleTourModal } from './components/ScheduleTourModal';
import { SavedModal } from './components/SavedModal';
import { SecondaryViews } from './components/SecondaryViews';
import { INITIAL_PROPERTIES } from './data/propertiesData';
import { Property, FilterState } from './types';
import { CurrencyCode, getStoredCurrency, setExchangeRates, setStoredCurrency } from './utils/currency';
import { Home, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

const SAVED_PROPERTIES_STORAGE_KEY = 'zavilla-saved-ids';

export default function App() {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [currency, setCurrency] = useState<CurrencyCode>(() => getStoredCurrency());
  const [, setRatesVersion] = useState(0);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const saved = window.localStorage.getItem(SAVED_PROPERTIES_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  });
  const [currentTab, setCurrentTab] = useState<string>('properties');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setStoredCurrency(currency);
  }, [currency]);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/exchange-rates')
      .then((response) => {
        if (!response.ok) throw new Error('Exchange rates unavailable');
        return response.json() as Promise<{ rates?: Partial<Record<CurrencyCode, number>> }>;
      })
      .then((data) => {
        if (isMounted && data.rates) {
          setExchangeRates(data.rates);
          setRatesVersion((version) => version + 1);
        }
      })
      .catch(() => {
        // The currency utility keeps fallback rates when the backend is unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SAVED_PROPERTIES_STORAGE_KEY, JSON.stringify(savedIds));
    }
  }, [savedIds]);

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [tourProperty, setTourProperty] = useState<Property | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    listingType: 'all',
    propertyType: 'All Types',
    status: 'All',
    minPrice: 0,
    maxPrice: 10000000,
    minBeds: 'any',
    minBaths: 'any',
    selectedAmenities: [],
    sortBy: 'featured',
    viewMode: 'grid',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) => {
      if (prev.includes(id)) {
        showToast('Property removed from saved portfolio.');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Property added to saved portfolio.');
        return [...prev, id];
      }
    });
  };

  const handleAddProperty = (newProperty: Property) => {
    setProperties((prev) => [newProperty, ...prev]);
    showToast(`"${newProperty.title}" successfully published to ZAVILLA!`);
  };

  const handleFilterUpdate = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      listingType: 'all',
      propertyType: 'All Types',
      status: 'All',
      minPrice: 0,
      maxPrice: 10000000,
      minBeds: 'any',
      minBaths: 'any',
      selectedAmenities: [],
      sortBy: 'featured',
      viewMode: filters.viewMode,
    });
    showToast('Filters reset to standard view.');
  };

  // Filtered and sorted properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Search query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchCity = p.city.toLowerCase().includes(q);
          const matchState = p.state.toLowerCase().includes(q);
          const matchAddress = p.address.toLowerCase().includes(q);
          const matchMls = p.mlsId.toLowerCase().includes(q);
          const matchType = p.type.toLowerCase().includes(q);
          if (!matchTitle && !matchCity && !matchState && !matchAddress && !matchMls && !matchType) {
            return false;
          }
        }

        // Listing type: rent vs sale
        if (filters.listingType === 'rent' && p.listingType !== 'rent') return false;
        if (filters.listingType === 'sale' && p.listingType !== 'sale') return false;

        // Property type
        if (filters.propertyType !== 'All Types' && p.type !== filters.propertyType) {
          return false;
        }

        // Listing status
        if (filters.status !== 'All' && p.status !== filters.status) {
          return false;
        }

        // Max price
        if (p.price > filters.maxPrice) {
          return false;
        }

        // Beds
        if (filters.minBeds !== 'any' && p.beds < filters.minBeds) {
          return false;
        }

        // Baths
        if (filters.minBaths !== 'any' && p.baths < filters.minBaths) {
          return false;
        }

        // Selected amenities
        if (filters.selectedAmenities.length > 0) {
          const hasAll = filters.selectedAmenities.every((a) => p.amenities.includes(a));
          if (!hasAll) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'featured') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        }
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'newest') return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        if (filters.sortBy === 'sqft') return b.sqft - a.sqft;
        return 0;
      });
  }, [properties, filters]);

  const savedPropertiesList = useMemo(() => {
    return properties.filter((p) => savedIds.includes(p.id));
  }, [properties, savedIds]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        totalProperties={properties.length}
      />

      {/* Main App Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Sticky Header */}
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenSavedModal={() => setIsSavedModalOpen(true)}
          savedCount={savedIds.length}
          searchQuery={filters.searchQuery}
          onSearchChange={(q) => handleFilterUpdate({ searchQuery: q })}
          currency={currency}
          onCurrencyChange={setCurrency}
          properties={properties}
        />

        {/* Dynamic Main Workspace View */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
          {currentTab === 'properties' || currentTab === 'dashboard' ? (
            <div className="space-y-6">
              {/* Dynamic Filter Bar */}
              <FilterBar
                filters={filters}
                onFilterChange={handleFilterUpdate}
                onResetFilters={handleResetFilters}
                totalFiltered={filteredProperties.length}
                currency={currency}
              />

              {/* View Modes Rendering */}
              {filteredProperties.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Home className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No matching luxury estates</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    We couldn't find any properties matching your current filter parameters. Try adjusting the price slider or resetting filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : filters.viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      currency={currency}
                      isSaved={savedIds.includes(prop.id)}
                      onToggleSave={handleToggleSave}
                      onSelectProperty={setSelectedProperty}
                      onOpenTourModal={setTourProperty}
                    />
                  ))}
                </div>
              ) : filters.viewMode === 'list' ? (
                /* List View matching the exact Dribbble table format */
                <div className="space-y-3">
                  {filteredProperties.map((prop) => (
                    <PropertyRow
                      key={prop.id}
                      property={prop}
                      currency={currency}
                      isSaved={savedIds.includes(prop.id)}
                      onToggleSave={handleToggleSave}
                      onSelectProperty={setSelectedProperty}
                      onOpenTourModal={setTourProperty}
                    />
                  ))}
                </div>
              ) : (
                /* Map & Split View */
                <PropertyMapSplitView
                  properties={filteredProperties}
                  currency={currency}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onSelectProperty={setSelectedProperty}
                  onOpenTourModal={setTourProperty}
                />
              )}
            </div>
          ) : (
            /* Secondary tabs (Tours, Clients, Analytics, Financials, Settings) */
            <SecondaryViews
              currentTab={currentTab}
              properties={properties}
              currency={currency}
              onNavigateToProperties={() => setCurrentTab('properties')}
            />
          )}
        </main>
      </div>

      {/* Property Details Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        currency={currency}
        isSaved={selectedProperty ? savedIds.includes(selectedProperty.id) : false}
        onToggleSave={handleToggleSave}
        onOpenTourModal={(p) => {
          setSelectedProperty(null);
          setTourProperty(p);
        }}
      />

      {/* Add New Property Modal */}
      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProperty={handleAddProperty}
        currency={currency}
      />

      {/* Schedule Tour VIP Modal */}
      <ScheduleTourModal
        property={tourProperty}
        isOpen={Boolean(tourProperty)}
        onClose={() => setTourProperty(null)}
      />

      {/* Saved Properties Drawer */}
      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedProperties={savedPropertiesList}
        onRemoveSaved={handleToggleSave}
        onSelectProperty={(p) => {
          setIsSavedModalOpen(false);
          setSelectedProperty(p);
        }}
        currency={currency}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div 
          id="system-toast"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-5 duration-300"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
