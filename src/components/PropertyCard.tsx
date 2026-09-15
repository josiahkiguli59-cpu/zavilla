import React from 'react';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  MapPin, 
  Heart, 
  Star, 
  Eye, 
  Sparkles,
  Car
} from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  currency: string;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenTourModal: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  currency,
  isSaved,
  onToggleSave,
  onSelectProperty,
  onOpenTourModal
}) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const getStatusBadge = (status: Property['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500 text-white';
      case 'Pending':
      case 'Under Contract':
        return 'bg-amber-500 text-white';
      case 'For Sale':
        return 'bg-blue-600 text-white';
      case 'For Rent':
        return 'bg-indigo-600 text-white';
      case 'Sold':
        return 'bg-slate-500 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <div 
      id={`property-card-${property.id}`}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Media & Badges */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelectProperty(property)}>
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs tracking-wide uppercase ${getStatusBadge(property.status)}`}>
              {property.status}
            </span>
            {property.featured && (
              <span className="hidden sm:flex items-center gap-1 text-[11px] font-bold bg-white/90 backdrop-blur-xs text-slate-900 px-2 py-1 rounded-full shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>Featured</span>
              </span>
            )}
          </div>

          {/* Save Button */}
          <button
            id={`save-btn-${property.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(property.id);
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white text-slate-700 hover:text-rose-500 flex items-center justify-center transition-all shadow-sm"
            aria-label="Save Property"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Bottom overlay: Price */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-white">
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-xs">
              {currency}{formatPrice(property.price)}
            </span>
            {property.pricePeriod === 'month' && (
              <span className="text-xs font-medium text-slate-200 ml-1">/ month</span>
            )}
          </div>
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-lg text-xs font-semibold text-white">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{property.rating}</span>
            <span className="text-slate-300 text-[10px]">({property.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {property.type}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {property.mlsId}
            </span>
          </div>

          <h3 
            onClick={() => onSelectProperty(property)}
            className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
          >
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.address}, {property.city}</span>
          </div>

          {/* Specs Pill Strip */}
          <div className="grid grid-cols-4 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 mb-4 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                <Bed className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-800">{property.beds}</span>
              <span className="text-[10px] text-slate-400">Beds</span>
            </div>
            <div className="flex flex-col items-center border-l border-slate-200">
              <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                <Bath className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-800">{property.baths}</span>
              <span className="text-[10px] text-slate-400">Baths</span>
            </div>
            <div className="flex flex-col items-center border-l border-slate-200">
              <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-800">{property.sqft.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">Sq Ft</span>
            </div>
            <div className="flex flex-col items-center border-l border-slate-200">
              <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                <Car className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-800">{property.garages}</span>
              <span className="text-[10px] text-slate-400">Cars</span>
            </div>
          </div>
        </div>

        {/* Footer: Agent & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={property.agent.avatar}
              alt={property.agent.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">{property.agent.name}</p>
              <p className="text-[10px] text-slate-400 truncate">Agent</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id={`book-tour-btn-${property.id}`}
              onClick={() => onOpenTourModal(property)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Tour
            </button>
            <button
              id={`view-details-btn-${property.id}`}
              onClick={() => onSelectProperty(property)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1"
            >
              <Eye className="w-3 h-3" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
