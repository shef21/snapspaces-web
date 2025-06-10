import React from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-[#F6F5F3] font-league-spartan flex flex-col items-center">
      <main className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl mt-10 mb-10 overflow-hidden px-0">
        {/* Hero Section */}
        <section className="px-4 sm:px-8 pt-8 sm:pt-12 pb-6 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#171717] mb-4">Simple, Transparent Pricing</h1>
          <p className="text-base sm:text-lg md:text-xl text-[#171717]/80 mb-6 sm:mb-8 max-w-2xl mx-auto font-light">Choose the plan that fits your needs. No hidden fees, no surprises—just powerful tools to help you connect, create, and grow on SnapSpaces.</p>
        </section>

        {/* Pricing Tiers */}
        <section className="px-4 sm:px-8 py-8 sm:py-12 flex justify-center">
          <div
            className="rounded-2xl shadow-xl p-8 sm:p-12 flex flex-col items-center text-center border-2 border-yellow-300 bg-yellow-50 scale-105 z-10 shadow-2xl max-w-md w-full"
            style={{ boxShadow: '0 8px 32px 0 rgba(255, 193, 7, 0.15)' }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-2">Starter</h2>
            <div className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-2">Free</div>
            <div className="text-[#171717]/80 mb-4 text-base sm:text-lg">Perfect for getting started and exploring SnapSpaces.</div>
            <ul className="text-[#171717]/80 text-left mb-6 space-y-2 w-full">
              <li className="flex items-center gap-2 text-base sm:text-lg">
                <span className="inline-block w-3 h-3 bg-yellow-300 rounded-full flex-shrink-0"></span>
                <span>Basic features</span>
              </li>
              <li className="flex items-center gap-2 text-base sm:text-lg">
                <span className="inline-block w-3 h-3 bg-yellow-300 rounded-full flex-shrink-0"></span>
                <span>Community support</span>
              </li>
            </ul>
            <Link
              href="/join"
              className="mt-auto w-full px-8 py-4 rounded-full font-semibold shadow bg-yellow-300 hover:bg-yellow-400 text-[#171717] border border-yellow-300 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
            >
              Get started
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PricingPage; 