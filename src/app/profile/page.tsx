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
    <div className="min-h-screen bg-[#F6F5F3] font-league-spartan flex flex-col items-center py-10">
      <main className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6">
        <h1 className="text-2xl font-extrabold text-[#171717] mb-6 text-center">My Profile</h1>
        {loading ? (
          <div className="text-[#171717]/60 text-center py-12">Loading profile...</div>
        ) : !profile ? (
          <div className="text-[#171717]/40 text-center py-12">No profile found. <Link href="/profile/edit" className="text-yellow-700 font-semibold hover:underline">Create your profile</Link></div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <img src={profile.photo || '/default-profile.png'} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-yellow-300 shadow mb-2" />
            <div className="font-bold text-xl text-[#171717]">{profile.name || user.email}</div>
            <div className="text-yellow-600 font-semibold mb-1">{(profile.specialties || []).join(", ")}</div>
            <div className="text-[#171717]/70 mb-2">{profile.location}</div>
            <div className="text-[#171717]/80 mb-3 text-center">{profile.bio}</div>
            {!completion.complete && (
              <div className="mb-2 p-3 rounded-xl bg-yellow-50 border border-yellow-300 text-yellow-900 text-sm text-center">
                <span className="font-bold">Complete your profile:</span> Missing {completion.missing.join(', ')}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
              <Link href="/profile/edit" className="w-full px-6 py-3 rounded-full bg-yellow-300 hover:bg-yellow-400 text-[#171717] font-semibold shadow border border-yellow-300 transition text-center focus:outline-none focus:ring-2 focus:ring-yellow-400">Edit Profile</Link>
              <Link href="/bookings" className="w-full px-6 py-3 rounded-full bg-white hover:bg-yellow-100 text-[#171717] font-semibold shadow border border-yellow-300 transition text-center focus:outline-none focus:ring-2 focus:ring-yellow-400">My Bookings</Link>
              <Link href="/messages" className="w-full px-6 py-3 rounded-full bg-white hover:bg-yellow-100 text-[#171717] font-semibold shadow border border-yellow-300 transition text-center focus:outline-none focus:ring-2 focus:ring-yellow-400">Messages</Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 