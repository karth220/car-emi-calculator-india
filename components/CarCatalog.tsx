'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { getLocalCars } from '../lib/data';
import { Car, BodyType, FuelType, TransmissionType } from '../lib/types';
import CarCard from './CarCard';
import { Search, SlidersHorizontal, RotateCcw, X } from 'lucide-react';

interface CarCatalogProps {
  selectedCar: Car | null;
  comparingCars: Car[];
  onSelectCar: (car: Car) => void;
  onCompareToggle: (car: Car) => void;
}

export default function CarCatalog({
  selectedCar,
  comparingCars,
  onSelectCar,
  onCompareToggle,
}: CarCatalogProps) {
  const [carsList, setCarsList] = useState<Car[]>([]);

  useEffect(() => {
    setCarsList(getLocalCars());
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedBodyType, setSelectedBodyType] = useState<BodyType | 'All'>('All');
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType | 'All'>('All');
  const [selectedTransmission, setSelectedTransmission] = useState<TransmissionType | 'All'>('All');
  const [maxBudget, setMaxBudget] = useState<number>(10000000); // 1 Crore default max
  const [selectedSeating, setSelectedSeating] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  // Extract all unique brands from carsList
  const brands = useMemo(() => {
    const list = new Set(carsList.map((c) => c.brand));
    return ['All', ...Array.from(list).sort()];
  }, [carsList]);

  // Filter cars based on current settings
  const filteredCars = useMemo(() => {
    return carsList.filter((car) => {
      // Search term
      const matchesSearch =
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchTerm.toLowerCase());

      // Brand filter
      const matchesBrand = selectedBrand === 'All' || car.brand === selectedBrand;

      // Body Type filter
      const matchesBody = selectedBodyType === 'All' || car.bodyType === selectedBodyType;

      // Fuel filter
      const matchesFuel =
        selectedFuelType === 'All' || car.fuelType.includes(selectedFuelType as FuelType);

      // Transmission filter
      const matchesTrans =
        selectedTransmission === 'All' || car.transmission.includes(selectedTransmission as TransmissionType);

      // Seating capacity
      const matchesSeating =
        selectedSeating === 'All' || car.specs.seatingCapacity === parseInt(selectedSeating);

      // Budget filter (minimum variant price must be <= maxBudget)
      const minPrice = Math.min(...car.variants.map((v) => v.exShowroomPrice));
      const matchesBudget = minPrice <= maxBudget;

      return matchesSearch && matchesBrand && matchesBody && matchesFuel && matchesTrans && matchesSeating && matchesBudget;
    });
  }, [
    searchTerm,
    selectedBrand,
    selectedBodyType,
    selectedFuelType,
    selectedTransmission,
    maxBudget,
    selectedSeating,
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBrand('All');
    setSelectedBodyType('All');
    setSelectedFuelType('All');
    setSelectedTransmission('All');
    setMaxBudget(10000000);
    setSelectedSeating('All');
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedBrand !== 'All') count++;
    if (selectedBodyType !== 'All') count++;
    if (selectedFuelType !== 'All') count++;
    if (selectedTransmission !== 'All') count++;
    if (selectedSeating !== 'All') count++;
    if (maxBudget < 10000000) count++;
    return count;
  }, [selectedBrand, selectedBodyType, selectedFuelType, selectedTransmission, selectedSeating, maxBudget]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Trigger Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by car name, brand, e.g. Thar, Swift, Tata..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-bold transition-all ${
              showFilters || activeFilterCount > 0
                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          
          {(activeFilterCount > 0 || searchTerm) && (
            <button
              onClick={resetFilters}
              className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-slate-500 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
              title="Reset Filters"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Brand Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Body Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Body Segment</label>
              <select
                value={selectedBodyType}
                onChange={(e) => setSelectedBodyType(e.target.value as BodyType | 'All')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                <option value="All">All Segments</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="EV">EV (Electric)</option>
                <option value="Luxury">Luxury / Premium</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fuel Option</label>
              <select
                value={selectedFuelType}
                onChange={(e) => setSelectedFuelType(e.target.value as FuelType | 'All')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                <option value="All">All Fuels</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Transmission */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transmission</label>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value as TransmissionType | 'All')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                <option value="All">All Transmissions</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            {/* Seating Capacity */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Seating Capacity</label>
              <div className="flex gap-2">
                {['All', '4', '5', '7'].map((seat) => (
                  <button
                    key={seat}
                    onClick={() => setSelectedSeating(seat)}
                    className={`flex-1 rounded-xl py-2.5 border text-xs font-bold transition-all ${
                      selectedSeating === seat
                        ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900'
                    }`}
                  >
                    {seat === 'All' ? 'All' : `${seat} Seater`}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget range */}
            <div className="flex flex-col gap-1.5 sm:col-span-2 md:col-span-3">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Max Budget (Ex-Showroom)</label>
                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                  {maxBudget >= 10000000
                    ? 'Unlimited'
                    : `₹${(maxBudget / 100000).toFixed(0)} Lakh`}
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="10000000"
                step="250000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer rounded-lg bg-slate-100 dark:bg-slate-800 accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>₹5 Lakh</span>
                <span>₹25 Lakh</span>
                <span>₹50 Lakh</span>
                <span>₹75 Lakh</span>
                <span>₹1 Crore+</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Catalog Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              isSelected={selectedCar?.id === car.id}
              isComparing={comparingCars.some((c) => c.id === car.id)}
              onSelect={onSelectCar}
              onCompareToggle={onCompareToggle}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900/40">
          <svg className="w-16 h-16 text-slate-300 dark:text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No cars found matching filters</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try broadening your search criteria or resetting filters.</p>
          <button
            onClick={resetFilters}
            className="mt-5 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
