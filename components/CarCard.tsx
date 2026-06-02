'use client';

import React from 'react';
import { Car } from '../lib/types';
import { ShieldCheck, Compass, Eye, ArrowLeftRight } from 'lucide-react';

interface CarCardProps {
  car: Car;
  isSelected: boolean;
  isComparing: boolean;
  onSelect: (car: Car) => void;
  onCompareToggle: (car: Car) => void;
}

export default function CarCard({
  car,
  isSelected,
  isComparing,
  onSelect,
  onCompareToggle,
}: CarCardProps) {
  // Safe helper to format pricing into lakhs/crores
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} Lakh`;
  };

  const getMinMaxPrice = () => {
    if (!car.variants || car.variants.length === 0) return 'Price N/A';
    const prices = car.variants.map((v) => v.exShowroomPrice);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return formatPrice(min);
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  };

  const displayImage = car.images.front || '/images/cars/placeholder.png';

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isSelected
          ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10 dark:border-blue-500 dark:bg-blue-950/20'
          : 'border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700'
      }`}
    >
      {/* Safety Rating badge */}
      {car.safetyRating > 0 && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>{car.safetyRating}★ GNCAP</span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative flex aspect-video w-full items-center justify-center bg-slate-50 overflow-hidden dark:bg-slate-950/40">
        {car.images.front ? (
          <img
            src={displayImage}
            alt={`${car.brand} ${car.model}`}
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          // Rich interactive SVG fallback
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4 dark:from-slate-900 dark:to-slate-800">
            <svg className="w-24 h-16 text-slate-400 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11 2 11.3 2 11.6V16c0 .6.4 1 1 1h2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="7.5" cy="17.5" r="2.5" />
              <circle cx="16.5" cy="17.5" r="2.5" />
            </svg>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">{car.brand} Studio Render</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{car.brand}</span>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
            {car.bodyType}
          </span>
        </div>
        <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white leading-tight">{car.model}</h3>

        {/* Technical Specs */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-b border-t border-slate-100 py-3 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase">Engine & Power</span>
            <span className="font-medium text-slate-700 dark:text-slate-200 truncate">{car.specs.engine.split(',')[0]}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase">Transmission</span>
            <span className="font-medium text-slate-700 dark:text-slate-200 truncate">{car.transmission.join(', ')}</span>
          </div>
          <div className="flex flex-col mt-1">
            <span className="text-[10px] text-slate-400 uppercase">Fuel Type</span>
            <span className="font-medium text-slate-700 dark:text-slate-200 truncate">{car.fuelType.join(', ')}</span>
          </div>
          <div className="flex flex-col mt-1">
            <span className="text-[10px] text-slate-400 uppercase">Mileage / Capacity</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {car.specs.mileage} {car.bodyType === 'EV' ? 'km/chg' : 'kmpl'} • {car.specs.seatingCapacity}S
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase">Ex-Showroom</span>
            <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">{getMinMaxPrice()}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onSelect(car)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-colors ${
              isSelected
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>EMI Calc</span>
          </button>
          
          <button
            onClick={() => onCompareToggle(car)}
            className={`flex items-center justify-center rounded-xl p-2 border transition-all ${
              isComparing
                ? 'border-violet-500 bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400'
                : 'border-slate-200 hover:border-slate-300 text-slate-500 dark:border-slate-800 dark:hover:border-slate-700'
            }`}
            title="Add to Compare"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
