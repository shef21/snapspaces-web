'use client';
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import Link from "next/link";
import Tooltip from '../../../components/Tooltip';
import { getProfile } from '../../../utils/profile';
import { createBooking } from '../../../utils/booking';
import { useUser } from '../../../context/UserContext';
import { getReviewsForCreative, getAverageRatingForCreative } from '../../../utils/review';
import { sendBookingNotification } from '../../../utils/notification';
import { createConversation, getConversationsForUser } from '../../../utils/message';

export default function CreatorProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const user = useUser();
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [messageLoading, setMessageLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      if (!id) return;
      const { data, error } = await getProfile(id as string);
      if (data) {
        setProfile(data);
        const { data: reviewsData } = await getReviewsForCreative(id as string);
        setReviews(reviewsData || []);
        const { average } = await getAverageRatingForCreative(id as string);
        setAverageRating(average);
      } else setNotFound(true);
      setLoading(false);
    }
    fetchProfile();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#171717]/60 font-league-spartan">Loading profile...</div>;
  }
  if (notFound || !profile) {
    return <div className="min-h-screen flex items-center justify-center text-[#171717]/60 font-league-spartan">Profile not found.</div>;
  }

  const p = profile;
  return (
    <div className="min-h-screen bg-[#F6F5F3] font-league-spartan flex flex-col items-center">
      <main className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl mt-10 mb-10 overflow-hidden px-0">
        {/* Profile Header */}
        <section className="px-4 sm:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 border-b border-[#E5E3E3]">
          <img src={p.photo || '/default-profile.png'} alt={p.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-yellow-300 shadow-lg" />
          <div className="flex-1 flex flex-col items-center md:items-start">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] mb-1">{p.name || 'Unnamed'}</h1>
            <div className="text-base sm:text-lg text-yellow-600 font-semibold mb-1">{(p.specialties || []).join(', ')}</div>
            <div className="text-[#171717]/70 mb-3">{p.location}</div>
            {/* Stats can be added here if available */}
            <Tooltip text="Book this creative for your project">
              <button 
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-yellow-300 hover:bg-yellow-400 text-[#171717] font-semibold shadow border border-yellow-300 transition text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
                aria-label={`Book ${p.name}`}
                onClick={() => setShowBooking(true)}
                disabled={!user}
              >
                Book {p.name?.split(' ')[0] || 'Creative'}
              </button>
            </Tooltip>
            <Tooltip text="Send a message to this creative">
              <button
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#171717] hover:bg-[#333] text-white font-semibold shadow border border-[#171717] transition text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 mt-2"
                aria-label={`Message ${p.name}`}
                disabled={!user || messageLoading}
                onClick={async () => {
                  if (!user) return;
                  setMessageLoading(true);
                  const { data: convo, error } = await createConversation(user.id, p.id);
                  setMessageLoading(false);
                  if (convo && convo.id) {
                    window.location.href = `/messages/${convo.id}`;
                  }
                }}
              >
                {messageLoading ? 'Loading...' : `Message ${p.name?.split(' ')[0] || 'Creative'}`}
              </button>
            </Tooltip>
          </div>
        </section>

        {/* Bio/About */}
        <section className="px-4 sm:px-8 py-6 sm:py-8 border-b border-[#E5E3E3] text-center md:text-left">
          <h2 className="text-xl font-bold text-[#171717] mb-2">About</h2>
          <p className="text-[#171717]/80 max-w-2xl mx-auto">{p.bio || <span className='text-[#171717]/40'>No bio provided.</span>}</p>
        </section>

        {/* Portfolio */}
        <section className="px-4 sm:px-8 py-6 sm:py-8 border-b border-[#E5E3E3]">
          <h2 className="text-xl font-bold text-[#171717] mb-4">Portfolio</h2>
          {(p.portfolio && p.portfolio.length > 0 && p.portfolio.some((url: string) => !!url)) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {p.portfolio.filter(Boolean).map((img: string, idx: number) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt={`Portfolio work ${idx + 1}`} 
                  className="w-full h-40 sm:h-48 object-cover rounded-2xl shadow hover:shadow-lg transition-shadow"
                />
              ))}
            </div>
          ) : (
            <div className="text-[#171717]/40 text-center py-8">No portfolio images yet.</div>
          )}
        </section>

        {/* Reviews/Testimonials */}
        <section className="px-4 sm:px-8 py-6 sm:py-8 border-b border-[#E5E3E3]">
          <h2 className="text-xl font-bold text-[#171717] mb-4">Reviews</h2>
          {averageRating !== null && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl text-yellow-400">★</span>
              <span className="text-lg font-semibold text-[#171717]">{averageRating.toFixed(1)}</span>
              <span className="text-[#171717]/60">({reviews.length} reviews)</span>
            </div>
          )}
          {reviews.length === 0 ? (
            <div className="text-[#171717]/40 text-center py-8">No reviews yet.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-[#F6F5F3] rounded-2xl shadow p-4 border border-[#E5E3E3]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                    <span className="text-[#171717]/60 text-sm">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[#171717]/80">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-2xl text-[#171717]/40 hover:text-[#171717]" onClick={() => setShowBooking(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-[#171717]">Book {p.name || 'this creative'}</h2>
            {bookingSuccess ? (
              <div className="text-green-700 font-semibold text-center py-8">Booking request sent!</div>
            ) : (
              <form onSubmit={async e => {
                e.preventDefault();
                setBookingLoading(true);
                setBookingError('');
                if (!user) {
                  setBookingError('You must be signed in to book.');
                  setBookingLoading(false);
                  return;
                }
                if (!bookingDate) {
                  setBookingError('Please select a date.');
                  setBookingLoading(false);
                  return;
                }
                const { error } = await createBooking({
                  client_id: user.id,
                  creative_id: id as string,
                  date: bookingDate,
                  message: bookingMessage
                });
                if (error) {
                  setBookingError('Failed to create booking. Please try again.');
                } else {
                  // Send notifications
                  const { error: notificationError } = await sendBookingNotification(
                    { date: bookingDate, message: bookingMessage },
                    profile,
                    { id: user.id, email: user.email, full_name: user.user_metadata?.full_name }
                  );
                  if (notificationError) {
                    console.error('Failed to send notification:', notificationError);
                  }
                  setBookingSuccess(true);
                  setTimeout(() => {
                    setShowBooking(false);
                    setBookingSuccess(false);
                    setBookingDate('');
                    setBookingMessage('');
                  }, 2000);
                }
              }} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                  <span className="font-medium text-[#171717]">Date</span>
                  <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="px-4 py-2 rounded border border-[#E5E3E3] bg-[#F6F5F3] text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300" required />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-medium text-[#171717]">Message (optional)</span>
                  <textarea value={bookingMessage} onChange={e => setBookingMessage(e.target.value)} rows={3} className="px-4 py-2 rounded border border-[#E5E3E3] bg-[#F6F5F3] text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-300" placeholder="Tell them about your project..." />
                </label>
                {bookingError && <div className="text-red-600 text-sm font-semibold text-center">{bookingError}</div>}
                <button type="submit" className="w-full px-6 py-3 rounded-full bg-yellow-300 hover:bg-yellow-400 text-[#171717] font-semibold shadow border border-yellow-300 transition text-lg mt-2 flex items-center justify-center" disabled={bookingLoading}>
                  {bookingLoading ? 'Sending...' : 'Send Booking Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 