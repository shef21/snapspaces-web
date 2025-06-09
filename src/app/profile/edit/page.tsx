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
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F5F3] font-league-spartan flex flex-col items-center py-6 sm:py-10">
      <main className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] mb-4 sm:mb-6 text-center">Edit Your Profile</h1>
        {!completion.complete && (
          <div className="mb-6 p-4 rounded-2xl bg-yellow-50 border border-yellow-300 text-yellow-900 flex flex-col items-center shadow">
            <span className="font-bold text-lg mb-1">Complete your profile to get discovered!</span>
            <span className="text-sm mb-2">You're missing: {completion.missing.join(', ')}</span>
            <span className="text-xs text-yellow-800">Profiles with more info get more bookings and appear higher in search results.</span>
          </div>
        )}
        <form className="flex flex-col gap-5 sm:gap-6" onSubmit={handleSave}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-[#171717] font-medium">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={profile.name}
              onChange={handleChange}
              className="px-4 sm:px-5 py-3 rounded-full border border-[#E5E3E3] bg-[#F6F5F3] text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300 text-base shadow w-full"
              placeholder="Your name"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="bio" className="text-[#171717] font-medium">Bio/About</label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={3}
              className="px-4 sm:px-5 py-3 rounded-2xl border border-[#E5E3E3] bg-[#F6F5F3] text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300 text-base shadow w-full"
              placeholder="Tell us about yourself..."
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="specialties" className="text-[#171717] font-medium">Specialties</label>
            <select
              id="specialties"
              name="specialties"
              multiple
              value={profile.specialties}
              onChange={handleSpecialtyChange}
              className="px-4 sm:px-5 py-3 rounded-2xl border border-[#E5E3E3] bg-[#F6F5F3] text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300 text-base shadow h-32 w-full"
              disabled={loading}
            >
              {specialtiesList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="text-xs text-[#171717]/60">Hold Ctrl (Cmd on Mac) to select multiple</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="location" className="text-[#171717] font-medium">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={profile.location}
              onChange={handleChange}
              className="px-4 sm:px-5 py-3 rounded-full border border-[#E5E3E3] bg-[#F6F5F3] text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300 text-base shadow w-full"
              placeholder="e.g. Cape Town"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="photo" className="text-[#171717] font-medium">Profile Photo</label>
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
              className="px-4 sm:px-5 py-3 rounded-full border border-[#E5E3E3] bg-[#F6F5F3] text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300 text-base shadow w-full"
              disabled={loading}
            />
            {profile.photo && (
              <div className="mt-2 flex flex-col items-center">
                <img src={profile.photo} alt="Profile preview" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-yellow-300 shadow mb-2" />
                <span className="text-xs text-[#171717]/60">Preview</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#171717] font-medium">Portfolio Image URLs</label>
            {profile.portfolio.map((url, idx) => (
              <input
                key={idx}
                type="text"
                value={url}
                onChange={e => handlePortfolioChange(idx, e.target.value)}
                className="px-4 sm:px-5 py-3 rounded-full border border-[#E5E3E3] bg-[#F6F5F3] text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300 text-base shadow mb-2 w-full"
                placeholder={`Portfolio image #${idx + 1} URL`}
                disabled={loading}
              />
            ))}
            <Tooltip text="Add another portfolio image">
              <button type="button" onClick={addPortfolioField} className="px-4 py-2 rounded-full bg-yellow-300 hover:bg-yellow-400 text-[#171717] font-semibold shadow border border-yellow-300 transition w-full sm:w-fit" disabled={loading}>+ Add Image</button>
            </Tooltip>
          </div>
          {error && <div className="text-red-600 text-sm font-semibold text-center">{error}</div>}
          <button type="submit" className="w-full px-6 py-3 rounded-full bg-yellow-300 hover:bg-yellow-400 text-[#171717] font-semibold shadow border border-yellow-300 transition text-lg mt-2 flex items-center justify-center" disabled={loading}>
            {loading ? <span className="loader mr-2"></span> : null}
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
        {success && (
          <div className="px-4 sm:px-8 pb-4 sm:pb-8 text-center text-green-700 font-semibold">Profile saved!</div>
        )}
        {/* Preview Section */}
        <div className="mt-8 sm:mt-12">
          <h2 className="text-lg sm:text-xl font-bold text-[#171717] mb-3 sm:mb-4 text-center">Profile Preview</h2>
          <div className="bg-[#F6F5F3] rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center">
            {profile.photo ? (
              <img src={profile.photo} alt="Profile" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-yellow-300 shadow mb-3 sm:mb-4" />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#CBC8C8] flex items-center justify-center mb-3 sm:mb-4 text-[#171717]/40 text-3xl">?</div>
            )}
            <div className="font-bold text-base sm:text-lg text-[#171717] mb-1">{profile.name || <span className='text-[#171717]/40'>Your Name</span>}</div>
            <div className="text-yellow-600 font-semibold mb-1 text-sm sm:text-base">{profile.specialties.length ? profile.specialties.join(", ") : <span className='text-[#171717]/40'>Specialties</span>}</div>
            <div className="text-[#171717]/70 mb-2 text-xs sm:text-sm">{profile.location || <span className='text-[#171717]/40'>Location</span>}</div>
            <div className="text-[#171717]/80 mb-3 sm:mb-4 text-center text-xs sm:text-base">{profile.bio || <span className='text-[#171717]/40'>Your bio/about info...</span>}</div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full">
              {profile.portfolio.filter(Boolean).length === 0 ? (
                <div className="col-span-2 text-center text-[#171717]/40 text-xs sm:text-base py-6">Add portfolio images to showcase your work</div>
              ) : (
                profile.portfolio.filter(Boolean).map((url, idx) => (
                  <img key={idx} src={url} alt="Portfolio" className="w-full h-16 sm:h-24 object-cover rounded-xl shadow" />
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