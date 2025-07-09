"use client";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getConversationsForUser } from "../../utils/message";
import { getProfile } from "../../utils/profile";
import { supabase } from '../../utils/supabase';

export default function MessagesPage() {
  const user = useUser();
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<{ [id: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) return;
    if (!user) router.replace("/signin");
  }, [user, router]);

  useEffect(() => {
    async function fetchConvos() {
      if (!user) return;
      setLoading(true);
      try {
        const { data } = await getConversationsForUser(user.id);
        setConversations(data || []);
        // Fetch profiles for the other user in each conversation
        const ids = Array.from(new Set((data || []).map((c) => c.user1 === user.id ? c.user2 : c.user1)));
        const profilesObj = {};
        await Promise.all(ids.map(async id => {
          const { data: p } = await getProfile(id);
          if (p) profilesObj[id] = p;
        }));
        setProfiles(profilesObj);
      } catch (err) {
        // Optionally set an error state here
      }
      setLoading(false);
    }
    if (user) fetchConvos();
  }, [user]);

  if (user === null || !user) return null;

  return (
    <div className="min-h-screen bg-[#F6F5F3] font-league-spartan flex flex-col items-center py-10">
      <main className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6">
        <h1 className="text-2xl font-extrabold text-[#171717] mb-6 text-center">Messages</h1>
        {loading ? (
          <div className="text-[#171717]/60 text-center py-12">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="text-[#171717]/40 text-center py-12">No conversations yet.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {conversations.map(c => {
              const otherId = c.user1 === user.id ? c.user2 : c.user1;
              const otherProfile = profiles[otherId];
              return (
                <Link key={c.id} href={`/messages/${c.id}`} className="flex items-center gap-4 p-4 rounded-xl bg-[#F6F5F3] border border-[#E5E3E3] shadow hover:bg-yellow-50 transition">
                  <img src={otherProfile?.photo || '/default-profile.png'} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-yellow-300 shadow" />
                  <div className="flex-1">
                    <div className="font-semibold text-[#171717]">{otherProfile?.name || 'User'}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
} 