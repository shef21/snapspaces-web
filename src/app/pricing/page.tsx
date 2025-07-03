import React from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';

const PricingPage = () => {
  return (
    <div className="min-h-screen font-league-spartan flex flex-col items-center" style={{ background: '#2F2F32', color: '#fff' }}>
      <main className="w-full max-w-6xl rounded-3xl shadow-2xl mt-10 mb-10 overflow-hidden px-0" style={{ background: '#232326' }}>
        {/* Hero Section */}
        <section className="px-4 sm:px-8 pt-8 sm:pt-12 pb-6 text-center" style={{ background: '#232326' }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4" style={{ color: '#80F8EE' }}>
            Simple, Transparent Pricing
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto font-light">Choose the plan that fits your needs. No hidden fees, no surprises—just powerful tools to help you connect, create, and grow on Folioo.</p>
        </section>

        {/* Pricing Tiers */}
        <section className="px-4 sm:px-8 py-8 sm:py-12 flex justify-center">
          <div
            className="rounded-2xl shadow-xl p-8 sm:p-12 flex flex-col items-center text-center border-2" style={{ borderColor: '#80F8EE', background: '#fff' }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#171717' }}>Starter</h2>
            <div className="text-3xl sm:text-4xl font-extrabold mb-2" style={{ color: '#00b3a4' }}>
              Free
            </div>
            <div className="text-[#171717]/80 mb-4 text-base sm:text-lg">Perfect for getting started and exploring Folioo.</div>
            <ul className="text-[#171717]/80 text-left mb-6 space-y-2 w-full">
              <li className="flex items-center gap-2 text-base sm:text-lg">
                <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#80F8EE' }}></span>
                <span>Basic features</span>
              </li>
              <li className="flex items-center gap-2 text-base sm:text-lg">
                <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#80F8EE' }}></span>
                <span>Community support</span>
              </li>
            </ul>
            <Link
              href="/join"
              className="mt-auto w-full px-8 py-4 rounded-full font-semibold shadow transition focus:outline-none focus:ring-2 text-lg"
              style={{ background: '#80F8EE', color: '#171717', borderColor: '#80F8EE' }}
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