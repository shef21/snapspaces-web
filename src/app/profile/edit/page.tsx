'use client';
import { useState, useEffect } from "react";
import Tooltip from '../../../components/Tooltip';
import { getUser } from '../../../utils/auth';
import { getProfile, upsertProfile, getProfileCompletionStatus } from '../../../utils/profile';
import { useUser } from '../../../context/UserContext';
import { useRouter } from 'next/navigation';

const specialtiesList = [
  "Photographer",
  "Videographer",
  "Makeup Artist",
  "Graphic Designer",
  "Stylist",
  "Other"
];

export default function EditProfilePage() {
  const user = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    specialties: [] as string[],
    location: "",
    photo: "",
    portfolio: [""],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [completion, setCompletion] = useState<{ complete: boolean; missing: string[] }>({ complete: true, missing: [] });

  useEffect(() => {
    if (user === null) return; // still loading
    if (!user) router.replace('/signin');
  }, [user, router]);

  // Show nothing while loading or redirecting
  if (user === null || !user) return null;

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const { data: userData } = await getUser();
      if (!userData?.user) {
        setLoading(false);
        return;
      }
      const { data, error } = await getProfile(userData.user.id);
      if (data) {
        setProfile({
          ...profile,
          ...data,
          specialties: data.specialties || [],
          portfolio: data.portfolio || [""]
        });
        setCompletion(getProfileCompletionStatus({
          ...profile,
          ...data,
          specialties: data.specialties || [],
          portfolio: data.portfolio || [""]
        }));
      }
      setLoading(false);
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }

  function handleSpecialtyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const options = Array.from(e.target.selectedOptions).map(o => o.value);
    setProfile(prev => ({ ...prev, specialties: options }));
  }

  function handlePortfolioChange(idx: number, value: string) {
    setProfile(prev => {
      const updated = [...prev.portfolio];
      updated[idx] = value;
      return { ...prev, portfolio: updated };
    });
  }

  function addPortfolioField() {
    setProfile(prev => ({ ...prev, portfolio: [...prev.portfolio, ""] }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const { data: userData } = await getUser();
    if (!userData?.user) {
      setError("Not signed in.");
      return;
    }
    if (
      !profile.name &&
      !profile.bio &&
      (!profile.specialties || profile.specialties.length === 0) &&
      !profile.location &&
      !profile.photo
    ) {
      setError("Please fill in at least one field to save your profile.");
      return;
    }
    setLoading(true);
    const { error } = await upsertProfile({
      id: userData.user.id,
      ...profile,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 1200);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F5F3] font-league-spartan flex flex-col items-center py-0">
      {/* Hero/Cover Area */}
      <div className="w-full max-w-4xl h-40 sm:h-56 bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-100 rounded-b-3xl shadow-lg relative flex items-end mb-8">
        <div className="absolute left-4 top-4">
          <a href="/profile" className="text-[#171717] bg-white/80 hover:bg-white rounded-full px-4 py-2 shadow font-semibold text-sm flex items-center gap-2 transition">
            <span className="text-xl">←</span> Back to Profile
          </a>
        </div>
        {/* Profile Photo Overlapping */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-56px] sm:bottom-[-72px] z-20">
          <img src={profile.photo || '/default-profile.png'} alt="Profile preview" className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-xl" />
        </div>
      </div>
      <main className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl mt-20 sm:mt-28 overflow-hidden px-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] mb-8 text-center pt-8">Edit Your Profile</h1>
        {!completion.complete && (
          <div className="mb-8 mx-4 p-4 rounded-2xl bg-yellow-50 border border-yellow-300 text-yellow-900 flex flex-col items-center shadow">
            <span className="font-bold text-lg mb-1">Complete your profile to get discovered!</span>
            <span className="text-sm mb-2">You're missing: {completion.missing.join(', ')}</span>
            <span className="text-xs text-yellow-800">Profiles with more info get more bookings and appear higher in search results.</span>
          </div>
        )}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-8 pb-12" onSubmit={handleSave}>
          {/* Left: Profile Info */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#F6F5F3] rounded-2xl shadow p-5 flex flex-col gap-3 border border-[#E5E3E3]">
              <label htmlFor="name" className="text-[#171717] font-semibold mb-1">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
                className="px-4 py-3 rounded-full border border-[#E5E3E3] bg-white text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300 text-base shadow-sm w-full transition"
                placeholder="Your name"
                disabled={loading}
              />
            </div>
            <div className="bg-[#F6F5F3] rounded-2xl shadow p-5 flex flex-col gap-3 border border-[#E5E3E3]">
              <label htmlFor="bio" className="text-[#171717] font-semibold mb-1">Bio/About</label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="px-4 py-3 rounded-2xl border border-[#E5E3E3] bg-white text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300 text-base shadow-sm w-full transition"
                placeholder="Tell us about yourself..."
                disabled={loading}
              />
            </div>
            <div className="bg-[#F6F5F3] rounded-2xl shadow p-5 flex flex-col gap-3 border border-[#E5E3E3]">
              <label htmlFor="specialties" className="text-[#171717] font-semibold mb-1">Specialties</label>
              <select
                id="specialties"
                name="specialties"
                multiple
                value={profile.specialties}
                onChange={handleSpecialtyChange}
                className="px-4 py-3 rounded-2xl border border-[#E5E3E3] bg-white text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300 text-base shadow-sm w-full h-32 transition"
                disabled={loading}
              >
                {specialtiesList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="text-xs text-[#171717]/60">Hold Ctrl (Cmd on Mac) to select multiple</span>
            </div>
            <div className="bg-[#F6F5F3] rounded-2xl shadow p-5 flex flex-col gap-3 border border-[#E5E3E3]">
              <label htmlFor="location" className="text-[#171717] font-semibold mb-1">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={profile.location}
                onChange={handleChange}
                className="px-4 py-3 rounded-full border border-[#E5E3E3] bg-white text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300 text-base shadow-sm w-full transition"
                placeholder="e.g. Cape Town"
                disabled={loading}
              />
            </div>
          </div>
          {/* Right: Photo & Portfolio */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#F6F5F3] rounded-2xl shadow p-5 flex flex-col gap-3 border border-[#E5E3E3]">
              <label htmlFor="photo-upload" className="text-[#171717] font-semibold mb-1">Profile Photo</label>
              <input
                id="photo-upload"
                name="photo-upload"
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (!e.target.files || e.target.files.length === 0) return;
                  const file = e.target.files[0];
                  setLoading(true);
                  setError("");
                  const { data: userData } = await getUser();
                  if (!userData?.user) {
                    setError("Not signed in.");
                    setLoading(false);
                    return;
                  }
                  const { url, error } = await import('../../../utils/profile').then(m => m.uploadProfilePhoto(userData.user.id, file));
                  if (error) {
                    setError(error.message || "Failed to upload image.");
                  } else if (url) {
                    setProfile(prev => ({ ...prev, photo: url }));
                  }
                  setLoading(false);
                }}
                className="px-4 py-3 rounded-full border border-[#E5E3E3] bg-white text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300 text-base shadow-sm w-full transition"
                disabled={loading}
              />
              {profile.photo && (
                <div className="mt-2 flex flex-col items-center">
                  <img src={profile.photo} alt="Profile preview" className="w-24 h-24 rounded-full object-cover border-4 border-yellow-300 shadow mb-2" />
                  <span className="text-xs text-[#171717]/60">Preview</span>
                </div>
              )}
            </div>
            <div className="bg-[#F6F5F3] rounded-2xl shadow p-5 flex flex-col gap-3 border border-[#E5E3E3]">
              <label className="text-[#171717] font-semibold mb-1">Portfolio Images</label>
              <input
                id="portfolio-upload"
                name="portfolio-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  setLoading(true);
                  setError("");
                  const { data: userData } = await getUser();
                  if (!userData?.user) {
                    setError("Not signed in.");
                    setLoading(false);
                    return;
                  }
                  const { urls, errors } = await import('../../../utils/profile').then(m => m.uploadPortfolioImages(userData.user.id, files));
                  if (errors && errors.length > 0) {
                    setError("Some images failed to upload.");
                  }
                  if (urls && urls.length > 0) {
                    setProfile(prev => ({ ...prev, portfolio: [...prev.portfolio.filter(Boolean), ...urls] }));
                  }
                  setLoading(false);
                }}
                className="px-4 py-3 rounded-full border border-[#E5E3E3] bg-white text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300 text-base shadow-sm w-full transition"
                disabled={loading}
              />
              <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full mt-2">
                {profile.portfolio.filter(Boolean).length === 0 ? (
                  <div className="col-span-2 text-center text-[#171717]/40 text-xs sm:text-base py-6">Add portfolio images to showcase your work</div>
                ) : (
                  profile.portfolio.filter(Boolean).map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img src={url} alt="Portfolio" className="w-full h-20 sm:h-28 object-cover rounded-xl shadow" />
                      <button type="button" onClick={() => setProfile(prev => ({ ...prev, portfolio: prev.portfolio.filter((_, i) => i !== idx) }))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 group-hover:opacity-100 transition" title="Remove image">&times;</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* Sticky Save Button */}
          <div className="md:col-span-2 flex flex-col items-center mt-8">
            {error && <div className="text-red-600 text-base font-bold text-center mb-2 bg-red-100 border border-red-300 rounded p-2 w-full max-w-lg">{error}</div>}
            <button type="submit" className="w-full max-w-lg px-8 py-4 rounded-full bg-yellow-300 hover:bg-yellow-400 text-[#171717] font-semibold shadow-lg border border-yellow-300 transition text-lg flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed sticky bottom-4 z-30" disabled={loading}>
              {loading ? <span className="loader mr-2"></span> : null}
              {loading ? "Saving..." : "Save Profile"}
            </button>
            {success && (
              <div className="px-4 sm:px-8 pb-4 sm:pb-8 text-center text-green-700 font-semibold">Profile saved!</div>
            )}
          </div>
        </form>
        {/* Premium Preview Section */}
        <div className="mt-12 px-4 sm:px-8 pb-12">
          <h2 className="text-xl font-bold text-[#171717] mb-4 text-center">Profile Preview</h2>
          <div className="bg-[#F6F5F3] rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4 border border-[#E5E3E3]">
            {profile.photo ? (
              <img src={profile.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-yellow-300 shadow mb-2" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#CBC8C8] flex items-center justify-center mb-2 text-[#171717]/40 text-3xl">?</div>
            )}
            <div className="font-bold text-xl text-[#171717] mb-1">{profile.name || <span className='text-[#171717]/40'>Your Name</span>}</div>
            <div className="text-yellow-600 font-semibold mb-1 text-base">{profile.specialties.length ? profile.specialties.join(", ") : <span className='text-[#171717]/40'>Specialties</span>}</div>
            <div className="text-[#171717]/70 mb-2 text-sm">{profile.location || <span className='text-[#171717]/40'>Location</span>}</div>
            <div className="text-[#171717]/80 mb-3 text-center text-base">{profile.bio || <span className='text-[#171717]/40'>Your bio/about info...</span>}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mt-2">
              {profile.portfolio.filter(Boolean).length === 0 ? (
                <div className="col-span-2 sm:col-span-3 text-center text-[#171717]/40 text-base py-6">Add portfolio images to showcase your work</div>
              ) : (
                profile.portfolio.filter(Boolean).map((url, idx) => (
                  <img key={idx} src={url} alt="Portfolio" className="w-full h-24 sm:h-32 object-cover rounded-xl shadow" />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <style jsx>{`
        .loader {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #facc15;
          border-radius: 50%;
          width: 1em;
          height: 1em;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 