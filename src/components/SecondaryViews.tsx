import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CalendarDays, 
  Users, 
  BadgeDollarSign, 
  Settings, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Phone,
  Mail
} from 'lucide-react';
import { Property } from '../types';

interface SecondaryViewsProps {
  currentTab: string;
  properties: Property[];
  currency: string;
  onNavigateToProperties: () => void;
}

export const SecondaryViews: React.FC<SecondaryViewsProps> = ({
  currentTab,
  properties,
  currency,
  onNavigateToProperties
}) => {
  if (currentTab === 'tours') {
    const upcomingTours = [
      {
        id: 't-1',
        propertyName: 'The Azure Horizon Coastal Villa',
        clientName: 'Julian & Claire Montgomery',
        time: 'Today • 02:00 PM',
        format: 'Private In-Person Showing',
        agent: 'Elena Rostova',
        status: 'Confirmed'
      },
      {
        id: 't-2',
        propertyName: 'Solarium Sky Penthouse',
        clientName: 'Dr. Alistair Vance',
        time: 'Tomorrow • 11:30 AM',
        format: 'Live Video Walkthrough',
        agent: 'Marcus Sterling',
        status: 'VIP Cleared'
      },
      {
        id: 't-3',
        propertyName: 'The Glass Pavilion at Aspen Peak',
        clientName: 'Helena Bergström',
        time: 'Friday • 04:00 PM',
        format: 'Helicopter Aerial & Ground Tour',
        agent: 'Elena Rostova',
        status: 'Scheduled'
      }
    ];

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">VIP Showings & Tour Schedule</h2>
            <p className="text-xs text-slate-500">Upcoming client walkthroughs and private appraisals</p>
          </div>
          <button 
            onClick={onNavigateToProperties}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
          >
            Browse Properties to Schedule
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingTours.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {t.status}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t.time}</span>
                  </div>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">{t.propertyName}</h3>
                <p className="text-xs text-slate-600">Client: <span className="font-bold text-slate-900">{t.clientName}</span></p>
                <p className="text-xs text-blue-600 font-medium">{t.format}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Broker: {t.agent}</span>
                <span className="font-bold text-slate-800">Gate Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentTab === 'clients') {
    const clientsList = [
      { name: 'Harrison Sterling', interest: 'Waterfront Malibu Estates', budget: '$15M - $25M', status: 'Pre-Approved Cash', phone: '+1 (310) 991-8821' },
      { name: 'Dr. Evelyn Morales', interest: 'Brickell Sky Penthouses', budget: '$3M - $5M', status: 'In Escrow Negotiation', phone: '+1 (305) 441-2900' },
      { name: 'Victor De Vries', interest: 'Aspen Alpine Ski-in Mansions', budget: '$8M+', status: 'Private Client Portfolio', phone: '+1 (970) 555-0142' }
    ];

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">High-Net-Worth Client Directory</h2>
          <p className="text-xs text-slate-500">Active portfolio buyers, family offices, and verified international investors</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {clientsList.map((c, i) => (
              <div key={i} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">
                    {c.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{c.name}</h3>
                    <p className="text-xs text-slate-500">Targeting: <span className="font-medium text-slate-700">{c.interest}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <p className="text-slate-400">Budget Range</p>
                    <p className="font-bold text-slate-900">{c.budget}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {c.status}
                  </span>
                  <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentTab === 'analytics') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Luxury Market Intelligence</h2>
          <p className="text-xs text-slate-500">Real-time valuation metrics, days-on-market velocity, and price per sqft</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase">Avg Sale Price / Sq Ft</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">{currency}1,480</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">+6.8% YoY</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Corridor: Malibu, Aspen & South Florida</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase">Portfolio Absorption Rate</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">22 Days</span>
              <span className="text-xs font-bold text-blue-600 flex items-center">-4.2 Days</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Ultra-luxury tier ($5M+ segment)</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Managed Asset Value</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">{currency}42.8M</span>
              <span className="text-xs font-bold text-emerald-600">+14.2%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Across 8 active exclusive representations</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentTab === 'financials') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Escrow & Financial Settlements</h2>
          <p className="text-xs text-slate-500">Transaction pipeline, earnest money escrows, and advisory commission schedules</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase">Active Deal</span>
              <h3 className="text-base font-bold text-slate-900">Cascadia Contemporary Haven (Bird Streets)</h3>
            </div>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Escrow Day 14 of 30
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Agreed Lease Amount</span>
              <p className="font-bold text-slate-900 text-sm">{currency}12,400 / mo</p>
            </div>
            <div>
              <span className="text-slate-400">Security Deposit Escrow</span>
              <p className="font-bold text-slate-900 text-sm">{currency}37,200 Held</p>
            </div>
            <div>
              <span className="text-slate-400">Inspection Status</span>
              <p className="font-bold text-slate-900 text-sm text-emerald-600">Passed / Completed</p>
            </div>
            <div>
              <span className="text-slate-400">Brokerage Advisory Yield</span>
              <p className="font-bold text-slate-900 text-sm">{currency}14,880</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentTab === 'settings') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Brokerage & UI Settings</h2>
          <p className="text-xs text-slate-500">Company configuration, MLS syndication credentials, and UI theme preferences</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Company Legal Identity</label>
            <input
              type="text"
              readOnly
              value="ZAVILLA Luxury Real Estate Group Ltd."
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">MLS Syndication Network</label>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-800">RESO Web API & IDX Luxury Gateway</span>
              </div>
              <span className="text-emerald-600 font-bold">Connected</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Design Font & Typography</label>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <p className="font-semibold text-slate-800">Plus Jakarta Sans</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Geometric modernist typography matching the original Dribbble dashboard specification.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
