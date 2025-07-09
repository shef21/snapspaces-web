"use client";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import TestimonialsSlider from "./TestimonialsSlider";
import { useEffect, useState } from "react";
import { getActiveHomepageAd, incrementAdImpression, incrementAdClick } from "@/utils/ads";

const steps = [
  {
    icon: (
      <svg className="w-12 h-12 mx-auto text-[#171717]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
    ),
    title: "Search",
    desc: "Browse and discover top creatives in your area or by specialty."
  },
  {
    icon: (
      <svg className="w-12 h-12 mx-auto text-[#171717]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M21 16.5V8.5a2 2 0 0 0-2-2h-1.17a2 2 0 0 1-1.41-.59l-1.83-1.83a2 2 0 0 0-1.41-.59H9.83a2 2 0 0 0-1.41.59L6.59 5.91A2 2 0 0 1 5.17 6.5H4a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z" /></svg>
    ),
    title: "Connect",
    desc: "Message and collaborate with your chosen creative directly."
  },
  {
    icon: (
      <svg className="w-12 h-12 mx-auto text-[#171717]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
    ),
    title: "Book",
    desc: "Secure your booking with your chosen creative."
  }
];

const testimonials = [
  {
    quote: "I found my photographer in 10 minutes — and they nailed the shoot.",
    name: "Thandi M.",
    photo: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    quote: "SnapSpaces is the future of creative work.",
    name: "Sipho K.",
    photo: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    quote: "Booking a videographer was seamless and fast!",
    name: "Ayesha P.",
    photo: "https://randomuser.me/api/portraits/women/46.jpg"
  },
  {
    quote: "I love how easy it is to showcase my portfolio.",
    name: "Lebo N.",
    photo: "https://randomuser.me/api/portraits/men/47.jpg"
  }
];

