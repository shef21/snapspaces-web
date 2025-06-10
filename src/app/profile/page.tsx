"use client";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProfile, getProfileCompletionStatus } from "../../utils/profile";

export default function ProfileDashboard() {
  const user = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState<{ complete: boolean; missing: string[] }>({ complete: true, missing: [] });

  useEffect(() => {
    if (user === null) return;
    if (!user) router.replace("/signin");
  }, [user, router]);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      setLoading(true);
      const { data } = await getProfile(user.id);
      setProfile(data);
      setCompletion(getProfileCompletionStatus(data || {}));
      setLoading(false);
    }
    if (user) fetchProfile();
  }, [user]);

  if (user === null || !user) return null;

  return (
    <div className="min-h-screen bg-[#F6F5F3] font-league-spartan flex flex-col items-center py-0">
      {/* Cover Photo */}
      <div className="w-full max-w-4xl h-48 sm:h-64 bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-100 rounded-b-3xl shadow-lg relative flex items-end">
        {/* Profile Photo Overlapping */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-56px] sm:bottom-[-72px] z-20">
          <img src={profile?.photo || '/default-profile.png'} alt="Profile" className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-xl" />
        </div>
      </div>
      <main className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl mt-20 sm:mt-28 overflow-hidden px-0">
        {/* Profile Card */}
        <section className="flex flex-col items-center pt-20 pb-6 px-4 sm:px-8 border-b border-[#E5E3E3] relative">
          <div className="font-bold text-2xl sm:text-3xl text-[#171717] mb-1">{profile?.name || user.email}</div>
          <div className="text-yellow-600 font-semibold mb-1 text-base sm:text-lg">{(profile?.specialties || []).join(", ")}</div>
          <div className="text-[#171717]/70 mb-2 text-sm">{profile?.location}</div>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-4 justify-center">
            <Link href="/profile/edit" className="w-full sm:w-auto px-6 py-3 rounded-full bg-yellow-300 hover:bg-yellow-400 text-[#171717] font-semibold shadow border border-yellow-300 transition text-center focus:outline-none focus:ring-2 focus:ring-yellow-400">Edit Profile</Link>
            <Link href="/bookings" className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-yellow-100 text-[#171717] font-semibold shadow border border-yellow-300 transition text-center focus:outline-none focus:ring-2 focus:ring-yellow-400">My Bookings</Link>
            <Link href="/messages" className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-yellow-100 text-[#171717] font-semibold shadow border border-yellow-300 transition text-center focus:outline-none focus:ring-2 focus:ring-yellow-400">Messages</Link>
          </div>
          {!completion.complete && (
            <div className="mt-4 mb-2 p-3 rounded-xl bg-yellow-50 border border-yellow-300 text-yellow-900 text-sm text-center">
              <span className="font-bold">Complete your profile:</span> Missing {completion.missing.join(', ')}
            </div>
          )}
        </section>
        {/* About Section */}
        <section className="px-4 sm:px-8 py-8 border-b border-[#E5E3E3]">
          <h2 className="text-xl font-bold text-[#171717] mb-3">About</h2>
          <p className="text-[#171717]/80 text-base sm:text-lg max-w-2xl">{profile?.bio || <span className='text-[#171717]/40'>No bio provided.</span>}</p>
        </section>
        {/* Portfolio Section */}
        <section className="px-4 sm:px-8 py-8 border-b border-[#E5E3E3]">
          <h2 className="text-xl font-bold text-[#171717] mb-4">Portfolio</h2>
          {(profile?.portfolio && profile.portfolio.length > 0 && profile.portfolio.some((url: string) => !!url)) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {profile.portfolio.filter(Boolean).map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Portfolio work ${idx + 1}`}
                  className="w-full h-48 sm:h-64 object-cover rounded-2xl shadow hover:shadow-lg transition-shadow"
                />
              ))}
            </div>
          ) : (
            <div className="text-[#171717]/40 text-center py-8">No portfolio images yet.</div>
          )}
        </section>
        {/* Reviews Section Placeholder */}
        <section className="px-4 sm:px-8 py-8">
          <h2 className="text-xl font-bold text-[#171717] mb-4">Reviews</h2>
          <div className="text-[#171717]/40 text-center py-8">Reviews coming soon!</div>
        </section>
      </main>
    </div>
  );
} 