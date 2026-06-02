'use client';

import React, { useState } from 'react';
import { AmortizationPeriod } from '../lib/calculator';

interface AmortizationTableProps {
  monthlySchedule: AmortizationPeriod[];
  yearlySchedule: AmortizationPeriod[];
}

export default function AmortizationTable({
  monthlySchedule,
  yearlySchedule,
}: AmortizationTableProps) {
  const [viewType, setViewType] = useState<'yearly' | 'monthly'>('yearly');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Show one year at a time in monthly view

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Pagination logic for monthly view
  const totalPages = Math.ceil(monthlySchedule.length / itemsPerPage);
  const currentMonthlyData = monthlySchedule.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Amortization Schedule
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            See how your principal and interest balances change over the loan term
          </p>
        </div>

        {/* Schedule View Toggle */}
        <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => setViewType('yearly')}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
              viewType === 'yearly'
                ? 'bg-white shadow-sm text-blue-600 dark:bg-slate-900 dark:text-blue-400'
                : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Yearly Breakup
          </button>
          <button
            onClick={() => {
              setViewType('monthly');
              setCurrentPage(1);
            }}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
              viewType === 'monthly'
                ? 'bg-white shadow-sm text-blue-600 dark:bg-slate-900 dark:text-blue-400'
                : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Monthly Breakup
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3 px-4">
                {viewType === 'yearly' ? 'Year' : 'Month'}
              </th>
              <th className="py-3 px-4 text-right">Total EMI Paid</th>
              <th className="py-3 px-4 text-right">Principal Repaid</th>
              <th className="py-3 px-4 text-right">Interest Charged</th>
              <th className="py-3 px-4 text-right">Ending Loan Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
            {viewType === 'yearly'
              ? yearlySchedule.map((row) => (
                  <tr
                    key={`year-${row.period}`}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Year {row.period}</td>
                    <td className="py-3.5 px-4 text-right">{formatCurrency(row.payment)}</td>
                    <td className="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(row.principalPaid)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-violet-600 dark:text-violet-400">
                      {formatCurrency(row.interestPaid)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                      {formatCurrency(row.balanceRemaining)}
                    </td>
                  </tr>
                ))
              : currentMonthlyData.map((row) => (
                  <tr
                    key={`month-${row.period}`}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Month {row.period}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(row.payment)}</td>
                    <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(row.principalPaid)}
                    </td>
                    <td className="py-3 px-4 text-right text-violet-600 dark:text-violet-400">
                      {formatCurrency(row.interestPaid)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                      {formatCurrency(row.balanceRemaining)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Monthly Pagination Controls */}
      {viewType === 'monthly' && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500">
            Showing year {currentPage} of {totalPages} ({itemsPerPage} months/year)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-slate-800 dark:hover:bg-slate-850"
            >
              Prev Year
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-slate-800 dark:hover:bg-slate-850"
            >
              Next Year
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
