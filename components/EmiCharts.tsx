'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarTooltip,
  Legend as BarLegend,
} from 'recharts';
import { AmortizationPeriod } from '../lib/calculator';

interface EmiChartsProps {
  principal: number;
  totalInterest: number;
  yearlySchedule: AmortizationPeriod[];
}

export default function EmiCharts({ principal, totalInterest, yearlySchedule }: EmiChartsProps) {
  // Donut chart data
  const pieData = [
    { name: 'Principal Amount', value: principal },
    { name: 'Interest Component', value: totalInterest },
  ];

  const PIE_COLORS = ['#3b82f6', '#8b5cf6']; // Blue and Purple

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Convert yearly schedule into chart-friendly structure
  const barData = yearlySchedule.map((year) => ({
    name: `Year ${year.period}`,
    Principal: year.principalPaid,
    Interest: year.interestPaid,
    Balance: year.balanceRemaining,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Donut Chart: Principal vs Interest */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
        <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">
          Principal vs Interest Breakdown
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex justify-around text-center border-t border-slate-100 pt-4 dark:border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Principal</span>
            <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400">{formatCurrency(principal)}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Interest</span>
            <p className="text-sm font-extrabold text-violet-600 dark:text-violet-400">{formatCurrency(totalInterest)}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Repayment</span>
            <p className="text-sm font-extrabold text-slate-800 dark:text-white">{formatCurrency(principal + totalInterest)}</p>
          </div>
        </div>
      </div>

      {/* Bar Chart: Year-wise Repayment */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
        <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">
          Yearly Amortization Progression
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
              />
              <BarTooltip formatter={(value) => formatCurrency(Number(value))} />
              <BarLegend />
              <Bar dataKey="Principal" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Interest" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2 font-semibold">
          *Notice how early years carry a higher interest component compared to principal repayment.
        </p>
      </div>
    </div>
  );
}