export default function Home() {
  // TEST STRING FOR VERIFICATION
  const [homepageAd, setHomepageAd] = useState<any>(null);
  useEffect(() => {
    async function fetchAd() {
      const { ad } = await getActiveHomepageAd();
      if (ad) {
        setHomepageAd(ad);
        await incrementAdImpression(ad.id);
      }
    }
    fetchAd();
  }, []);
  return (
    <div className="min-h-screen font-league-spartan flex flex-col items-center" style={{ background: 'var(--color-background-warm)' }}>
      <main className="w-full max-w-6xl rounded-3xl shadow-2xl mt-4 sm:mt-10 mb-4 sm:mb-10 overflow-hidden" style={{ background: 'var(--color-text-contrast)' }}>
        {/* Hero Section */}
        <section className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] flex items-center justify-center" style={{ background: 'var(--color-primary-accent)' }}>
          <img
            src="/images/my-hero.jpg"
            alt="Creative Studio"
            className="absolute inset-0 w-full h-full object-cover rounded-b-3xl"
            style={{ zIndex: 1 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-text-contrast)]/70 to-transparent rounded-b-3xl z-10"></div>
          <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-4">
            <h1 style={{ color: 'var(--color-background-warm)', textShadow: '0 2px 8px rgba(30,30,30,0.5)' }} className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-center drop-shadow-lg mb-4 sm:mb-6">
              Book Top <span style={{ color: 'var(--color-primary-accent)', textShadow: '0 2px 8px rgba(30,30,30,0.5)', fontFamily: 'MonopolyBank, cursive' }} className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl leading-tight font-extrabold">Creatives</span>. Instantly.
            </h1>
            <p style={{ color: 'var(--color-background-warm)', textShadow: '0 2px 8px rgba(30,30,30,0.5)' }} className="text-base sm:text-2xl md:text-3xl mb-6 sm:mb-8 max-w-2xl text-center font-light">Connecting clients with photographers, videographers, and creatives across South Africa.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
              <Link href="/explore" style={{ background: 'var(--color-primary-accent)', color: 'var(--color-text-contrast)' }} className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 font-semibold shadow-xl hover:opacity-90 rounded-full w-full sm:w-auto text-center">Book a Creative</Link>
              <Link href="/join" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 font-semibold shadow-xl bg-white/90 hover:bg-white text-[var(--color-text-contrast)] rounded-full w-full sm:w-auto text-center">Join as a Creative</Link>
            </div>
          </div>
        </section>

        {/* Paid Advertising Section */}
        <section className="px-4 sm:px-8 py-6 sm:py-8 flex justify-center">
          {homepageAd ? (
            <div style={{ background: 'var(--color-secondary-accent)', borderColor: 'var(--color-secondary-accent)' }} className="relative w-full max-w-3xl border-2 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-8">
              <span style={{ background: 'var(--color-secondary-accent)', color: 'var(--color-text-contrast)' }} className="absolute top-2 left-2 sm:top-4 sm:left-4 text-xs font-bold px-3 py-1 rounded-full shadow">Sponsored</span>
              {homepageAd.image_url && (
                <img src={homepageAd.image_url} alt="Ad Logo" className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-4" style={{ borderColor: 'var(--color-secondary-accent)' }} />
              )}
              <div className="flex-1 flex flex-col items-start">
                <h3 className="text-lg sm:text-2xl font-bold text-[var(--color-text-contrast)] mb-2">{homepageAd.ad_slots?.name || "Ad"}</h3>
                <p className="text-[var(--color-text-contrast)]/80 mb-3 text-sm sm:text-base">{homepageAd.ad_slots?.description || homepageAd.link_url}</p>
                <a
                  href={homepageAd.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: 'var(--color-secondary-accent)', color: 'var(--color-text-contrast)', borderColor: 'var(--color-secondary-accent)' }}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow border transition w-full sm:w-auto"
                  onClick={async () => { await incrementAdClick(homepageAd.id); }}
                >
                  Visit Sponsor
                </a>
              </div>
            </div>
          ) : (
            <div style={{ background: 'var(--color-secondary-accent)', borderColor: 'var(--color-secondary-accent)' }} className="relative w-full max-w-3xl border-2 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-8">
              <span style={{ background: 'var(--color-secondary-accent)', color: 'var(--color-text-contrast)' }} className="absolute top-2 left-2 sm:top-4 sm:left-4 text-xs font-bold px-3 py-1 rounded-full shadow">Sponsored</span>
              <div className="flex-1 flex flex-col items-start">
                <h3 className="text-lg sm:text-2xl font-bold text-[var(--color-text-contrast)] mb-2">Your Ad Here!</h3>
                <p className="text-[var(--color-text-contrast)]/80 mb-3 text-sm sm:text-base">Reach thousands of clients looking for top creative talent. Get featured on our homepage and boost your bookings.</p>
                <Link href="/advertise" style={{ background: 'var(--color-secondary-accent)', color: 'var(--color-text-contrast)', borderColor: 'var(--color-secondary-accent)' }} className="px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow border transition w-full sm:w-auto text-center">Advertise Now</Link>
              </div>
            </div>
          )}
        </section>

        {/* Intro & How It Works */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 px-4 sm:px-8 py-10 sm:py-16 items-center">
          {/* Left: Intro */}
          <div>
            <h2 className="text-xl sm:text-3xl font-bold text-[var(--color-text-contrast)] mb-3 sm:mb-4">What is SnapSpaces?</h2>
            <p className="text-[var(--color-text-contrast)]/80 mb-4 sm:mb-6 text-base sm:text-lg font-light">SnapSpaces is the easiest way to find, connect, and book top creative talent for your next project or event. Whether you need a photographer, videographer, or designer, we make it seamless and fast.</p>
            <ul className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <li className="flex items-center gap-2 text-[var(--color-text-contrast)]/80 text-sm sm:text-base"><span style={{ background: 'var(--color-primary-accent)' }} className="inline-block w-3 h-3 rounded-full"></span>Vetted Creatives</li>
              <li className="flex items-center gap-2 text-[var(--color-text-contrast)]/80 text-sm sm:text-base"><span style={{ background: 'var(--color-primary-accent)' }} className="inline-block w-3 h-3 rounded-full"></span>Direct Messaging</li>
              <li className="flex items-center gap-2 text-[var(--color-text-contrast)]/80 text-sm sm:text-base"><span style={{ background: 'var(--color-primary-accent)' }} className="inline-block w-3 h-3 rounded-full"></span>Instant Booking</li>
              <li className="flex items-center gap-2 text-[var(--color-text-contrast)]/80 text-sm sm:text-base"><span style={{ background: 'var(--color-primary-accent)' }} className="inline-block w-3 h-3 rounded-full"></span>Showcase Portfolios</li>
            </ul>
          </div>
          {/* Right: How It Works */}
          <div className="bg-[var(--color-background-warm)] rounded-2xl p-4 sm:p-8 shadow flex flex-col gap-6 sm:gap-8">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-contrast)] mb-2">How It Works</h3>
            <div className="flex flex-col gap-4 sm:gap-6">
              {steps.map((step, idx) => (
                <div key={step.title} className="flex items-center gap-3 sm:gap-4">
                  <span style={{ background: 'var(--color-primary-accent)', color: 'var(--color-text-contrast)' }} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full font-bold text-lg sm:text-xl shadow">{idx + 1}</span>
                  <div>
                    <div className="font-semibold text-[var(--color-text-contrast)] text-sm sm:text-base">{step.title}</div>
                    <div className="text-[var(--color-text-contrast)]/70 text-xs sm:text-sm">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Steps */}
        <section className="px-4 sm:px-8 py-8 sm:py-14 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 bg-[var(--color-background-warm)]">
          <div className="bg-white rounded-2xl shadow p-6 sm:p-8 flex flex-col items-start">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-contrast)] mb-2">For Clients</h3>
            <p className="text-[var(--color-text-contrast)]/80 mb-3 sm:mb-4 text-sm sm:text-base">Find and book the perfect creative for your project, event, or campaign—quickly and confidently.</p>
            <Link href="/explore" style={{ background: 'var(--color-primary-accent)', color: 'var(--color-text-contrast)', borderColor: 'var(--color-primary-accent)' }} className="btn-primary text-sm sm:text-md px-4 sm:px-6 py-2 font-semibold shadow rounded-full w-full sm:w-auto text-center">Book a Creative</Link>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 sm:p-8 flex flex-col items-start">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-contrast)] mb-2">For Creatives</h3>
            <p className="text-[var(--color-text-contrast)]/80 mb-3 sm:mb-4 text-sm sm:text-base">Showcase your portfolio, get discovered by new clients, and grow your creative business with SnapSpaces.</p>
            <Link href="/join" style={{ background: 'var(--color-primary-accent)', color: 'var(--color-text-contrast)', borderColor: 'var(--color-primary-accent)' }} className="btn-secondary text-sm sm:text-md px-4 sm:px-6 py-2 font-semibold shadow rounded-full w-full sm:w-auto text-center">Join as a Creative</Link>
          </div>
        </section>

        {/* Featured Creators */}
        <section className="px-4 sm:px-8 py-8 sm:py-12">
          <h2 className="text-xl sm:text-3xl font-bold text-[var(--color-text-contrast)] mb-4 sm:mb-6">Featured Creators</h2>
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 -mx-4 sm:mx-0 px-4 sm:px-0 snap-x snap-mandatory">
            {testimonials.map((creator, idx) => (
              <div key={creator.name} className="min-w-[220px] bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center snap-center">
                <img src={creator.photo} alt={creator.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-3 sm:mb-4" style={{ border: '4px solid var(--color-secondary-accent)' }} />
                <div className="font-bold text-[var(--color-text-contrast)] text-base sm:text-lg mb-1">{creator.name}</div>
                <div className="text-[var(--color-text-contrast)]/70 text-xs sm:text-sm mb-1 sm:mb-2">Photographer</div>
                <div className="text-[var(--color-text-contrast)]/80 text-center text-xs sm:text-sm mb-1 sm:mb-2">"{creator.quote}"</div>
                <Link href="#" style={{ color: 'var(--color-secondary-accent)' }} className="font-semibold text-xs sm:text-sm mt-2 hover:underline focus:outline-none focus:ring-2 rounded">View Profile</Link>
              </div>
            ))}
          </div>
        </section>

        {/* Why SnapSpaces / Features */}
        <section className="px-4 sm:px-8 py-8 sm:py-14" style={{ background: 'var(--color-background-warm)' }}>
          <h2 className="text-xl sm:text-3xl font-bold mb-6 sm:mb-8" style={{ color: 'var(--color-secondary-accent)' }}>Why SnapSpaces?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow p-4 sm:p-8 flex flex-col items-center text-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" style={{ color: 'var(--color-positive-accent)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" /></svg>
              <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-contrast)] mb-1 sm:mb-2">Vetted Local Talent</h3>
              <p className="text-[var(--color-text-contrast)]/80 text-xs sm:text-base font-light">Only the best, verified creatives in your area.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow p-4 sm:p-8 flex flex-col items-center text-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" style={{ color: 'var(--color-positive-accent)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="7" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
              <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-contrast)] mb-1 sm:mb-2">Fast Booking</h3>
              <p className="text-[var(--color-text-contrast)]/80 text-xs sm:text-base font-light">Book a creative in minutes, not days.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow p-4 sm:p-8 flex flex-col items-center text-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" style={{ color: 'var(--color-positive-accent)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
              <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-contrast)] mb-1 sm:mb-2">Seamless Communication</h3>
              <p className="text-[var(--color-text-contrast)]/80 text-xs sm:text-base font-light">Chat directly with your chosen creative.</p>
            </div>
            {/* Card 4 */}
            <div className="bg-white rounded-2xl shadow p-4 sm:p-8 flex flex-col items-center text-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" style={{ color: 'var(--color-positive-accent)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
              <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-contrast)] mb-1 sm:mb-2">Trusted Results</h3>
              <p className="text-[var(--color-text-contrast)]/80 text-xs sm:text-base font-light">See real reviews and proven portfolios.</p>
            </div>
        </div>
        </section>

        {/* Stats Row */}
        <section className="px-4 sm:px-8 py-6 sm:py-10 flex flex-wrap justify-between items-center gap-4 sm:gap-8 bg-white border-t border-[#E5E3E3]">
          <div className="flex flex-col items-center"><span className="text-lg sm:text-2xl font-bold" style={{ color: 'var(--color-secondary-accent)' }}>1,200+</span><span className="text-[#171717]/70 text-xs sm:text-sm">Bookings</span></div>
          <div className="flex flex-col items-center"><span className="text-lg sm:text-2xl font-bold" style={{ color: 'var(--color-secondary-accent)' }}>500+</span><span className="text-[#171717]/70 text-xs sm:text-sm">Creatives</span></div>
          <div className="flex flex-col items-center"><span className="text-lg sm:text-2xl font-bold" style={{ color: 'var(--color-secondary-accent)' }}>30+</span><span className="text-[#171717]/70 text-xs sm:text-sm">Cities</span></div>
          <div className="flex flex-col items-center"><span className="text-lg sm:text-2xl font-bold" style={{ color: 'var(--color-secondary-accent)' }}>4.9/5</span><span className="text-[#171717]/70 text-xs sm:text-sm">Avg. Rating</span></div>
        </section>

        {/* Testimonials */}
        <section className="px-4 sm:px-8 py-8 sm:py-14">
          <h2 className="text-xl sm:text-3xl font-bold text-[var(--color-text-contrast)] mb-6 sm:mb-8">What Our Users Say</h2>
          <TestimonialsSlider />
        </section>
      </main>
      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col md:flex-row justify-between items-center rounded-t-3xl shadow-xl mb-4 sm:mb-8 gap-4 sm:gap-0" style={{ background: 'var(--color-text-contrast)' }}>
        <div className="font-extrabold text-xl sm:text-2xl" style={{ color: 'var(--color-secondary-accent)' }}>SnapSpaces</div>
        <div className="flex gap-4 sm:gap-6 mt-2 sm:mt-4 md:mt-0">
          <Link href="/explore" className="text-[#171717]/80 hover:text-[#00b3a4] text-sm sm:text-base">Explore</Link>
          <Link href="/join" className="text-[#171717]/80 hover:text-[#00b3a4] text-sm sm:text-base">Join</Link>
          <Link href="/about" className="text-[#171717]/80 hover:text-[#00b3a4] text-sm sm:text-base">About</Link>
        </div>
        <div className="flex gap-2 sm:gap-4 mt-2 sm:mt-4 md:mt-0">
          {/* Social icons placeholder */}
          <span className="w-7 h-7 sm:w-8 sm:h-8 bg-[#CBC8C8] rounded-full flex items-center justify-center text-[#171717] text-sm sm:text-base">F</span>
          <span className="w-7 h-7 sm:w-8 sm:h-8 bg-[#CBC8C8] rounded-full flex items-center justify-center text-[#171717] text-sm sm:text-base">I</span>
          <span className="w-7 h-7 sm:w-8 sm:h-8 bg-[#CBC8C8] rounded-full flex items-center justify-center text-[#171717] text-sm sm:text-base">T</span>
        </div>
      </footer>
    </div>
  );
}
