'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { getLocalCars, STATES } from '../../lib/data';
import { Car } from '../../lib/types';
import { checkEligibility, compareBanks } from '../../lib/calculator';
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, IndianRupee, Sparkles } from 'lucide-react';

export default function EligibilityPage() {
  const [carsList, setCarsList] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string>('');

  // Input states
  const [monthlyIncome, setMonthlyIncome] = useState<number>(80000);
  const [existingEmi, setExistingEmi] = useState<number>(0);
  const [creditScore, setCreditScore] = useState<number>(750);
  const [selectedStateCode, setSelectedStateCode] = useState<string>('KA');

  useEffect(() => {
    const list = getLocalCars();
    setCarsList(list);
    if (list.length > 0) {
      setSelectedCarId(list[0].id);
    }
  }, []);

  // Format currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Selected Car & its estimated on-road price
  const selectedCar = useMemo(() => {
    if (carsList.length === 0) return null;
    return carsList.find((c) => c.id === selectedCarId) || carsList[0];
  }, [carsList, selectedCarId]);

  const carOnRoadPrice = useMemo(() => {
    if (!selectedCar) return 0;
    const baseExShowroom = selectedCar.variants[0].exShowroomPrice;
      
    // Exact dynamic calculation
    const isEV = selectedCar.fuelType.includes('Electric');
    const isHybrid = selectedCar.fuelType.includes('Hybrid');
    const isDiesel = selectedCar.fuelType.includes('Diesel');
    
    const state = STATES.find((s) => s.code === selectedStateCode) || STATES[0];
    let roadTaxRate = state.roadTaxPetrol;
    if (isEV) roadTaxRate = state.roadTaxEV;
    else if (isHybrid) roadTaxRate = state.roadTaxHybrid;
    else if (isDiesel) roadTaxRate = state.roadTaxDiesel;

    const rto = Math.round(baseExShowroom * (roadTaxRate / 100));
    const ins = Math.round(baseExShowroom * (state.insurancePct / 100));
    const tcs = baseExShowroom > 1000000 ? Math.round(baseExShowroom * (state.tcsPct / 100)) : 0;
    
    return baseExShowroom + rto + ins + tcs + state.registrationFlat + state.fastagCharges + state.handlingCharges;
  }, [selectedCar, selectedStateCode]);

  // Run eligibility checks
  const result = checkEligibility(monthlyIncome, existingEmi, creditScore, carOnRoadPrice);

  // Bank calculations for eligible loan amount
  const bankOffers = useMemo(() => {
    if (result.maxLoanAmount <= 0) return [];
    const loanToCompare = Math.min(result.maxLoanAmount, carOnRoadPrice - result.recommendedDownPayment);
    if (loanToCompare <= 0) return [];
    return compareBanks(loanToCompare, 5).slice(0, 4); // Show top 4 banks for 5 year tenure
  }, [result, carOnRoadPrice]);

  if (!selectedCar) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
          Loan <span className="text-blue-600 dark:text-blue-400">Eligibility</span> & Affordability Portal
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold max-w-md mx-auto">
          Input your financial indicators to check your maximum borrowing limit and discover credit recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs Panel (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 space-y-5">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 pb-3 dark:border-slate-850">
            Financial Profile
          </h2>

          {/* Income input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Monthly Take-Home Income</label>
            <div className="relative">
              <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pr-4 pl-8 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-850 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          {/* Liabilities input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Existing Monthly EMIs</label>
            <div className="relative">
              <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={existingEmi}
                onChange={(e) => setExistingEmi(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pr-4 pl-8 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-850 dark:bg-slate-950 dark:text-white"
                placeholder="0"
              />
            </div>
          </div>

          {/* Credit Score */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Credit Score Rating</label>
            <select
              value={creditScore}
              onChange={(e) => setCreditScore(parseInt(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-850 dark:bg-slate-950 dark:text-white"
            >
              <option value={780}>Excellent (750+)</option>
              <option value={700}>Good (650 - 749)</option>
              <option value={600}>Fair / Poor (&lt; 650)</option>
            </select>
          </div>

          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 pb-3 pt-3 dark:border-slate-850">
            Target Purchase
          </h2>

          {/* Car Target */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Select Target Car</label>
            <select
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-850 dark:bg-slate-950 dark:text-white"
            >
              {carsList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brand} {c.model} ({formatCurrency(c.variants[0].exShowroomPrice)})
                </option>
              ))}
            </select>
          </div>

          {/* Registering Location */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Registering Location</label>
            <select
              value={selectedStateCode}
              onChange={(e) => setSelectedStateCode(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-850 dark:bg-slate-950 dark:text-white"
            >
              {STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Output Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Eligibility Result Header Card */}
          <div
            className={`rounded-3xl border p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-start ${
              result.eligible && result.recommendedDownPayment < carOnRoadPrice * 0.4
                ? 'border-emerald-500/20 bg-emerald-50/40 dark:border-emerald-500/10 dark:bg-emerald-950/10'
                : result.eligible
                ? 'border-amber-500/20 bg-amber-50/40 dark:border-amber-500/10 dark:bg-amber-950/10'
                : 'border-red-500/20 bg-red-50/40 dark:border-red-500/10 dark:bg-red-950/10'
            }`}
          >
            {/* Big Status Icon */}
            <div className="mt-1">
              {result.eligible && result.recommendedDownPayment < carOnRoadPrice * 0.4 ? (
                <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              ) : result.eligible ? (
                <AlertTriangle className="h-10 w-10 text-amber-600 dark:text-amber-400" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
              )}
            </div>

            {/* Details */}
            <div className="space-y-2 flex-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Eligibility Status</span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {result.eligible && result.recommendedDownPayment < carOnRoadPrice * 0.4
                  ? 'Excellent Loan Affordability!'
                  : result.eligible
                  ? 'Eligible with Higher Down Payment'
                  : 'Action Required: Ineligible Loan Ratio'}
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                {result.reason}
              </p>
            </div>
          </div>

          {/* Financial Capacities Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Max EMI card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Max Recommended EMI</span>
              <div className="flex items-center gap-1 mt-1 text-slate-900 dark:text-white font-extrabold">
                <IndianRupee className="h-5 w-5 text-blue-500" />
                <span className="text-2xl">{formatCurrency(result.maxEmi)}</span>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold mt-1">Based on monthly savings capacity guidelines.</p>
            </div>

            {/* Max Loan card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Max Affordability Loan</span>
              <div className="flex items-center gap-1 mt-1 text-slate-900 dark:text-white font-extrabold">
                <TrendingUp className="h-5 w-5 text-violet-500" />
                <span className="text-2xl">{formatCurrency(result.maxLoanAmount)}</span>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold mt-1">Assuming average 9% rate for 5-year tenure.</p>
            </div>

          </div>

          {/* Pricing Breakup & Recommendation */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Recommended Financial Blueprint
            </h3>
            
            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Target Car On-Road Price ({selectedStateCode})</span>
                <span className="text-slate-850 dark:text-slate-100">{formatCurrency(carOnRoadPrice)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Recommended Down Payment (Min)</span>
                <span className="font-extrabold">{formatCurrency(result.recommendedDownPayment)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Required Car Loan Amount</span>
                <span className="text-slate-850 dark:text-slate-100 font-bold">
                  {formatCurrency(Math.max(0, carOnRoadPrice - result.recommendedDownPayment))}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 text-[11px] font-semibold text-slate-600 dark:bg-slate-950 dark:text-slate-400 border border-slate-200/20">
              <span className="font-bold text-blue-600 dark:text-blue-400">Smart Tip:</span> Pay a higher down payment if possible. It reduces the interest burden significantly and lowers your monthly cash liabilities.
            </div>
          </div>

          {/* Eligible Bank Rates */}
          {result.eligible && bankOffers.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <span>Eligible Bank Options (5-Year Tenure)</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bankOffers.map((offer) => (
                  <div
                    key={offer.bankId}
                    className="border border-slate-150/60 p-4 rounded-2xl flex items-center justify-between dark:border-slate-800 hover:border-blue-500/20 hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-md">{offer.logo}</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white">{offer.bankName}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">EMI: {formatCurrency(offer.monthlyEmi)}/mo</p>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400">{offer.interestRate}%</span>
                      <p className="text-[9px] text-slate-400 font-semibold">Fees: {offer.processingFee > 0 ? formatCurrency(offer.processingFee) : 'Nil'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
