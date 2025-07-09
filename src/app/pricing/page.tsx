import React from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';

const PricingPage = () => {
  return (
    <div className="min-h-screen font-league-spartan flex flex-col items-center" style={{ background: 'var(--color-background-warm)', color: 'var(--color-text-contrast)' }}>
      <main className="w-full max-w-6xl rounded-3xl shadow-2xl mt-10 mb-10 overflow-hidden px-0" style={{ background: 'var(--color-text-contrast)' }}>
        {/* Hero Section */}
        <section className="px-4 sm:px-8 pt-8 sm:pt-12 pb-6 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--color-secondary-accent)' }}>
            Simple, Transparent Pricing
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-contrast)]/80 mb-6 sm:mb-8 max-w-2xl mx-auto font-light">Choose the plan that fits your needs. No hidden fees, no surprises—just powerful tools to help you connect, create, and grow on SnapSpaces.</p>
        </section>

        {/* Pricing Tiers */}
        <section className="px-4 sm:px-8 py-8 sm:py-12 flex justify-center">
          <div
            className="rounded-2xl shadow-xl p-8 sm:p-12 flex flex-col items-center text-center border-2 bg-[var(--color-background-warm)]"
            style={{ borderColor: 'var(--color-secondary-accent)' }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--color-text-contrast)' }}>Starter</h2>
            <div className="text-3xl sm:text-4xl font-extrabold mb-2" style={{ color: 'var(--color-primary-accent)' }}>
              Free
            </div>
            <div className="text-[var(--color-text-contrast)]/80 mb-4 text-base sm:text-lg">Perfect for getting started and exploring SnapSpaces.</div>
            <ul className="text-[var(--color-text-contrast)]/80 text-left mb-6 space-y-2 w-full">
              <li className="flex items-center gap-2 text-base sm:text-lg">
                <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ background: 'var(--color-primary-accent)' }}></span>
                <span>Basic features</span>
              </li>
              <li className="flex items-center gap-2 text-base sm:text-lg">
                <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ background: 'var(--color-primary-accent)' }}></span>
                <span>Community support</span>
              </li>
            </ul>
            <Link
              href="/join"
              className="btn-primary mt-auto w-full px-8 py-4 rounded-full font-semibold shadow transition focus:outline-none focus:ring-2 text-lg"
              style={{ background: 'var(--color-primary-accent)', color: 'var(--color-text-contrast)', borderColor: 'var(--color-primary-accent)' }}
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