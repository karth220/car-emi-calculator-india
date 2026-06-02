'use client';

import React, { useState, useEffect } from 'react';
import { Car, StateTax, BankRate, CarVariant, BodyType, FuelType, TransmissionType } from '../../lib/types';
import { getLocalCars, saveLocalCars, getLocalStates, saveLocalStates, getLocalBanks, saveLocalBanks } from '../../lib/data';
import { Search, Plus, Trash2, Edit3, Save, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'cars' | 'taxes' | 'banks'>('cars');
  
  // Database States
  const [cars, setCars] = useState<Car[]>([]);
  const [states, setStates] = useState<StateTax[]>([]);
  const [banks, setBanks] = useState<BankRate[]>([]);
  
  // Feedback messages
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search & Forms state
  const [searchCar, setSearchCar] = useState('');
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  
  // Form values for Car
  const [carForm, setCarForm] = useState<{
    brand: string;
    model: string;
    bodyType: BodyType;
    fuelType: FuelType[];
    transmission: TransmissionType[];
    engine: string;
    power: string;
    torque: string;
    mileage: number;
    seatingCapacity: number;
    safetyRating: number;
    featured: boolean;
    variants: CarVariant[];
  }>({
    brand: '',
    model: '',
    bodyType: 'SUV',
    fuelType: ['Petrol'],
    transmission: ['Manual'],
    engine: '1197 cc',
    power: '85 bhp',
    torque: '113 Nm',
    mileage: 18.5,
    seatingCapacity: 5,
    safetyRating: 4,
    featured: false,
    variants: [{ name: 'Base Variant', exShowroomPrice: 600000 }]
  });

  // Load everything on mount
  useEffect(() => {
    setCars(getLocalCars());
    setStates(getLocalStates());
    setBanks(getLocalBanks());
  }, []);

  const triggerFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // RESET DATABASE ACTION (Super useful for demonstration)
  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all modifications and revert to default data?')) {
      localStorage.removeItem('local_cars');
      localStorage.removeItem('local_states');
      localStorage.removeItem('local_banks');
      setCars(getLocalCars());
      setStates(getLocalStates());
      setBanks(getLocalBanks());
      triggerFeedback('success', 'Database reset to factory default data successfully!');
    }
  };

  // ================= CARS CRUD HANDLING =================
  const handleCarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carForm.brand || !carForm.model) {
      triggerFeedback('error', 'Brand and Model are required fields.');
      return;
    }

    let updatedCars: Car[];
    if (editingCarId) {
      // Edit existing
      updatedCars = cars.map((c) => {
        if (c.id === editingCarId) {
          return {
            ...c,
            brand: carForm.brand,
            model: carForm.model,
            bodyType: carForm.bodyType,
            fuelType: carForm.fuelType,
            transmission: carForm.transmission,
            specs: {
              engine: carForm.engine,
              power: carForm.power,
              torque: carForm.torque,
              mileage: Number(carForm.mileage),
              seatingCapacity: Number(carForm.seatingCapacity)
            },
            safetyRating: Number(carForm.safetyRating),
            featured: carForm.featured,
            variants: carForm.variants
          };
        }
        return c;
      });
      triggerFeedback('success', `Car details updated for ${carForm.brand} ${carForm.model}!`);
    } else {
      // Add new
      const newCar: Car = {
        id: `${carForm.brand.toLowerCase().replace(/\s+/g, '-')}-${carForm.model.toLowerCase().replace(/\s+/g, '-')}`,
        brand: carForm.brand,
        model: carForm.model,
        bodyType: carForm.bodyType,
        fuelType: carForm.fuelType,
        transmission: carForm.transmission,
        specs: {
          engine: carForm.engine,
          power: carForm.power,
          torque: carForm.torque,
          mileage: Number(carForm.mileage),
          seatingCapacity: Number(carForm.seatingCapacity)
        },
        safetyRating: Number(carForm.safetyRating),
        images: { front: '', side: '', interior: '', dashboard: '' },
        variants: carForm.variants,
        featured: carForm.featured
      };
      updatedCars = [newCar, ...cars];
      triggerFeedback('success', `Added new model: ${carForm.brand} ${carForm.model}!`);
    }

    setCars(updatedCars);
    saveLocalCars(updatedCars);
    cancelCarEdit();
  };

  const handleEditCar = (car: Car) => {
    setEditingCarId(car.id);
    setCarForm({
      brand: car.brand,
      model: car.model,
      bodyType: car.bodyType,
      fuelType: car.fuelType,
      transmission: car.transmission,
      engine: car.specs.engine,
      power: car.specs.power,
      torque: car.specs.torque,
      mileage: car.specs.mileage,
      seatingCapacity: car.specs.seatingCapacity,
      safetyRating: car.safetyRating,
      featured: !!car.featured,
      variants: [...car.variants]
    });
    // Scroll to form
    const formElement = document.getElementById('car-form-section');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteCar = (id: string, modelName: string) => {
    if (window.confirm(`Are you sure you want to delete the ${modelName}?`)) {
      const updated = cars.filter((c) => c.id !== id);
      setCars(updated);
      saveLocalCars(updated);
      triggerFeedback('success', `Deleted ${modelName} from catalog.`);
    }
  };

  const cancelCarEdit = () => {
    setEditingCarId(null);
    setCarForm({
      brand: '',
      model: '',
      bodyType: 'SUV',
      fuelType: ['Petrol'],
      transmission: ['Manual'],
      engine: '1197 cc',
      power: '85 bhp',
      torque: '113 Nm',
      mileage: 18.5,
      seatingCapacity: 5,
      safetyRating: 4,
      featured: false,
      variants: [{ name: 'Base Variant', exShowroomPrice: 600000 }]
    });
  };

  const handleAddVariantField = () => {
    setCarForm({
      ...carForm,
      variants: [...carForm.variants, { name: 'Variant Name', exShowroomPrice: 700000 }]
    });
  };

  const handleRemoveVariantField = (idx: number) => {
    if (carForm.variants.length <= 1) return;
    setCarForm({
      ...carForm,
      variants: carForm.variants.filter((_, i) => i !== idx)
    });
  };

  const handleVariantChange = (idx: number, field: 'name' | 'exShowroomPrice', val: string) => {
    const updated = carForm.variants.map((v, i) => {
      if (i === idx) {
        return {
          ...v,
          [field]: field === 'exShowroomPrice' ? (parseInt(val) || 0) : val
        };
      }
      return v;
    });
    setCarForm({ ...carForm, variants: updated });
  };

  // Toggle checklist arrays
  const toggleFuelSelection = (fuel: FuelType) => {
    const active = carForm.fuelType.includes(fuel)
      ? carForm.fuelType.filter((f) => f !== fuel)
      : [...carForm.fuelType, fuel];
    setCarForm({ ...carForm, fuelType: active.length > 0 ? active : [fuel] });
  };

  const toggleTransSelection = (trans: TransmissionType) => {
    const active = carForm.transmission.includes(trans)
      ? carForm.transmission.filter((t) => t !== trans)
      : [...carForm.transmission, trans];
    setCarForm({ ...carForm, transmission: active.length > 0 ? active : [trans] });
  };

  // ================= TAXES CRU HANDLING =================
  const handleTaxChange = (stateIndex: number, field: keyof StateTax, val: string) => {
    const updated = states.map((s, idx) => {
      if (idx === stateIndex) {
        return {
          ...s,
          [field]: field === 'name' || field === 'code' ? val : (parseFloat(val) || 0)
        };
      }
      return s;
    });
    setStates(updated);
  };

  const handleTaxSave = () => {
    saveLocalStates(states);
    triggerFeedback('success', 'State road taxes and charges updated successfully!');
  };

  // ================= BANKS CRU HANDLING =================
  const handleBankChange = (bankIndex: number, field: keyof BankRate, val: string) => {
    const updated = banks.map((b, idx) => {
      if (idx === bankIndex) {
        return {
          ...b,
          [field]: field === 'name' || field === 'logo' || field === 'id' ? val : (parseFloat(val) || 0)
        };
      }
      return b;
    });
    setBanks(updated);
  };

  const handleBankSave = () => {
    saveLocalBanks(banks);
    triggerFeedback('success', 'Bank interest rates and processing fees updated successfully!');
  };

  // Filtered cars for table list
  const filteredCars = cars.filter((c) =>
    c.model.toLowerCase().includes(searchCar.toLowerCase()) ||
    c.brand.toLowerCase().includes(searchCar.toLowerCase())
  );

  return (
    <div className="space-y-8 relative">
      
      {/* Feedback floating alert */}
      {feedback && (
        <div className={`fixed top-20 right-6 z-50 rounded-2xl p-4 shadow-xl border flex items-center gap-2 text-xs font-bold animate-bounce ${
          feedback.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900'
            : 'bg-red-50 text-red-805 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900'
        }`}>
          {feedback.type === 'success' ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-red-650" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">Admin Settings & CRUD Panel</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Fine-tune ex-showroom pricing, change city road taxes, add models, or manage bank rates.
          </p>
        </div>
        
        <button
          onClick={resetToDefault}
          className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-extrabold text-red-600 hover:bg-red-500/10 dark:text-red-400 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Factory Data</span>
        </button>
      </div>

      {/* Global Setting Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2">
        {['cars', 'taxes', 'banks'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex items-center border-b-2 py-3 px-4 text-xs font-extrabold uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <span>{tab === 'cars' ? 'Manage Cars' : tab === 'taxes' ? 'State Taxes' : 'Bank Rates'}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: CARS CRUD */}
      {activeTab === 'cars' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* List of current cars (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Car Database ({cars.length} Models)
              </h3>
              
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Quick lookup..."
                  value={searchCar}
                  onChange={(e) => setSearchCar(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-8 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-850 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 max-h-[500px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 font-bold uppercase">
                    <th className="py-2.5 px-3">Brand & Model</th>
                    <th className="py-2.5 px-3">Segment</th>
                    <th className="py-2.5 px-3 text-right">Starting Price</th>
                    <th className="py-2.5 px-3 text-center">Variants</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                  {filteredCars.map((car) => {
                    const prices = car.variants.map((v) => v.exShowroomPrice);
                    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

                    return (
                      <tr key={car.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                          {car.brand} {car.model}
                        </td>
                        <td className="py-2.5 px-3">{car.bodyType}</td>
                        <td className="py-2.5 px-3 text-right text-blue-600 dark:text-blue-400 font-extrabold">
                          ₹{(minPrice / 100000).toFixed(2)} Lakh
                        </td>
                        <td className="py-2.5 px-3 text-center">{car.variants.length}</td>
                        <td className="py-2.5 px-3 flex gap-2 justify-center">
                          <button
                            onClick={() => handleEditCar(car)}
                            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                            title="Edit specs"
                          >
                            <Edit3 className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car.id, `${car.brand} ${car.model}`)}
                            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
                            title="Delete model"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Car Edit/Create Form (5 cols) */}
          <div id="car-form-section" className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 pb-3 dark:border-slate-850">
              {editingCarId ? 'Edit Selected Car' : 'Add New Car Model'}
            </h3>

            <form onSubmit={handleCarSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={carForm.brand}
                    onChange={(e) => setCarForm({ ...carForm, brand: e.target.value })}
                    className="w-full rounded-xl border border-slate-250 bg-slate-50 p-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white text-xs font-bold"
                    placeholder="e.g. Maruti Suzuki"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Model Name</label>
                  <input
                    type="text"
                    required
                    value={carForm.model}
                    onChange={(e) => setCarForm({ ...carForm, model: e.target.value })}
                    className="w-full rounded-xl border border-slate-250 bg-slate-50 p-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white text-xs font-bold"
                    placeholder="e.g. Grand Vitara"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Body Segment</label>
                  <select
                    value={carForm.bodyType}
                    onChange={(e) => setCarForm({ ...carForm, bodyType: e.target.value as BodyType })}
                    className="w-full rounded-xl border border-slate-250 bg-slate-50 p-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white text-xs font-bold"
                  >
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="EV">EV</option>
                    <option value="Luxury">Luxury / Premium</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Safety Rating</label>
                  <select
                    value={carForm.safetyRating}
                    onChange={(e) => setCarForm({ ...carForm, safetyRating: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-250 bg-slate-50 p-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white text-xs font-bold"
                  >
                    {[0, 1, 2, 3, 4, 5].map((s) => (
                      <option key={s} value={s}>
                        {s} Star GNCAP
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fuel Selection */}
              <div className="space-y-1.5">
                <label className="text-slate-400 block">Fuel Options</label>
                <div className="flex flex-wrap gap-2">
                  {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map((f) => {
                    const isSelected = carForm.fuelType.includes(f as FuelType);
                    return (
                      <button
                        type="button"
                        key={f}
                        onClick={() => toggleFuelSelection(f as FuelType)}
                        className={`px-3 py-1 rounded-lg border text-[10px] font-bold transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                            : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Transmission */}
              <div className="space-y-1.5">
                <label className="text-slate-400 block">Transmission</label>
                <div className="flex gap-2">
                  {['Manual', 'Automatic'].map((t) => {
                    const isSelected = carForm.transmission.includes(t as TransmissionType);
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => toggleTransSelection(t as TransmissionType)}
                        className={`flex-1 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                            : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl dark:bg-slate-950/60 border border-slate-100 dark:border-slate-900">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px]">Engine displacement</label>
                  <input
                    type="text"
                    value={carForm.engine}
                    onChange={(e) => setCarForm({ ...carForm, engine: e.target.value })}
                    className="w-full rounded border border-slate-200 p-1 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px]">Mileage</label>
                  <input
                    type="number"
                    step="0.1"
                    value={carForm.mileage}
                    onChange={(e) => setCarForm({ ...carForm, mileage: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded border border-slate-200 p-1 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px]">Seats</label>
                  <input
                    type="number"
                    value={carForm.seatingCapacity}
                    onChange={(e) => setCarForm({ ...carForm, seatingCapacity: parseInt(e.target.value) || 5 })}
                    className="w-full rounded border border-slate-200 p-1 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              {/* Variants Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center border-t border-slate-100 pt-3 dark:border-slate-850">
                  <label className="text-slate-400">Trims / Variants Pricing (INR)</label>
                  <button
                    type="button"
                    onClick={handleAddVariantField}
                    className="flex items-center gap-1 text-[10px] text-blue-600 font-bold hover:text-blue-700"
                  >
                    <Plus className="h-3 w-3" /> Add Variant
                  </button>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {carForm.variants.map((variant, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={variant.name}
                        required
                        onChange={(e) => handleVariantChange(idx, 'name', e.target.value)}
                        className="flex-1 rounded-lg border border-slate-200 p-2 dark:border-slate-800 bg-slate-50"
                        placeholder="Variant name"
                      />
                      <input
                        type="number"
                        value={variant.exShowroomPrice}
                        required
                        onChange={(e) => handleVariantChange(idx, 'exShowroomPrice', e.target.value)}
                        className="w-28 rounded-lg border border-slate-200 p-2 dark:border-slate-800 bg-slate-50 text-right font-bold text-blue-600 dark:text-blue-450"
                        placeholder="Ex-Showroom"
                      />
                      <button
                        type="button"
                        disabled={carForm.variants.length <= 1}
                        onClick={() => handleRemoveVariantField(idx)}
                        className="rounded p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-850">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={carForm.featured}
                  onChange={(e) => setCarForm({ ...carForm, featured: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <label htmlFor="featured-checkbox" className="text-slate-500 select-none">Showcase model on homepage</label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                {editingCarId && (
                  <button
                    type="button"
                    onClick={cancelCarEdit}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/10 transition-colors"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{editingCarId ? 'Save Edits' : 'Create Model'}</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

      {/* TAB CONTENT: STATE TAXES */}
      {activeTab === 'taxes' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-850">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Manage State RTO Road Taxes & Registration Costs
            </h3>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold dark:bg-emerald-950/40">
              Active locations: {states.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {states.map((st, idx) => (
              <div
                key={st.code}
                className="border border-slate-150/60 p-4 rounded-2xl space-y-3.5 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs font-semibold"
              >
                <div className="flex justify-between items-center border-b border-slate-200/50 pb-2 dark:border-slate-800">
                  <span className="text-sm font-black text-slate-900 dark:text-white">{st.name} ({st.code})</span>
                  <span className="text-[10px] font-bold text-slate-400">RTO Config Block</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400">Road Tax Petrol (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={st.roadTaxPetrol}
                      onChange={(e) => handleTaxChange(idx, 'roadTaxPetrol', e.target.value)}
                      className="w-full rounded border border-slate-200 p-2 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">Road Tax Diesel (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={st.roadTaxDiesel}
                      onChange={(e) => handleTaxChange(idx, 'roadTaxDiesel', e.target.value)}
                      className="w-full rounded border border-slate-200 p-2 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">Road Tax EV (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={st.roadTaxEV}
                      onChange={(e) => handleTaxChange(idx, 'roadTaxEV', e.target.value)}
                      className="w-full rounded border border-slate-200 p-2 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">Road Tax Hybrid (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={st.roadTaxHybrid}
                      onChange={(e) => handleTaxChange(idx, 'roadTaxHybrid', e.target.value)}
                      className="w-full rounded border border-slate-200 p-2 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">Registration Fee (Flat ₹)</label>
                    <input
                      type="number"
                      value={st.registrationFlat}
                      onChange={(e) => handleTaxChange(idx, 'registrationFlat', e.target.value)}
                      className="w-full rounded border border-slate-200 p-2 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">Insurance Est. (% of Car)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={st.insurancePct}
                      onChange={(e) => handleTaxChange(idx, 'insurancePct', e.target.value)}
                      className="w-full rounded border border-slate-200 p-2 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-4 dark:border-slate-850">
            <button
              onClick={handleTaxSave}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/10 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save State Taxes</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: BANK INTEREST RATES */}
      {activeTab === 'banks' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-850">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Manage Bank Base Interest Rates & Charges
            </h3>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold dark:bg-emerald-950/40">
              Active lenders: {banks.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banks.map((bk, idx) => (
              <div
                key={bk.id}
                className="border border-slate-150/60 p-4 rounded-2xl space-y-3 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs font-semibold"
              >
                <div className="flex justify-between items-center border-b border-slate-200/50 pb-2 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-md bg-slate-100 dark:bg-slate-900 p-1 rounded">{bk.logo}</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{bk.name}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-slate-400">Base Interest Rate (% p.a.)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={bk.interestRate}
                      onChange={(e) => handleBankChange(idx, 'interestRate', e.target.value)}
                      className="w-full rounded border border-slate-200 p-2 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-400">Fee (% of loan)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={bk.processingFeePct}
                        onChange={(e) => handleBankChange(idx, 'processingFeePct', e.target.value)}
                        className="w-full rounded border border-slate-200 p-2 dark:border-slate-800 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">Max Fee Cap (₹)</label>
                      <input
                        type="number"
                        value={bk.processingFeeMax}
                        onChange={(e) => handleBankChange(idx, 'processingFeeMax', e.target.value)}
                        className="w-full rounded border border-slate-200 p-2 dark:border-slate-800 bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-4 dark:border-slate-850">
            <button
              onClick={handleBankSave}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/10 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Interest Rates</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
