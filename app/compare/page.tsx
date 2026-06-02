'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getLocalCars, STATES } from '../../lib/data';
import { Car } from '../../lib/types';
import { calculateOnRoadPrice, calculateEMI } from '../../lib/calculator';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Info, Sparkles } from 'lucide-react';

function CompareContent() {
  const searchParams = useSearchParams();
  const [carsToCompare, setCarsToCompare] = useState<Car[]>([]);
  const [selectedStateCode, setSelectedStateCode] = useState('KA');
  
  // Global loan adjusters
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(9.0);
  const [tenureYears, setTenureYears] = useState(5);

  useEffect(() => {
    const idsString = searchParams.get('ids');
    if (idsString) {
      const ids = idsString.split(',').filter(Boolean);
      const list = getLocalCars();
      const loaded = list.filter((c) => ids.includes(c.id));
      setCarsToCompare(loaded.slice(0, 3)); // Limit to 3
    }
  }, [searchParams]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getPriceRange = (car: Car) => {
    const prices = car.variants.map((v) => v.exShowroomPrice);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  if (carsToCompare.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-24 text-center dark:border-slate-800 dark:bg-slate-900/60 max-w-lg mx-auto">
        <span className="text-4xl mb-4">🆚</span>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Cars Selected for Comparison</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 px-6">
          Go back to the catalog and click the comparison icon (double arrow) on up to 3 cars.
        </p>
        <Link
          href="/"
          className="mt-6 flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1.5">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Calculator</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Compare Cars & Loan Details</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Comparing {carsToCompare.length} models side-by-side with global loan adjustments.
          </p>
        </div>

        {/* Global Selectors */}
        <div className="flex flex-wrap gap-3 bg-slate-50 p-3 rounded-2xl dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase">State Tax Location</span>
            <select
              value={selectedStateCode}
              onChange={(e) => setSelectedStateCode(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white p-1 text-[11px] font-extrabold outline-none dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-white"
            >
              {STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Global Loan Adjusters drawer */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
          Adjust Global Loan Terms (Applies to all)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Downpayment */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Down Payment ({downPaymentPct}%)</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(parseInt(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-blue-600"
            />
          </div>
          {/* Interest */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Interest Rate ({interestRate}%)</span>
            </div>
            <input
              type="range"
              min="7.0"
              max="15.0"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-blue-600"
            />
          </div>
          {/* Tenure */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Tenure ({tenureYears} Years)</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(parseInt(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Grid columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Specs labels (Left 3 columns on desktop) */}
        <div className="hidden md:block md:col-span-3 rounded-2xl bg-slate-50 border border-slate-200/50 p-4 space-y-4 font-bold text-xs dark:bg-slate-900 dark:border-slate-800 text-slate-500 uppercase tracking-wider select-none">
          <div className="h-56 flex items-center">Model Detail</div>
          <div className="py-2.5 border-b border-slate-200 dark:border-slate-800">Base Price (Ex-Showroom)</div>
          <div className="py-2.5 border-b border-slate-200 dark:border-slate-800">Est. On-Road Price</div>
          <div className="py-2.5 border-b border-slate-200 dark:border-slate-800 font-extrabold text-blue-600 dark:text-blue-400">Monthly EMI</div>
          <div className="py-2.5 border-b border-slate-200 dark:border-slate-800">Safety Rating</div>
          <div className="py-2.5 border-b border-slate-200 dark:border-slate-800">Engine Spec</div>
          <div className="py-2.5 border-b border-slate-200 dark:border-slate-800">Fuel Economy</div>
          <div className="py-2.5 border-b border-slate-200 dark:border-slate-800">Transmission</div>
          <div className="py-2.5">Seats</div>
        </div>

        {/* Cars list (Right 9 columns) */}
        <div className={`md:col-span-9 grid gap-4 grid-cols-1 sm:grid-cols-${carsToCompare.length}`}>
          {carsToCompare.map((car) => {
            const range = getPriceRange(car);
            const breakdown = calculateOnRoadPrice(range.min, selectedStateCode, car.fuelType[0]);
            const loan = breakdown.onRoadPrice - (breakdown.onRoadPrice * (downPaymentPct / 100));
            const emi = calculateEMI(loan, interestRate, tenureYears);

            return (
              <div
                key={car.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4 dark:border-slate-800 dark:bg-slate-900/60 flex flex-col justify-between"
              >
                {/* Visual Header */}
                <div className="space-y-2">
                  <div className="relative aspect-video w-full bg-slate-50 rounded-xl flex items-center justify-center p-3 overflow-hidden border border-slate-100 dark:bg-slate-950/40 dark:border-slate-800 h-36">
                    {car.images.front ? (
                      <img
                        src={car.images.front}
                        alt={car.model}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <span className="text-xl">🚗</span>
                        <span className="text-[9px] uppercase font-bold tracking-widest">{car.brand}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{car.brand}</span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{car.model}</h3>
                    <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold dark:bg-slate-800 dark:text-slate-300">
                      {car.bodyType}
                    </span>
                  </div>
                </div>

                {/* Specs comparison */}
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 divide-y divide-slate-100 dark:divide-slate-800">
                  
                  {/* Price */}
                  <div className="py-2.5 flex justify-between md:block">
                    <span className="md:hidden text-slate-400 uppercase">Ex-Showroom:</span>
                    <span className="font-bold">{formatCurrency(range.min)}</span>
                  </div>
                  
                  {/* On Road */}
                  <div className="py-2.5 flex justify-between md:block font-bold">
                    <span className="md:hidden text-slate-400 uppercase">On-Road ({selectedStateCode}):</span>
                    <span>{formatCurrency(breakdown.onRoadPrice)}</span>
                  </div>

                  {/* EMI */}
                  <div className="py-2.5 flex justify-between md:block text-blue-600 dark:text-blue-400 font-extrabold text-sm">
                    <span className="md:hidden text-slate-400 uppercase">EMI:</span>
                    <span>{formatCurrency(emi)} <span className="text-[10px] font-bold text-slate-400">/mo</span></span>
                  </div>

                  {/* Safety */}
                  <div className="py-2.5 flex justify-between md:block">
                    <span className="md:hidden text-slate-400 uppercase">Safety:</span>
                    {car.safetyRating > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-[10px] font-bold border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900">
                        <ShieldCheck className="h-3 w-3" />
                        {car.safetyRating}★ GNCAP
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold">N/A</span>
                    )}
                  </div>

                  {/* Engine */}
                  <div className="py-2.5 flex justify-between md:block">
                    <span className="md:hidden text-slate-400 uppercase">Engine:</span>
                    <span className="truncate block max-w-[200px]" title={car.specs.engine}>{car.specs.engine.split(',')[0]}</span>
                  </div>

                  {/* Mileage */}
                  <div className="py-2.5 flex justify-between md:block">
                    <span className="md:hidden text-slate-400 uppercase">Fuel Economy:</span>
                    <span>{car.specs.mileage} {car.bodyType === 'EV' ? 'km/chg' : 'kmpl'}</span>
                  </div>

                  {/* Trans */}
                  <div className="py-2.5 flex justify-between md:block">
                    <span className="md:hidden text-slate-400 uppercase">Transmission:</span>
                    <span className="truncate block max-w-[200px]">{car.transmission.join(', ')}</span>
                  </div>

                  {/* Seats */}
                  <div className="py-2.5 flex justify-between md:block">
                    <span className="md:hidden text-slate-400 uppercase">Seating:</span>
                    <span>{car.specs.seatingCapacity} Seater</span>
                  </div>

                </div>

                <Link
                  href={`/?id=${car.id}`}
                  onClick={() => {
                    // Update main page selection if possible
                    window.location.href = `/?id=${car.id}`;
                  }}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 text-xs font-bold text-slate-800 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Open in Calculator</span>
                </Link>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
