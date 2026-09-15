import React, { useState } from 'react';
import { X, Plus, Sparkles, Building2, Image as ImageIcon, Check, Upload } from 'lucide-react';
import { Property, PropertyType, PropertyStatus } from '../types';
import { PROPERTY_TYPES, AMENITY_OPTIONS } from '../data/propertiesData';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (newProperty: Property) => void;
  currency: '$' | '€' | '£';
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80'
];

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
  currency
}) => {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [type, setType] = useState<PropertyType>('Villa');
  const [listingType, setListingType] = useState<'rent' | 'sale'>('rent');
  const [status, setStatus] = useState<PropertyStatus>('Available');
  const [price, setPrice] = useState<number>(15000);
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('Malibu');
  const [stateVal, setStateVal] = useState('CA');
  const [zipCode, setZipCode] = useState('90265');
  const [beds, setBeds] = useState(4);
  const [baths, setBaths] = useState(4.5);
  const [sqft, setSqft] = useState(5200);
  const [garages, setGarages] = useState(3);
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Private Infinity Pool',
    'Smart Home Automation',
    'Ocean View'
  ]);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleGalleryImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    const uploadedImageUrl = URL.createObjectURL(file);
    setSelectedImage(uploadedImageUrl);
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      title,
      tagline: tagline || 'Luxury architectural residence in premier enclave',
      price: Number(price),
      pricePeriod: listingType === 'rent' ? 'month' : 'sale',
      currency,
      type,
      status,
      listingType,
      address: address || '100 Ocean Crest Boulevard',
      neighborhood: neighborhood || 'Coastal Terrace',
      city: city || 'Malibu',
      state: stateVal || 'CA',
      zipCode: zipCode || '90265',
      coordinates: {
        lat: 34.0259,
        lng: -118.7798,
        mapX: 30 + Math.floor(Math.random() * 40),
        mapY: 30 + Math.floor(Math.random() * 40)
      },
      beds: Number(beds),
      baths: Number(baths),
      sqft: Number(sqft),
      garages: Number(garages),
      builtYear: 2024,
      rating: 5.0,
      reviewsCount: 1,
      imageUrl: selectedImage,
      galleryImages: [selectedImage, PRESET_IMAGES[1], PRESET_IMAGES[2]],
      featured: true,
      verified: true,
      amenities: selectedAmenities,
      agent: {
        name: 'Sophia Vance',
        role: 'Senior Managing Partner',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        phone: '+1 (310) 555-0199',
        email: 'sophia@zavilla.estate',
        rating: 4.98
      },
      description: description || 'Exceptional contemporary design with custom natural finishes, open gallery floorplan, and state-of-the-art smart home integration.',
      mlsId: `MLS-ZV-${Math.floor(10000 + Math.random() * 90000)}`,
      addedDate: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      savedCount: 0,
      monthlyExpenses: {
        propertyTax: Math.round(Number(price) * 0.008),
        hoa: 500,
        homeInsurance: 350,
        utilitiesEst: 300
      }
    };

    onAddProperty(newProp);
    onClose();
  };

  return (
    <div 
      id="add-property-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="add-property-modal-content"
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add New ZAVILLA Listing</h2>
              <p className="text-xs text-slate-500">Publish a verified property to the portfolio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Listing Type & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Listing Type</label>
              <select
                value={listingType}
                onChange={(e) => setListingType(e.target.value as 'rent' | 'sale')}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-600"
              >
                <option value="rent">For Rent (Monthly)</option>
                <option value="sale">For Sale (Full Acquisition)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Property Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-600"
              >
                {PROPERTY_TYPES.filter(t => t !== 'All Types').map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Listing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-600"
              >
                <option value="Available">Available</option>
                <option value="Pending">Pending Escrow</option>
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
              </select>
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Property Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. The Palisades Panorama Residence"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tagline Highlight</label>
              <input
                type="text"
                placeholder="e.g. Unobstructed Pacific sunset vistas with negative edge infinity pool"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Pricing & Dimensions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price ({currency})</label>
              <input
                type="number"
                min="100"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Living Sq Ft</label>
              <input
                type="number"
                value={sqft}
                onChange={(e) => setSqft(Number(e.target.value))}
                className="w-full text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Beds</label>
              <input
                type="number"
                min="1"
                max="20"
                value={beds}
                onChange={(e) => setBeds(Number(e.target.value))}
                className="w-full text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Baths</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="20"
                value={baths}
                onChange={(e) => setBaths(Number(e.target.value))}
                className="w-full text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Address & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                placeholder="e.g. 2140 Ocean Avenue"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Photo Presets */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <label className="block text-xs font-bold text-slate-700">Select Architectural Cover Photo</label>
              <label
                htmlFor="listing-gallery-upload"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload from Gallery</span>
              </label>
              <input
                id="listing-gallery-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleGalleryImageUpload}
              />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_IMAGES.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImage === img
                      ? 'border-blue-600 ring-2 ring-blue-500/40'
                      : 'border-transparent hover:opacity-90'
                  }`}
                >
                  <img src={img} alt="Preset" className="w-full h-full object-cover" />
                  {selectedImage === img && (
                    <div className="absolute top-1 right-1 bg-blue-600 text-white p-0.5 rounded-full shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Amenities checklist */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Included Amenities</label>
            <div className="flex flex-wrap gap-1.5">
              {AMENITY_OPTIONS.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      checked
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Architectural Dossier & Remarks</label>
            <textarea
              rows={3}
              placeholder="Detail the materials, engineering, orientation, and lifestyle benefits..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600"
            />
          </div>

          {/* Submit controls */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Publish Listing to ZAVILLA</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
