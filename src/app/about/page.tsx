export default function AboutPage() {
  return (
    <div className="min-h-screen font-league-spartan flex flex-col items-center" style={{ background: '#2F2F32', color: 'var(--color-offwhite-soft)' }}>
      <main className="w-full max-w-4xl rounded-3xl shadow-2xl mt-6 sm:mt-10 mb-4 sm:mb-10 overflow-hidden px-0" style={{ background: '#232326' }}>
        {/* Hero Section */}
        <section className="px-4 sm:px-8 pt-10 sm:pt-12 pb-4 sm:pb-6 text-center">
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 sm:mb-4" style={{ color: 'var(--color-charcoal-deep)' }}>About Folioo</h1>
          <p className="text-base sm:text-xl text-[#171717]/80 mb-6 sm:mb-8 max-w-2xl mx-auto font-light">Empowering South Africa's creative community to connect, collaborate, and thrive.</p>
        </section>

        {/* Mission & Vision */}
        <section className="px-4 sm:px-8 py-6 sm:py-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          <div className="bg-[#F6F5F3] rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center text-center" style={{ background: '#232326' }}>
            <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" style={{ color: '#00b3a4' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 0v10l6 3" /></svg>
            <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2" style={{ color: 'var(--color-charcoal-deep)' }}>Our Mission</h2>
            <p className="text-[#171717]/80 text-sm sm:text-base">To make it effortless for clients and creatives to find each other, collaborate, and bring ideas to life.</p>
          </div>
          <div className="bg-[#F6F5F3] rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center text-center" style={{ background: '#232326' }}>
            <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" style={{ color: '#00b3a4' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2" style={{ color: 'var(--color-charcoal-deep)' }}>Our Vision</h2>
            <p className="text-[#171717]/80 text-sm sm:text-base">A vibrant, accessible platform where every creative can showcase their talent and every client can find the perfect match.</p>
          </div>
        </section>

        {/* Our Story */}
        <section className="px-4 sm:px-8 py-6 sm:py-10 flex flex-col md:flex-row items-center gap-6 sm:gap-10">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--color-charcoal-deep)' }}>Our Story</h2>
            <p className="text-[#171717]/80 mb-3 sm:mb-4 text-sm sm:text-base">Folioo was founded by creatives, for creatives. We saw the challenges of finding the right talent and the right opportunities, and set out to build a platform that makes creative collaboration seamless, transparent, and rewarding for everyone.</p>
            <p className="text-[#171717]/80 text-sm sm:text-base">Today, Folioo is trusted by hundreds of creatives and clients across South Africa, helping them connect, create, and grow together.</p>
          </div>
          <div className="flex-1 flex justify-center mt-6 md:mt-0">
            <div className="w-32 h-32 sm:w-48 sm:h-48 bg-[#CBC8C8] rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-16 h-16 sm:w-24 sm:h-24" style={{ color: '#00b3a4' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-4 sm:px-8 py-6 sm:py-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center" style={{ color: 'var(--color-charcoal-deep)' }}>What Makes Us Different</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center text-center" style={{ background: '#232326' }}>
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" style={{ color: '#00b3a4' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" /></svg>
              <h3 className="text-base sm:text-lg font-bold text-[#171717] mb-1 sm:mb-2">Verified Talent</h3>
              <p className="text-[#171717]/80 text-xs sm:text-base">Every creative is vetted for quality and professionalism.</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center text-center" style={{ background: '#232326' }}>
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" style={{ color: '#00b3a4' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="7" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
              <h3 className="text-base sm:text-lg font-bold text-[#171717] mb-1 sm:mb-2">Fast Connections</h3>
              <p className="text-[#171717]/80 text-xs sm:text-base">Find and book the right creative in minutes, not days.</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center text-center" style={{ background: '#232326' }}>
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" style={{ color: '#00b3a4' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
              <h3 className="text-base sm:text-lg font-bold text-[#171717] mb-1 sm:mb-2">Seamless Experience</h3>
              <p className="text-[#171717]/80 text-xs sm:text-base">From discovery to booking, everything is smooth and transparent.</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center text-center" style={{ background: '#232326' }}>
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" style={{ color: '#00b3a4' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
              <h3 className="text-base sm:text-lg font-bold text-[#171717] mb-1 sm:mb-2">Community First</h3>
              <p className="text-[#171717]/80 text-xs sm:text-base">We're building a supportive, inspiring network for all creatives.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 