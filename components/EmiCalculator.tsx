'use client';

import React, { useState, useEffect } from 'react';
import { Car, StateTax, FuelType } from '../lib/types';
import { STATES } from '../lib/data';
import {
  calculateOnRoadPrice,
  calculateEMI,
  generateMonthlyAmortization,
  generateYearlyAmortization,
} from '../lib/calculator';
import EmiCharts from './EmiCharts';
import AmortizationTable from './AmortizationTable';
import BankRates from './BankRates';
import { Info, Calculator, FileText, ChevronRight, HelpCircle } from 'lucide-react';

interface EmiCalculatorProps {
  car: Car;
}

export default function EmiCalculator({ car }: EmiCalculatorProps) {
  // 1. Core State
  const [selectedVariant, setSelectedVariant] = useState(car.variants[0]);
  const [selectedStateCode, setSelectedStateCode] = useState('KA'); // Default Karnataka
  const [selectedFuel, setSelectedFuel] = useState(car.fuelType[0]);
  
  // 2. Financial inputs
  const [downPaymentPct, setDownPaymentPct] = useState(20); // Default 20% down
  const [downPaymentAmt, setDownPaymentAmt] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(9.0); // Default 9.0% car loan rate
  const [tenureYears, setTenureYears] = useState(5); // Default 5 years
  
  // 3. Tab navigation for details
  const [activeTab, setActiveTab] = useState<'charts' | 'schedule' | 'banks'>('charts');

  // Format currency helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Reset variant when car changes
  useEffect(() => {
    setSelectedVariant(car.variants[0]);
    setSelectedFuel(car.fuelType[0]);
  }, [car]);

  // Calculate pricing & update down payment / loan values
  const priceBreakdown = calculateOnRoadPrice(
    selectedVariant.exShowroomPrice,
    selectedStateCode,
    selectedFuel
  );

  const { onRoadPrice } = priceBreakdown;

  // Sync percentages and actual rupee values
  useEffect(() => {
    const amt = Math.round(onRoadPrice * (downPaymentPct / 100));
    setDownPaymentAmt(amt);
    setLoanAmount(onRoadPrice - amt);
  }, [downPaymentPct, onRoadPrice]);

  const handleDownPaymentAmtChange = (val: number) => {
    const safeVal = Math.min(onRoadPrice, Math.max(0, val));
    setDownPaymentAmt(safeVal);
    const pct = Math.round((safeVal / onRoadPrice) * 100);
    setDownPaymentPct(pct);
    setLoanAmount(onRoadPrice - safeVal);
  };

  // Live calculations
  const monthlyEmi = calculateEMI(loanAmount, interestRate, tenureYears);
  const totalRepayment = monthlyEmi * tenureYears * 12;
  const totalInterest = totalRepayment - loanAmount;

  // Schedules
  const monthlySchedule = generateMonthlyAmortization(loanAmount, interestRate, tenureYears);
  const yearlySchedule = generateYearlyAmortization(loanAmount, interestRate, tenureYears);

  return (
    <div className="space-y-6">
      {/* 1. Top Section: Car Variant & State Selector */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          
          {/* Car Image + Meta Column */}
          <div className="flex-1 flex flex-col items-center sm:items-start sm:flex-row gap-6">
            <div className="relative h-32 w-52 bg-slate-50 rounded-2xl flex items-center justify-center p-3 overflow-hidden border border-slate-100 dark:bg-slate-950/40 dark:border-slate-800">
              <img
                src={car.images.front || '/images/cars/placeholder.png'}
                alt={car.model}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="text-center sm:text-left space-y-2 flex-1">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{car.brand}</span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">{car.model}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {car.specs.engine} • {car.specs.power} • {car.safetyRating}★ GNCAP
              </p>
              
              {/* Image views tabs */}
              <div className="flex gap-2 justify-center sm:justify-start">
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">Front View</span>
                {car.images.side && (
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-505 dark:bg-slate-800">Side View Available</span>
                )}
              </div>
            </div>
          </div>

          {/* Config Selectors */}
          <div className="w-full lg:w-96 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 bg-slate-50 p-4 rounded-2xl dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800">
            {/* Variant Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Trim / Variant</label>
              <select
                value={selectedVariant.name}
                onChange={(e) => {
                  const variant = car.variants.find((v) => v.name === e.target.value);
                  if (variant) setSelectedVariant(variant);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                {car.variants.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({formatCurrency(v.exShowroomPrice)})
                  </option>
                ))}
              </select>
            </div>

            {/* Registration State */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Registering State</label>
              <select
                value={selectedStateCode}
                onChange={(e) => setSelectedStateCode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                {STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fuel option (if model has multiple) */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Fuel Type</label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value as FuelType)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                {car.fuelType.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* 2. On-Road Price Breakdown & Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Price intelligence Breakdown Table */}
        <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Price Intelligence Breakup
              </h3>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold dark:bg-emerald-950/40 dark:text-emerald-400">
                State Rates Active
              </span>
            </div>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Ex-Showroom Price</span>
                <span className="text-slate-800 dark:text-white">{formatCurrency(priceBreakdown.exShowroom)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  RTO / Road Tax
                  <span className="group relative cursor-pointer" title="Calculated by state rules">
                    <Info className="h-3.5 w-3.5 text-slate-400" />
                  </span>
                </span>
                <span className="text-slate-800 dark:text-white">{formatCurrency(priceBreakdown.roadTax)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Insurance (Multi-year)</span>
                <span className="text-slate-800 dark:text-white">{formatCurrency(priceBreakdown.insurance)}</span>
              </div>
              {priceBreakdown.tcs > 0 && (
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">TCS (1% for &gt;₹10L)</span>
                  <span className="text-slate-800 dark:text-white">{formatCurrency(priceBreakdown.tcs)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Registration & Fastag</span>
                <span className="text-slate-800 dark:text-white">{formatCurrency(priceBreakdown.fastag)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Handling Charges</span>
                <span className="text-slate-800 dark:text-white">{formatCurrency(priceBreakdown.handling)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t border-slate-100 pt-4 flex justify-between items-center dark:border-slate-800">
            <span className="text-base font-extrabold text-slate-900 dark:text-white">Estimated On-Road Price</span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {formatCurrency(priceBreakdown.onRoadPrice)}
            </span>
          </div>
        </div>

        {/* Big EMI display card */}
        <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-white/5 translate-x-12 -translate-y-12" />
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 opacity-90" />
              <span className="text-xs uppercase tracking-wider font-extrabold opacity-95">Calculated EMI</span>
            </div>
            
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Monthly EMI</span>
              <h3 className="text-4xl font-black tracking-tight">{formatCurrency(monthlyEmi)}</h3>
              <p className="text-[10px] font-bold opacity-80">For {tenureYears} Years @ {interestRate}% p.a.</p>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4 grid grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <span className="text-[9px] uppercase opacity-75 font-bold tracking-wider">Interest Payable</span>
              <p className="text-sm font-extrabold">{formatCurrency(totalInterest)}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase opacity-75 font-bold tracking-wider">Total Repayment</span>
              <p className="text-sm font-extrabold">{formatCurrency(totalRepayment)}</p>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Slider Inputs & Calculations */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-6">
          Customize Loan Terms
        </h3>
        
        <div className="space-y-6">
          {/* Down Payment Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Down Payment ({downPaymentPct}%)</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={downPaymentAmt}
                  onChange={(e) => handleDownPaymentAmtChange(parseInt(e.target.value) || 0)}
                  className="w-32 rounded-lg border border-slate-200 p-1 text-right text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(parseInt(e.target.value))}
              className="h-2 w-full cursor-pointer rounded-lg bg-slate-100 dark:bg-slate-800 accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>Min (10%): {formatCurrency(onRoadPrice * 0.1)}</span>
              <span>Mid (50%): {formatCurrency(onRoadPrice * 0.5)}</span>
              <span>Max (90%): {formatCurrency(onRoadPrice * 0.9)}</span>
            </div>
          </div>

          {/* Principal display */}
          <div className="flex justify-between items-center rounded-xl bg-slate-50 p-3 border border-slate-200/40 dark:bg-slate-950 dark:border-slate-850">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Net Loan Amount (Principal)</span>
            <span className="text-sm font-black text-blue-600 dark:text-blue-400">{formatCurrency(loanAmount)}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interest Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Annual Interest Rate</span>
                <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-white text-xs">
                  <input
                    type="number"
                    step="0.05"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Math.min(25, Math.max(1, parseFloat(e.target.value) || 9)))}
                    className="w-16 rounded-lg border border-slate-200 p-1 text-center dark:border-slate-800 dark:bg-slate-950"
                  />
                  <span>%</span>
                </div>
              </div>
              <input
                type="range"
                min="7.0"
                max="18.0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="h-2 w-full cursor-pointer rounded-lg bg-slate-100 dark:bg-slate-800 accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>7.0% (Prime)</span>
                <span>12.0%</span>
                <span>18.0% (Max)</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Loan Tenure</span>
                <span className="text-xs font-bold text-slate-800 dark:text-white">{tenureYears} Years ({tenureYears * 12} Months)</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer rounded-lg bg-slate-100 dark:bg-slate-800 accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>1 Year</span>
                <span>3 Years</span>
                <span>5 Years</span>
                <span>7 Years</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Tab Sections (Charts, Schedule, Banks) */}
      <div className="space-y-4">
        {/* Tab Toggle Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('charts')}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-4 text-xs font-extrabold uppercase tracking-wider transition-colors ${
              activeTab === 'charts'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Repayment Charts</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-4 text-xs font-extrabold uppercase tracking-wider transition-colors ${
              activeTab === 'schedule'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Amortization Schedule</span>
          </button>
          <button
            onClick={() => setActiveTab('banks')}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-4 text-xs font-extrabold uppercase tracking-wider transition-colors ${
              activeTab === 'banks'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Bank-Wise Comparison</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'charts' && (
          <EmiCharts principal={loanAmount} totalInterest={totalInterest} yearlySchedule={yearlySchedule} />
        )}

        {activeTab === 'schedule' && (
          <AmortizationTable monthlySchedule={monthlySchedule} yearlySchedule={yearlySchedule} />
        )}

        {activeTab === 'banks' && (
          <BankRates loanAmount={loanAmount} tenureYears={tenureYears} />
        )}
      </div>

    </div>
  );
}
