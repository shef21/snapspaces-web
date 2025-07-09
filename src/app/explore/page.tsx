'use client';
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Tooltip from '../../components/Tooltip';
import { getProfileList } from '../../utils/profile';

const specialties = [
  "All", "Photographer", "Videographer", "Makeup Artist", "Graphic Designer"
];

const locations = [
  "All", "Cape Town", "Johannesburg", "Durban", "Pretoria"
];

function slugify(name: string) {
  return name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
}

export default function ExplorePage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');

  useEffect(() => {
    async function fetchProfiles() {
      setLoading(true);
      const { data, error } = await getProfileList();
      if (data) setProfiles(data);
      setLoading(false);
    }
    fetchProfiles();
  }, []);

  // Filtering logic
  const filteredProfiles = profiles.filter((profile) => {
    // Search text (name, specialties, location)
    const search = searchText.toLowerCase();
    const matchesSearch =
      profile.name?.toLowerCase().includes(search) ||
      (profile.specialties || []).join(',').toLowerCase().includes(search) ||
      (profile.location || '').toLowerCase().includes(search);

    // Specialty filter
    const matchesSpecialty =
      selectedSpecialty === 'All' ||
      (profile.specialties || []).includes(selectedSpecialty);

    // Location filter
    const matchesLocation =
      selectedLocation === 'All' ||
      profile.location === selectedLocation;

    // Rating filter
    const matchesRating =
      selectedRating === 'All' ||
      (profile.rating && profile.rating >= Number(selectedRating));

    // Price filter (assumes price is a string like 'R299/mo' or a number)
    let matchesPrice = true;
    if (selectedPrice !== 'All') {
      const priceValue = typeof profile.price === 'string' ? parseInt(profile.price.replace(/[^0-9]/g, '')) : profile.price;
      if (selectedPrice === 'Low') matchesPrice = priceValue <= 500;
      else if (selectedPrice === 'Mid') matchesPrice = priceValue > 500 && priceValue <= 1000;
      else if (selectedPrice === 'High') matchesPrice = priceValue > 1000;
    }

    return matchesSearch && matchesSpecialty && matchesLocation && matchesRating && matchesPrice;
  });

  return (
    <div className="min-h-screen font-league-spartan flex flex-col items-center" style={{ background: 'var(--color-background-warm)' }}>
      <main className="w-full max-w-6xl rounded-3xl shadow-2xl mt-10 mb-10 overflow-hidden px-0" style={{ background: 'var(--color-text-contrast)' }}>
        {/* Featured Creatives */}
        <section className="px-4 sm:px-8 pt-12 pb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-6">Featured Creatives</h2>
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 -mx-4 sm:mx-0 px-4 sm:px-0 snap-x snap-mandatory">
            {profiles.filter(c => c.featured).map((creator, idx) => (
              <div 
                key={creator.id} 
                className="min-w-[280px] sm:min-w-[220px] rounded-2xl shadow-lg p-6 flex flex-col items-center border border-[#E5E3E3] snap-center"
                style={{ background: '#232326' }}
              >
                <img src={creator.photo || '/default-profile.png'} alt={creator.name} className="w-20 h-20 rounded-full object-cover mb-4" style={{ border: '4px solid var(--color-aqua-pop)' }} />
                <div className="font-bold text-[#171717] text-lg mb-1">{creator.name || 'Unnamed'}</div>
                <div className="text-[#171717]/70 text-sm mb-2">{(creator.specialties || []).join(', ')}</div>
                <div className="text-[#171717]/60 text-xs mb-2">{creator.location}</div>
                <div className="flex items-center gap-1 text-sm mb-2" style={{ color: 'var(--color-aqua-pop)' }}>★ {creator.rating} <span className="text-[#171717]/50">({creator.reviews})</span></div>
                <div className="text-[#171717]/80 font-semibold mb-2">{creator.price}</div>
                <Link 
                  href={`/creators/${creator.id}`} 
                  className="font-semibold text-sm mt-2 hover:underline focus:outline-none rounded"
                  style={{ color: '#00b3a4' }}
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Paid Advertising Section */}
        <section className="px-8 pt-8 flex justify-center">
          <div className="relative w-full max-w-3xl rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6 p-6 md:p-8" style={{ background: 'var(--color-offwhite-soft)', border: '2px solid var(--color-aqua-pop)' }}>
            <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full shadow" style={{ background: 'var(--color-aqua-pop)', color: 'var(--color-charcoal-deep)' }}>Sponsored</span>
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80" alt="Ad Logo" className="w-20 h-20 rounded-xl object-cover shadow-md" style={{ border: '4px solid var(--color-aqua-pop)' }} />
            <div className="flex-1 flex flex-col items-start">
              <h3 className="text-xl sm:text-2xl font-bold text-[#171717] mb-2">Advertise Your Creative Services Here!</h3>
              <p className="text-[#171717]/80 mb-3">Get seen by clients searching for top talent. Feature your business at the top of the Explore page.</p>
              <button className="px-6 py-3 rounded-full font-semibold shadow border transition focus:outline-none active:scale-95" aria-label="Get Featured" style={{ background: 'var(--color-aqua-pop)', color: 'var(--color-charcoal-deep)', border: '1px solid var(--color-aqua-pop)' }}>
                Get Featured
              </button>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="px-4 sm:px-8 py-6 bg-[#F6F5F3] border-t border-b border-[#E5E3E3] flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search creatives, specialties, or locations..."
              className="w-full px-5 py-3 rounded-full border bg-white text-[#171717] focus:outline-none text-base shadow"
              style={{ border: '1px solid #E5E3E3', boxShadow: '0 0 0 2px var(--color-aqua-pop)' }}
              aria-label="Search creatives"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <select 
                className="w-full sm:w-auto px-4 py-3 rounded-full border bg-white text-[#171717] text-base shadow focus:outline-none"
                style={{ border: '1px solid #E5E3E3', boxShadow: '0 0 0 2px var(--color-aqua-pop)' }}
                aria-label="Filter by specialty"
                value={selectedSpecialty}
                onChange={e => setSelectedSpecialty(e.target.value)}
              >
                {specialties.map(s => <option key={s}>{s}</option>)}
              </select>
              <select 
                className="w-full sm:w-auto px-4 py-3 rounded-full border bg-white text-[#171717] text-base shadow focus:outline-none"
                style={{ border: '1px solid #E5E3E3', boxShadow: '0 0 0 2px var(--color-aqua-pop)' }}
                aria-label="Filter by location"
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
              >
                {locations.map(l => <option key={l}>{l}</option>)}
              </select>
              <select
                className="w-full sm:w-auto px-4 py-3 rounded-full border bg-white text-[#171717] text-base shadow focus:outline-none"
                style={{ border: '1px solid #E5E3E3', boxShadow: '0 0 0 2px var(--color-aqua-pop)' }}
                aria-label="Filter by rating"
                value={selectedRating}
                onChange={e => setSelectedRating(e.target.value)}
              >
                <option value="All">All Ratings</option>
                <option value="4">4+ stars</option>
                <option value="3">3+ stars</option>
                <option value="2">2+ stars</option>
                <option value="1">1+ stars</option>
              </select>
              <select
                className="w-full sm:w-auto px-4 py-3 rounded-full border bg-white text-[#171717] text-base shadow focus:outline-none"
                style={{ border: '1px solid #E5E3E3', boxShadow: '0 0 0 2px var(--color-aqua-pop)' }}
                aria-label="Filter by price"
                value={selectedPrice}
                onChange={e => setSelectedPrice(e.target.value)}
              >
                <option value="All">All Prices</option>
                <option value="Low">Low (&le; R500)</option>
                <option value="Mid">Mid (R501 - R1000)</option>
                <option value="High">High (&gt; R1000)</option>
              </select>
            </div>
          </div>
          <button 
            className="w-full sm:w-auto px-6 py-3 rounded-full font-semibold shadow border transition focus:outline-none"
            style={{ background: 'var(--color-aqua-pop)', color: 'var(--color-charcoal-deep)', border: '1px solid var(--color-aqua-pop)' }}
            aria-label="Apply filters"
          >
            Filter
          </button>
        </section>

        {/* Creatives Grid */}
        <section className="px-4 sm:px-8 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#171717]/60">Loading profiles...</div>
          ) : filteredProfiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <img src="/empty-search.svg" alt="No results" className="w-32 h-32 mb-6 opacity-80" />
              <h3 className="text-xl font-bold text-[#171717] mb-2">No creatives found</h3>
              <p className="text-[#171717]/70 mb-4 text-center">Try adjusting your search or filters to find more creatives.</p>
              <button className="px-6 py-3 rounded-full font-semibold shadow border transition focus:outline-none active:scale-95" style={{ background: 'var(--color-aqua-pop)', color: 'var(--color-charcoal-deep)', border: '1px solid var(--color-aqua-pop)' }} onClick={() => { setSearchText(''); setSelectedSpecialty('All'); setSelectedLocation('All'); setSelectedRating('All'); setSelectedPrice('All'); }} aria-label="Reset Filters">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {filteredProfiles.map((creator, idx) => (
                <div key={creator.id} className="bg-[#F6F5F3] rounded-2xl shadow-lg p-6 flex flex-col items-center border border-[#E5E3E3]" style={{ background: '#232326' }}>
                  <img src={creator.photo || '/default-profile.png'} alt={creator.name} className="w-20 h-20 rounded-full object-cover mb-4" style={{ border: '4px solid var(--color-aqua-pop)' }} />
                  <div className="font-bold text-[#171717] text-lg mb-1">{creator.name || 'Unnamed'}</div>
                  <div className="text-[#171717]/70 text-sm mb-2">{(creator.specialties || []).join(', ')}</div>
                  <div className="text-[#171717]/60 text-xs mb-2">{creator.location}</div>
                  <div className="flex items-center gap-1 text-sm mb-2" style={{ color: 'var(--color-aqua-pop)' }}>★ {creator.rating} <span className="text-[#171717]/50">({creator.reviews})</span></div>
                  <div className="text-[#171717]/80 font-semibold mb-2">{creator.price}</div>
                  <Link 
                    href={`/creators/${creator.id}`} 
                    className="font-semibold text-sm mt-2 hover:underline focus:outline-none rounded"
                    style={{ color: '#00b3a4' }}
                  >
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        <section className="px-4 sm:px-8 pb-12 flex justify-center items-center gap-2">
          <button 
            className="px-4 py-2 rounded-full bg-white border border-[#E5E3E3] text-[#171717] font-semibold shadow hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 active:scale-95"
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-[#171717]/80">Page 1 of 5</span>
          <button 
            className="px-4 py-2 rounded-full bg-white border border-[#E5E3E3] text-[#171717] font-semibold shadow hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 active:scale-95"
            aria-label="Next page"
          >
            Next
          </button>
        </section>
      </main>
    </div>
  );
} 