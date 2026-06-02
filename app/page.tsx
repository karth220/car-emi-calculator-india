'use client';

import React, { useState, useEffect } from 'react';
import { getLocalCars } from '../lib/data';
import { Car } from '../lib/types';
import CarCatalog from '../components/CarCatalog';
import EmiCalculator from '../components/EmiCalculator';
import Link from 'next/link';
import { ArrowLeftRight, X } from 'lucide-react';

export default function HomePage() {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [comparingCars, setComparingCars] = useState<Car[]>([]);
  const [carsList, setCarsList] = useState<Car[]>([]);

  // Load cars & comparing state from localStorage (client-side safe)
  useEffect(() => {
    const list = getLocalCars();
    setCarsList(list);
    
    // Choose default car
    const defaultCar = list.find((c) => c.featured) || list[0];
    setSelectedCar(defaultCar);

    const saved = localStorage.getItem('comparingCars');
    if (saved) {
      try {
        const ids = JSON.parse(saved) as string[];
        const loaded = list.filter((c) => ids.includes(c.id));
        setComparingCars(loaded);
      } catch (e) {
        console.error('Failed to parse comparing cars', e);
      }
    }
  }, []);

  const handleSelectCar = (car: Car) => {
    setSelectedCar(car);
    // Smooth scroll to calculator on mobile
    const calcElement = document.getElementById('emi-calculator-section');
    if (calcElement) {
      calcElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCompareToggle = (car: Car) => {
    let updated: Car[];
    if (comparingCars.some((c) => c.id === car.id)) {
      updated = comparingCars.filter((c) => c.id !== car.id);
    } else {
      if (comparingCars.length >= 3) {
        alert('You can compare up to 3 cars at a time.');
        return;
      }
      updated = [...comparingCars, car];
    }
    setComparingCars(updated);
    localStorage.setItem('comparingCars', JSON.stringify(updated.map((c) => c.id)));
  };

  const removeCompareCar = (id: string) => {
    const updated = comparingCars.filter((c) => c.id !== id);
    setComparingCars(updated);
    localStorage.setItem('comparingCars', JSON.stringify(updated.map((c) => c.id)));
  };

  const clearAllCompare = () => {
    setComparingCars([]);
    localStorage.removeItem('comparingCars');
  };

  const compareUrl = `/compare?ids=${comparingCars.map((c) => c.id).join(',')}`;

  return (
    <div className="space-y-8 relative pb-20">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          India's Smartest <span className="text-blue-600 dark:text-blue-400">Car EMI</span> & On-Road Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold max-w-xl mx-auto">
          Get realistic state-specific RTO taxes, comprehensive bank rate comparisons, down-payment recommendations, and amortization schedules.
        </p>
      </div>

      {/* Primary Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Car catalog selection (5 cols) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Choose Car Model
            </h2>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold dark:bg-blue-950/40 dark:text-blue-400">
              {carsList.length} Available
            </span>
          </div>
          
          <CarCatalog
            selectedCar={selectedCar}
            comparingCars={comparingCars}
            onSelectCar={handleSelectCar}
            onCompareToggle={handleCompareToggle}
          />
        </div>

        {/* Right Column: Calculations & Dashboard (7 cols) */}
        <div id="emi-calculator-section" className="xl:col-span-7 space-y-6 xl:sticky xl:top-20">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              2. EMI & On-Road Price Dashboard
            </h2>
            {selectedCar && (
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold dark:bg-emerald-950/40 dark:text-emerald-400">
                Active: {selectedCar.brand} {selectedCar.model}
              </span>
            )}
          </div>
          
          {selectedCar ? (
            <EmiCalculator car={selectedCar} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-24 text-center dark:border-slate-800 dark:bg-slate-900/60">
              <span className="text-4xl mb-4">🚗</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Car Selected</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                Select a car from the catalog on the left to start calculating live RTO tax and monthly payments.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Floating Comparison Drawer (Premium UX details) */}
      {comparingCars.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="rounded-2xl border border-violet-500/20 bg-slate-900/90 text-white p-4 shadow-xl backdrop-blur-md flex items-center justify-between gap-4">
            
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-violet-400">Compare Models</span>
              <div className="flex items-center gap-1.5 mt-1">
                {comparingCars.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-xs font-semibold"
                  >
                    <span className="truncate max-w-[80px]">{c.model}</span>
                    <button
                      onClick={() => removeCompareCar(c.id)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearAllCompare}
                className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1"
              >
                Clear
              </button>
              <Link
                href={compareUrl}
                className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-violet-700 transition-colors shadow-md shadow-violet-600/10"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
                <span>Compare ({comparingCars.length})</span>
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
