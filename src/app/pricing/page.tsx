import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for getting started and exploring SnapSpaces.",
    features: [
      "Create a profile",
      "Browse creatives",
      "Basic messaging",
      "View portfolios"
    ],
    cta: "Get Started",
    highlight: false
  },
  {
    name: "Pro",
    price: "R299/mo",
    description: "For professionals who want to grow and get booked.",
    features: [
      "All Starter features",
      "Priority search listing",
      "Unlimited messaging",
      "Portfolio analytics",
      "Direct booking requests"
    ],
    cta: "Upgrade to Pro",
    highlight: true
  },
  {
    name: "Agency",
    price: "R799/mo",
    description: "For agencies and teams managing multiple creatives.",
    features: [
      "All Pro features",
      "Team management",
      "Bulk project posting",
      "Dedicated support"
    ],
    cta: "Contact Sales",
    highlight: false
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F6F5F3] font-league-spartan flex flex-col items-center">
      <main className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl mt-10 mb-10 overflow-hidden px-0">
        {/* Hero Section */}
        <section className="px-4 sm:px-8 pt-8 sm:pt-12 pb-6 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#171717] mb-4">Simple, Transparent Pricing</h1>
          <p className="text-base sm:text-lg md:text-xl text-[#171717]/80 mb-6 sm:mb-8 max-w-2xl mx-auto font-light">Choose the plan that fits your needs. No hidden fees, no surprises—just powerful tools to help you connect, create, and grow on SnapSpaces.</p>
        </section>

        {/* Pricing Tiers */}
        <section className="px-4 sm:px-8 py-8 sm:py-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className={`rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center text-center border-2 transition-transform duration-300
                ${plan.highlight ? 'border-yellow-300 bg-yellow-50 scale-105 z-10 md:scale-110 md:p-10' : 'border-[#E5E3E3] bg-[#F6F5F3]'}
                ${plan.highlight ? 'shadow-2xl' : ''}
              `}
              style={plan.highlight ? { boxShadow: '0 8px 32px 0 rgba(255, 193, 7, 0.15)' } : {}}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-[#171717] mb-2">{plan.name}</h2>
              <div className="text-2xl sm:text-3xl font-extrabold text-yellow-400 mb-2">{plan.price}</div>
              <div className="text-[#171717]/80 mb-4 text-sm sm:text-base">{plan.description}</div>
              <ul className="text-[#171717]/80 text-left mb-6 space-y-2 w-full">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm sm:text-base">
                    <span className="inline-block w-2 h-2 sm:w-3 sm:h-3 bg-yellow-300 rounded-full flex-shrink-0"></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="#" 
                className={`mt-auto w-full sm:w-auto px-6 py-3 rounded-full font-semibold shadow ${plan.highlight ? 'bg-yellow-300 hover:bg-yellow-400 text-[#171717]' : 'bg-white hover:bg-yellow-100 text-[#171717]'} border border-yellow-300 transition focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                aria-label={`Select ${plan.name} plan`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </section>

        {/* Call to Action */}
        <section className="px-4 sm:px-8 pb-8 sm:pb-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#171717] mb-4">Ready to get started?</h2>
          <Link 
            href="/join" 
            className="inline-block w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-yellow-300 hover:bg-yellow-400 text-[#171717] font-semibold shadow border border-yellow-300 text-base sm:text-lg transition focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="Join SnapSpaces"
          >
            Join SnapSpaces
          </Link>
        </section>
      </main>
    </div>
  );
} 