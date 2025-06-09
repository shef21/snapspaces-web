'use client';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'next/navigation';
import { getBookingsForUser, updateBookingStatus } from '../../utils/booking';
import { getProfile } from '../../utils/profile';
import { createReview } from '../../utils/review';
import { supabase } from '../../utils/supabaseClient';

export default function BookingsPage() {
  const user = useUser();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<{[id: string]: any}>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState<{ [key: string]: { rating: number; text: string } }>({});
  const [reviewLoading, setReviewLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (user === null) return;
    if (!user) router.replace('/signin');
  }, [user, router]);

  useEffect(() => {
    async function fetchBookings() {
      if (!user) return;
      setLoading(true);
      const { data } = await getBookingsForUser(user.id);
      setBookings(data || []);
      setLoading(false);
      // Fetch profiles for all involved users
      const ids = Array.from(new Set((data || []).flatMap((b: any) => [b.client_id, b.creative_id])));
      const profilesObj: {[id: string]: any} = {};
      await Promise.all(ids.map(async id => {
        const { data: p } = await getProfile(id);
        if (p) profilesObj[id] = p;
      }));
      setProfiles(profilesObj);
      // Mark bookings as read for this user
      if (data && data.length > 0) {
        const updates = [];
        for (const b of data) {
          if (b.client_id === user.id && b.client_unread) {
            updates.push(supabase.from('bookings').update({ client_unread: false }).eq('id', b.id));
          }
          if (b.creative_id === user.id && b.creative_unread) {
            updates.push(supabase.from('bookings').update({ creative_unread: false }).eq('id', b.id));
          }
        }
        await Promise.all(updates);
      }
    }
    if (user) fetchBookings();
  }, [user]);

  async function handleStatus(id: string, status: 'accepted' | 'declined') {
    setActionLoading(id + status);
    await updateBookingStatus(id, status);
    // Refresh bookings
    if (user) {
      const { data } = await getBookingsForUser(user.id);
      setBookings(data || []);
    }
    setActionLoading(null);
  }

  async function handleReviewSubmit(bookingId: string) {
    if (!user) return;
    setReviewLoading({ ...reviewLoading, [bookingId]: true });
    const review = reviewForm[bookingId];
    const { error } = await createReview({
      booking_id: bookingId,
      reviewer_id: user.id,
      creative_id: bookings.find(b => b.id === bookingId)?.creative_id || '',
      rating: review.rating,
      text: review.text
    });
    setReviewLoading({ ...reviewLoading, [bookingId]: false });
    if (!error) {
      setReviewForm({ ...reviewForm, [bookingId]: { rating: 0, text: '' } });
    }
  }

  if (user === null || !user) return null;

  return (
    <div className="min-h-screen bg-[#F6F5F3] font-league-spartan flex flex-col items-center py-10">
      <main className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6">
        <h1 className="text-2xl font-extrabold text-[#171717] mb-6 text-center">My Bookings</h1>
        {loading ? (
          <div className="text-[#171717]/60 text-center py-12">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-[#171717]/40 text-center py-12">No bookings yet.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {bookings.map(b => {
              const isCreative = b.creative_id === user.id;
              const otherProfile = profiles[isCreative ? b.client_id : b.creative_id];
              return (
                <div key={b.id} className="bg-[#F6F5F3] rounded-2xl shadow p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between border border-[#E5E3E3]">
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-1">
                      <img src={otherProfile?.photo_url || '/default-profile.png'} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-yellow-300 shadow" />
                      <span className="font-semibold text-[#171717]">{otherProfile?.name || 'User'}</span>
                      <span className="text-xs text-[#171717]/60">{isCreative ? 'Client' : 'Creative'}</span>
                    </div>
                    <div className="text-[#171717]/80 text-sm">Date: <span className="font-semibold">{b.date}</span></div>
                    {b.message && <div className="text-[#171717]/70 text-xs">Message: {b.message}</div>}
                    <div className="text-xs mt-1">Status: <span className={`font-bold ${b.status === 'pending' ? 'text-yellow-600' : b.status === 'accepted' ? 'text-green-700' : 'text-red-600'}`}>{b.status}</span></div>
                  </div>
                  {isCreative && b.status === 'pending' && (
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button onClick={() => handleStatus(b.id, 'accepted')} disabled={actionLoading === b.id + 'accepted'} className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold shadow border border-green-400 transition text-sm focus:outline-none focus:ring-2 focus:ring-green-400 active:scale-95" aria-label="Accept booking">{actionLoading === b.id + 'accepted' ? 'Accepting...' : 'Accept'}</button>
                      <button onClick={() => handleStatus(b.id, 'declined')} disabled={actionLoading === b.id + 'declined'} className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold shadow border border-red-400 transition text-sm focus:outline-none focus:ring-2 focus:ring-red-400 active:scale-95" aria-label="Decline booking">{actionLoading === b.id + 'declined' ? 'Declining...' : 'Decline'}</button>
                    </div>
                  )}
                  {!isCreative && b.status === 'accepted' && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-[#171717] mb-2">Leave a Review</h3>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => setReviewForm({ ...reviewForm, [b.id]: { ...reviewForm[b.id], rating: star } })}
                              className={`text-2xl ${reviewForm[b.id]?.rating >= star ? 'text-yellow-400' : 'text-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-400 active:scale-95`}
                              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={reviewForm[b.id]?.text || ''}
                          onChange={e => setReviewForm({ ...reviewForm, [b.id]: { ...reviewForm[b.id], text: e.target.value } })}
                          placeholder="Write your review..."
                          className="w-full px-4 py-2 rounded border border-[#E5E3E3] bg-[#F6F5F3] text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300"
                          rows={3}
                        />
                        <button
                          onClick={() => handleReviewSubmit(b.id)}
                          disabled={reviewLoading[b.id]}
                          className="px-4 py-2 rounded-full bg-yellow-300 hover:bg-yellow-400 text-[#171717] font-semibold shadow border border-yellow-300 transition text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 active:scale-95"
                          aria-label="Submit review"
                        >
                          {reviewLoading[b.id] ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
} 