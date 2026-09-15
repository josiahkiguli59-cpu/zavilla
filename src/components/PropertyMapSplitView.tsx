import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Navigation, 
  Sparkles,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';
import { CurrencyCode, formatCompactCurrency } from '../utils/currency';

interface PropertyMapSplitViewProps {
  properties: Property[];
  currency: string;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenTourModal: (property: Property) => void;
}

export const PropertyMapSplitView: React.FC<PropertyMapSplitViewProps> = ({
  properties,
  currency,
  savedIds,
  onToggleSave,
  onSelectProperty,
  onOpenTourModal
}) => {
  const [selectedId, setSelectedId] = useState<string>(properties[0]?.id || '');
  const [mapZoom, setMapZoom] = useState(1);
  const [activeAreaFilter, setActiveAreaFilter] = useState('All');

  const selectedProperty = properties.find(p => p.id === selectedId) || properties[0];

  const areas = ['All', 'Malibu', 'Miami', 'Beverly Hills', 'Aspen', 'New York'];

  const filteredByArea = activeAreaFilter === 'All' 
    ? properties 
    : properties.filter(p => p.city.toLowerCase().includes(activeAreaFilter.toLowerCase()) || p.neighborhood.toLowerCase().includes(activeAreaFilter.toLowerCase()));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left / Top: Interactive Map Visual Stage */}
      <div className="lg:col-span-7 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl relative min-h-[480px] lg:min-h-[620px] flex flex-col justify-between p-4 sm:p-6 select-none">
        {/* Background Stylized Luxury Architectural Map Canvas */}
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Abstract Map Topography / Coastal lines */}
        <svg className="absolute inset-0 w-full h-full text-slate-800/40 pointer-events-none stroke-current" fill="none">
          <path d="M 0,150 Q 200,90 400,220 T 800,280 T 1200,180" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 0,320 Q 300,250 600,410 T 1100,340" strokeWidth="1.5" />
          <path d="M 100,0 Q 250,300 450,550 T 850,700" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="280" cy="240" r="140" strokeWidth="1" opacity="0.4" />
          <circle cx="750" cy="380" r="180" strokeWidth="1" opacity="0.3" />
        </svg>

        {/* Top Controls on Map */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/80 shadow-lg">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Zavilla Prime Map</span>
          </div>

          {/* Area filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80">
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => setActiveAreaFilter(area)}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
                  activeAreaFilter === area
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Property Pins on the Map */}
        <div className="relative z-10 flex-1 my-4 min-h-[360px] relative">
          {filteredByArea.map((prop) => {
            const isSelected = prop.id === selectedId;
            return (
              <div
                key={prop.id}
                id={`map-pin-${prop.id}`}
                onClick={() => setSelectedId(prop.id)}
                style={{
                  left: `${prop.coordinates.mapX}%`,
                  top: `${prop.coordinates.mapY}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute cursor-pointer transition-all duration-300 group ${
                  isSelected ? 'z-30 scale-110' : 'z-20 hover:scale-105'
                }`}
              >
                {/* Price Pin Tooltip Tag */}
                <div
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-xs shadow-xl transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white ring-4 ring-blue-400/40 shadow-blue-500/50'
                      : 'bg-white/95 text-slate-900 hover:bg-white hover:text-blue-600'
                  }`}
                >
                  <span>{formatCompactCurrency(prop.price, currency as CurrencyCode)}</span>
                  {prop.pricePeriod === 'month' && <span className="text-[10px] opacity-80">/mo</span>}
                </div>

                {/* Pin Tip Arrow */}
                <div 
                  className={`w-2 h-2 mx-auto rotate-45 -mt-1 transition-colors ${
                    isSelected ? 'bg-blue-600' : 'bg-white'
                  }`} 
                />
              </div>
            );
          })}
        </div>

        {/* Bottom Controls Bar on Map */}
        <div className="relative z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-2 sm:px-4 sm:py-2.5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Navigation className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="hidden sm:inline">Active Geofence:</span>
            <span className="font-semibold text-white">Ultra-Luxury Coastal & Metropolitan Corridor</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 1.8))}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.8))}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right / Bottom: Selected Property Focused Card & Property Scroller */}
      <div className="lg:col-span-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-extrabold text-slate-900">Pin Focus Details</h3>
          </div>
          <span className="text-xs text-slate-500">
            Click any pin on map to inspect
          </span>
        </div>

        {selectedProperty && (
          <div className="transition-all duration-300">
            <PropertyCard
              property={selectedProperty}
              currency={currency}
              isSaved={savedIds.includes(selectedProperty.id)}
              onToggleSave={onToggleSave}
              onSelectProperty={onSelectProperty}
              onOpenTourModal={onOpenTourModal}
            />
          </div>
        )}

        {/* Mini quick list of other properties */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Nearby in this region ({filteredByArea.length})
          </h4>
          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {filteredByArea.map((p) => {
              const isCurrent = p.id === selectedId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{p.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{p.neighborhood}, {p.city}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-blue-600">
                      {formatCompactCurrency(p.price, currency as CurrencyCode)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">{p.beds}b • {p.baths}ba</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
