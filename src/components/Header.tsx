import React from 'react';
import { 
  Search, 
  Bell, 
  Heart, 
  Plus, 
  Menu, 
  DollarSign, 
  Euro, 
  PoundSterling,
  SlidersHorizontal
} from 'lucide-react';
import { Property } from '../types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenAddModal: () => void;
  onOpenSavedModal: () => void;
  savedCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currency: '$' | '€' | '£';
  onCurrencyChange: (c: '$' | '€' | '£') => void;
  properties: Property[];
  onOpenFilterDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenAddModal,
  onOpenSavedModal,
  savedCount,
  searchQuery,
  onSearchChange,
  currency,
  onCurrencyChange,
  properties,
  onOpenFilterDrawer
}) => {
  const totalCount = properties.length;
  const availableCount = properties.filter(p => p.status === 'Available').length;
  const forSaleCount = properties.filter(p => p.listingType === 'sale').length;
  const forRentCount = properties.filter(p => p.listingType === 'rent').length;

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        {/* Top bar: Breadcrumb + Search + Quick Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Mobile trigger & Page context */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-toggle-btn"
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span>Dashboard</span>
                <span>/</span>
                <span>Properties</span>
                <span>/</span>
                <span className="text-blue-600 font-semibold">Listing Management</span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Property Listings
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                  {totalCount} Properties
                </span>
              </div>
            </div>
          </div>

          {/* Right: Search, Currency, Notifications & Add Property */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-72 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search villas, city, MLS ID..."
                className="w-full pl-9.5 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Currency Selector */}
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/70">
              {(['$', '€', '£'] as const).map((curr) => (
                <button
                  key={curr}
                  id={`currency-btn-${curr}`}
                  onClick={() => onCurrencyChange(curr)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    currency === curr
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title={`Switch currency to ${curr}`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Saved Properties Button */}
            <button
              id="header-saved-btn"
              onClick={onOpenSavedModal}
              className="relative p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 transition-all"
              title="Saved Properties"
            >
              <Heart className={`w-4 h-4 ${savedCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button
              id="header-notifications-btn"
              className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200/80 transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
            </button>

            {/* Mobile Filter Button */}
            {onOpenFilterDrawer && (
              <button
                id="header-mobile-filter-btn"
                onClick={onOpenFilterDrawer}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 border border-slate-200/80 transition-all"
                title="Filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}

            {/* Primary Add Property Button */}
            <button
              id="header-add-property-btn"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/30 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden xs:inline">Add Property</span>
            </button>
          </div>
        </div>

        {/* Quick Portfolio Stat Chips Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between p-2.5 sm:px-3 sm:py-2 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <span className="text-xs text-slate-500 font-medium">Active Portfolio</span>
            <span className="text-sm font-bold text-slate-900">{totalCount} Estates</span>
          </div>
          <div className="flex items-center justify-between p-2.5 sm:px-3 sm:py-2 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <span className="text-xs text-emerald-700 font-medium">Ready / Available</span>
            <span className="text-sm font-bold text-emerald-800">{availableCount} Units</span>
          </div>
          <div className="flex items-center justify-between p-2.5 sm:px-3 sm:py-2 bg-blue-50/60 rounded-xl border border-blue-100">
            <span className="text-xs text-blue-700 font-medium">For Sale</span>
            <span className="text-sm font-bold text-blue-800">{forSaleCount}</span>
          </div>
          <div className="flex items-center justify-between p-2.5 sm:px-3 sm:py-2 bg-amber-50/60 rounded-xl border border-amber-100">
            <span className="text-xs text-amber-700 font-medium">For Lease / Rent</span>
            <span className="text-sm font-bold text-amber-800">{forRentCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
