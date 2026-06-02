'use client';

import React from 'react';
import { compareBanks } from '../lib/calculator';

interface BankRatesProps {
  loanAmount: number;
  tenureYears: number;
}

export default function BankRates({ loanAmount, tenureYears }: BankRatesProps) {
  const bankOffers = compareBanks(loanAmount, tenureYears);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-1">
          Compare Banks & Interest Rates
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Compare tentative car loan interest rates, processing fees, and monthly EMIs across leading Indian banks
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Bank Name</th>
              <th className="py-3 px-4 text-center">Interest Rate</th>
              <th className="py-3 px-4 text-right">Monthly EMI</th>
              <th className="py-3 px-4 text-right">Processing Fee</th>
              <th className="py-3 px-4 text-right">Total Interest</th>
              <th className="py-3 px-4 text-right">Total Repayment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
            {bankOffers.map((offer) => (
              <tr
                key={offer.bankId}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-3 px-4 flex items-center gap-2">
                  <span className="text-lg bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg flex items-center justify-center">
                    {offer.logo}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{offer.bankName}</span>
                </td>
                <td className="py-3 px-4 text-center font-extrabold text-blue-600 dark:text-blue-400">
                  {offer.interestRate.toFixed(2)}%
                </td>
                <td className="py-3 px-4 text-right font-extrabold text-slate-900 dark:text-white">
                  {formatCurrency(offer.monthlyEmi)}
                </td>
                <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400">
                  {offer.processingFee > 0 ? formatCurrency(offer.processingFee) : 'Nil'}
                </td>
                <td className="py-3 px-4 text-right text-violet-600 dark:text-violet-400">
                  {formatCurrency(offer.totalInterest)}
                </td>
                <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                  {formatCurrency(offer.totalRepayment)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-xl bg-blue-50/50 p-3 text-[11px] text-blue-700 border border-blue-150/40 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30">
        <span className="font-bold">Disclaimer:</span> Interest rates are indicative and subject to change by respective banks based on credit score, loan amount, and tenure. Processing fees may exclude GST.
      </div>
    </div>
  );
}
