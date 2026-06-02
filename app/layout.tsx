import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Car EMI Calculator India | Ex-Showroom & State-wise On-Road Prices',
  description:
    'Compare car loans, calculate monthly EMIs, estimate state-wise road tax (Delhi, Karnataka, Maharashtra) for all car brands, check loan eligibility, and compare banks side-by-side.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300">
        
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-sm tracking-tighter shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                  🚗
                </span>
                <span className="text-md font-black tracking-tight text-slate-950 dark:text-white">
                  CAR<span className="text-blue-600 dark:text-blue-400">EMI</span>.in
                </span>
              </Link>

              {/* Nav Links */}
              <nav className="flex items-center gap-1 sm:gap-4">
                <Link
                  href="/"
                  className="rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-900/40 transition-all"
                >
                  Calculator
                </Link>
                <Link
                  href="/compare"
                  className="rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-900/40 transition-all"
                >
                  Compare Cars
                </Link>
                <Link
                  href="/eligibility"
                  className="rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-900/40 transition-all"
                >
                  Eligibility
                </Link>
                <Link
                  href="/admin"
                  className="rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-slate-800 hover:border-slate-300 dark:text-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-850 transition-all"
                >
                  Admin Panel
                </Link>
              </nav>

            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="w-full border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-white">CAR-EMI.in</span>
              <span>• Premium Automotive Loan & Tax Calculator</span>
            </div>
            <div className="flex gap-4">
              <span>RTO Tax Rules 2026</span>
              <span>All 23 Major Brands Integrated</span>
              <span>PWA Offline-Ready</span>
            </div>
            <div>
              <span>© {new Date().getFullYear()} CAR-EMI.in. All Rights Reserved.</span>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
