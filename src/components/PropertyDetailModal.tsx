import React, { useState } from 'react';
import { 
  X, 
  Bed, 
  Bath, 
  Maximize2, 
  Car, 
  Calendar, 
  MapPin, 
  Heart, 
  Share2, 
  Star, 
  Sparkles, 
  Check, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Calculator,
  Compass,
  FileText,
  Building2,
  DollarSign
} from 'lucide-react';
import { Property } from '../types';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  currency: string;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenTourModal: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  currency,
  isSaved,
  onToggleSave,
  onOpenTourModal
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'floorplan'>('overview');
  const [copySuccess, setCopySuccess] = useState(false);

  if (!property) return null;

  const images = property.galleryImages?.length > 0 ? property.galleryImages : [property.imageUrl];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const totalMonthlyEst = 
    property.monthlyExpenses.propertyTax + 
    property.monthlyExpenses.hoa + 
    property.monthlyExpenses.homeInsurance + 
    property.monthlyExpenses.utilitiesEst;

  return (
    <div 
      id="property-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="property-detail-modal-content"
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              {property.type}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {property.mlsId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="detail-share-btn"
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 border border-slate-200 transition-colors relative"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
              {copySuccess && (
                <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  Link Copied!
                </span>
              )}
            </button>

            <button
              id="detail-save-btn"
              onClick={() => onToggleSave(property.id)}
              className="p-2 rounded-xl text-slate-600 hover:text-rose-500 hover:bg-rose-50 border border-slate-200 transition-colors"
              title="Save property"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              id="detail-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Main Gallery Showcase */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 sm:aspect-21/9 rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={images[activeImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-slate-900/80 backdrop-blur-md shadow-md">
                  {property.status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-slate-900 bg-white/90 backdrop-blur-md shadow-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{property.rating}</span>
                </span>
              </div>
            </div>

            {/* Thumbnails strip */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 sm:w-24 aspect-16/10 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-blue-600 ring-2 ring-blue-600/30'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {property.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
                {currency}{property.price.toLocaleString()}
              </span>
              {property.pricePeriod === 'month' && (
                <span className="text-sm font-semibold text-slate-500 ml-1">/ month</span>
              )}
              <div className="text-xs text-slate-400 font-medium mt-0.5">
                {property.listingType === 'sale' ? 'Estimated Mortgage Available' : 'Utilities & Pool Maintenance Extra'}
              </div>
            </div>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-xs border border-slate-100">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Bedrooms</p>
                <p className="text-sm font-bold text-slate-800">{property.beds} Suites</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-xs border border-slate-100">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Bathrooms</p>
                <p className="text-sm font-bold text-slate-800">{property.baths} Baths</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-xs border border-slate-100">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Interior Living</p>
                <p className="text-sm font-bold text-slate-800">{property.sqft.toLocaleString()} sq ft</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-xs border border-slate-100">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Garage Space</p>
                <p className="text-sm font-bold text-slate-800">{property.garages} Vehicles</p>
              </div>
            </div>

            <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-xs border border-slate-100">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Year Built</p>
                <p className="text-sm font-bold text-slate-800">{property.builtYear}</p>
              </div>
            </div>
          </div>

          {/* Detail Tabs */}
          <div className="border-b border-slate-200 flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-sm font-bold transition-all relative ${
                activeTab === 'overview'
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview & Amenities
              {activeTab === 'overview' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('financials')}
              className={`pb-3 text-sm font-bold transition-all relative ${
                activeTab === 'financials'
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Financials & Monthly Escrow
              {activeTab === 'financials' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('floorplan')}
              className={`pb-3 text-sm font-bold transition-all relative ${
                activeTab === 'floorplan'
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Architectural Layout
              {activeTab === 'floorplan' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          </div>

          {/* Tab Content 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Property Description</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Curated Luxury Features</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {property.amenities.map((amenity, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Financials */}
          {activeTab === 'financials' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">Estimated Monthly Carrying Cost</span>
                  <span className="text-base font-black text-slate-900">{currency}{totalMonthlyEst.toLocaleString()} / mo</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-600">Property Tax Assessment (Annualized)</span>
                    <span className="font-bold text-slate-800">{currency}{property.monthlyExpenses.propertyTax.toLocaleString()} / mo</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-600">HOA & Community Gated Maintenance</span>
                    <span className="font-bold text-slate-800">{currency}{property.monthlyExpenses.hoa.toLocaleString()} / mo</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-600">Hazard & Umbrella Property Insurance</span>
                    <span className="font-bold text-slate-800">{currency}{property.monthlyExpenses.homeInsurance.toLocaleString()} / mo</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-600">Estimated Smart Climate Utilities</span>
                    <span className="font-bold text-slate-800">{currency}{property.monthlyExpenses.utilitiesEst.toLocaleString()} / mo</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: Architectural Layout */}
          {activeTab === 'floorplan' && (
            <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center min-h-[220px]">
              <Compass className="w-10 h-10 text-blue-400 mb-2 stroke-[1.5]" />
              <h4 className="text-base font-bold mb-1">Architectural Blueprints & 3D Tour</h4>
              <p className="text-xs text-slate-400 max-w-md mb-4">
                Verified high-resolution schematic available for {property.title}. Total floor area of {property.sqft.toLocaleString()} sq ft over {property.beds} bedrooms and {property.baths} baths.
              </p>
              <button 
                onClick={() => onOpenTourModal(property)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md"
              >
                Launch Virtual 3D Walkthrough
              </button>
            </div>
          )}

          {/* Exclusive Listing Agent Card */}
          <div className="p-4 rounded-2xl bg-linear-to-r from-slate-50 to-blue-50/40 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={property.agent.avatar}
                alt={property.agent.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900">{property.agent.name}</h4>
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs text-slate-500">{property.agent.role} • ZAVILLA Luxury Division</p>
                <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-0.5">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span>{property.agent.rating} Broker Rating</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${property.agent.phone}`}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Call Agent</span>
              </a>
              <a
                href={`mailto:${property.agent.email}`}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Direct Inquire</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenTourModal(property);
              }}
              className="px-4 py-2 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl transition-colors"
            >
              Schedule Private Showing
            </button>
            <button
              onClick={() => {
                alert(`Inquiry sent to ${property.agent.name} for ${property.title}! A ZAVILLA representative will connect shortly.`);
                onClose();
              }}
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm shadow-blue-600/30 transition-all"
            >
              Request Portfolio Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
