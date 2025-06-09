"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "../../../context/UserContext";
import { getMessagesForConversation, sendMessage, markMessagesAsRead } from "../../../utils/message";
import { getProfile } from "../../../utils/profile";

export default function ConversationPage() {
  const { id } = useParams();
  const user = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [otherProfile, setOtherProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user === null) return;
    if (!user) router.replace("/signin");
  }, [user, router]);

  useEffect(() => {
    let interval: any;
    async function fetchMessages() {
      if (!id || !user) return;
      setLoading(true);
      const { data } = await getMessagesForConversation(id as string);
      setMessages(data || []);
      setLoading(false);
      // Mark as read
      await markMessagesAsRead(id as string, user.id);
    }
    fetchMessages();
    interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [id, user]);

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    async function fetchOtherProfile() {
      if (!user || !id) return;
      // Find the other user in the conversation
      const { data } = await getMessagesForConversation(id as string);
      if (data && data.length > 0) {
        const otherId = data.find((m: any) => m.sender !== user.id)?.sender;
        if (otherId) {
          const { data: p } = await getProfile(otherId);
          setOtherProfile(p);
        }
      }
    }
    fetchOtherProfile();
  }, [user, id]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user) return;
    await sendMessage(id as string, user.id, input.trim());
    setInput("");
    // Refetch messages
    const { data } = await getMessagesForConversation(id as string);
    setMessages(data || []);
  }

  if (user === null || !user) return null;

  return (
    <div className="min-h-screen bg-[#F6F5F3] font-league-spartan flex flex-col items-center py-10">
      <main className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 flex flex-col h-[70vh]">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.back()} className="px-3 py-2 rounded-full bg-yellow-300 hover:bg-yellow-400 text-[#171717] font-semibold shadow border border-yellow-300 transition focus:outline-none focus:ring-2 focus:ring-yellow-400">Back</button>
          <img src={otherProfile?.photo || '/default-profile.png'} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-yellow-300 shadow" />
          <div className="font-semibold text-[#171717]">{otherProfile?.name || 'User'}</div>
        </div>
        <div className="flex-1 overflow-y-auto bg-[#F6F5F3] rounded-xl p-4 mb-4">
          {loading ? (
            <div className="text-[#171717]/60 text-center py-12">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-[#171717]/40 text-center py-12">No messages yet.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-2xl shadow text-base ${m.sender === user.id ? 'bg-yellow-300 text-[#171717]' : 'bg-white text-[#171717]/90 border border-[#E5E3E3]'}`}>{m.content}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <form onSubmit={handleSend} className="flex gap-2 mt-auto">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-full border border-[#E5E3E3] bg-[#F6F5F3] text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300 text-base shadow"
            placeholder="Type a message..."
            aria-label="Type a message"
            autoComplete="off"
          />
          <button type="submit" className="px-6 py-3 rounded-full bg-yellow-300 hover:bg-yellow-400 text-[#171717] font-semibold shadow border border-yellow-300 transition focus:outline-none focus:ring-2 focus:ring-yellow-400" aria-label="Send message">Send</button>
        </form>
      </main>
    </div>
  );
} 