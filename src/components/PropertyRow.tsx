import React from 'react';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  MapPin, 
  Heart, 
  Eye, 
  CalendarDays,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { Property } from '../types';
import { CurrencyCode, formatCurrency } from '../utils/currency';

interface PropertyRowProps {
  property: Property;
  currency: string;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenTourModal: (property: Property) => void;
}

export const PropertyRow: React.FC<PropertyRowProps> = ({
  property,
  currency,
  isSaved,
  onToggleSave,
  onSelectProperty,
  onOpenTourModal
}) => {
  const formattedPrice = formatCurrency(property.price, currency as CurrencyCode);

  const getStatusBadge = (status: Property['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
      case 'Under Contract':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'For Sale':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'For Rent':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Sold':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div 
      id={`property-row-${property.id}`}
      className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
    >
      {/* Col 1: Property Image + Main Details */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div 
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 cursor-pointer"
          onClick={() => onSelectProperty(property)}
        >
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {property.verified && (
            <div className="absolute bottom-1 right-1 bg-blue-600 text-white p-0.5 rounded-full shadow-xs">
              <CheckCircle2 className="w-3 h-3" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
              {property.type}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {property.mlsId}
            </span>
          </div>

          <h3 
            onClick={() => onSelectProperty(property)}
            className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate cursor-pointer"
          >
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.address}, {property.city}, {property.state}</span>
          </div>
        </div>
      </div>

      {/* Col 2: Status Pill */}
      <div className="flex md:flex-col items-center md:items-start justify-between w-full md:w-auto gap-1">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider md:hidden">Status:</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(property.status)}`}>
          {property.status}
        </span>
      </div>

      {/* Col 3: Specs (Beds, Baths, Sqft) */}
      <div className="flex items-center gap-4 sm:gap-6 bg-slate-50 md:bg-transparent px-3 py-2 md:p-0 rounded-xl w-full md:w-auto justify-around md:justify-start">
        <div className="flex items-center gap-1.5 text-slate-700">
          <Bed className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold">{property.beds}</span>
          <span className="text-[11px] text-slate-400">Beds</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700">
          <Bath className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold">{property.baths}</span>
          <span className="text-[11px] text-slate-400">Baths</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700">
          <Maximize2 className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold">{property.sqft.toLocaleString()}</span>
          <span className="text-[11px] text-slate-400">Sq Ft</span>
        </div>
      </div>

      {/* Col 4: Price & Period */}
      <div className="w-full md:w-36 text-left md:text-right flex items-baseline md:flex-col justify-between md:justify-center">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider md:hidden">Price:</span>
        <div>
          <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {formattedPrice}
          </span>
          {property.pricePeriod === 'month' && (
            <span className="text-xs text-slate-500 font-medium ml-1">/mo</span>
          )}
        </div>
      </div>

      {/* Col 5: Agent Info */}
      <div className="hidden lg:flex items-center gap-2.5 w-36">
        <img
          src={property.agent.avatar}
          alt={property.agent.name}
          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
        />
        <div className="truncate">
          <p className="text-xs font-bold text-slate-800 truncate">{property.agent.name}</p>
          <p className="text-[10px] text-slate-400">Listing Broker</p>
        </div>
      </div>

      {/* Col 6: Actions */}
      <div className="flex items-center justify-end gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
        <button
          id={`row-save-btn-${property.id}`}
          onClick={() => onToggleSave(property.id)}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-slate-200 transition-colors"
          title="Save to Favorites"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        <button
          id={`row-tour-btn-${property.id}`}
          onClick={() => onOpenTourModal(property)}
          className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
          title="Schedule Tour"
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tour</span>
        </button>

        <button
          id={`row-details-btn-${property.id}`}
          onClick={() => onSelectProperty(property)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>
      </div>
    </div>
  );
};
