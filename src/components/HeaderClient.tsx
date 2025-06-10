'use client';
import React from 'react';
import Link from "next/link";
import { useUser } from '../context/UserContext';
import { signOut } from '../utils/auth';
import { useEffect, useState } from 'react';
import { getProfile } from '../utils/profile';
import { getBookingsForUser } from '../utils/booking';
import { getUnreadMessageCount } from '../utils/message';

export default function HeaderClient() {
  const user = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [hasUnreadBookings, setHasUnreadBookings] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const { data } = await getProfile(user.id);
        setProfile(data);
      } else {
        setProfile(null);
      }
    }
    fetchProfile();
  }, [user]);

  useEffect(() => {
    async function checkUnread() {
      if (user) {
        const { data } = await getBookingsForUser(user.id);
        if (data && data.length > 0) {
          setHasUnreadBookings(
            data.some(
              b => (b.client_id === user.id && b.client_unread) || (b.creative_id === user.id && b.creative_unread)
            )
          );
        } else {
          setHasUnreadBookings(false);
        }
        // Check unread messages
        const { count } = await getUnreadMessageCount(user.id);
        setHasUnreadMessages(count > 0);
      } else {
        setHasUnreadBookings(false);
        setHasUnreadMessages(false);
      }
    }
    checkUnread();
  }, [user]);

  return (
    <header className="sticky top-0 z-30 w-full bg-yellow-300 backdrop-blur border-b border-yellow-300 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3 relative">
        <Link href="/" className="text-3xl sm:text-4xl font-extrabold font-league-spartan tracking-tight text-white text-lift leading-none focus:outline-none focus:ring-2 focus:ring-yellow-400 lift-effect">SnapSpaces</Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center text-base font-medium">
          <Link href="/about" className="hover:underline underline-offset-4 text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-400 transition">About</Link>
          <Link href="/explore" className="hover:underline underline-offset-4 text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-400 transition">Explore</Link>
          {user && (
            <Link href="/bookings" className="hover:underline underline-offset-4 text-[#171717] relative focus:outline-none focus:ring-2 focus:ring-yellow-400 transition">
              Bookings
              {hasUnreadBookings && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">•</span>
              )}
            </Link>
          )}
          {user && (
            <Link href="/messages" className="hover:underline underline-offset-4 text-[#171717] relative focus:outline-none focus:ring-2 focus:ring-yellow-400 transition">
              Messages
              {hasUnreadMessages && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">•</span>
              )}
            </Link>
          )}
          <Link href="/pricing" className="hover:underline underline-offset-4 text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-400 transition">Pricing</Link>
          {user && profile && profile.is_admin && (
            <Link href="/admin/ads" className="hover:underline underline-offset-4 text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-400 transition">Admin Dashboard</Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              {profile && (
                <Link href="/profile/edit" className="flex items-center gap-2 hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <img src={profile.photo || '/default-profile.png'} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-yellow-300 shadow" />
                  <span className="font-semibold text-[#171717] text-sm max-w-[120px] truncate">{profile.name || user.email}</span>
                </Link>
              )}
              <Link href="/profile" className="px-5 py-2 rounded-full border border-yellow-300 bg-yellow-50 text-[#171717] hover:bg-yellow-100 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 font-semibold">Profile</Link>
              <button
                onClick={async () => { await signOut(); window.location.reload(); }}
                className="ml-2 px-5 py-2 rounded-full border border-[#171717] bg-[#171717] text-white hover:bg-[#333] transition focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/signin" className="ml-2 px-5 py-2 rounded-full border border-[#171717] bg-[#171717] text-white hover:bg-[#333] transition focus:outline-none focus:ring-2 focus:ring-yellow-400">Sign In</Link>
          )}
        </div>
        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-[#CBC8C8] bg-[#CBC8C8] text-[#171717] hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(v => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          {mobileMenuOpen ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-yellow-300 border-b border-yellow-300 shadow-lg flex flex-col gap-2 py-4 z-40 animate-fade-in">
            <Link href="/about" className="px-6 py-3 text-[#171717] hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition">About</Link>
            <Link href="/explore" className="px-6 py-3 text-[#171717] hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition">Explore</Link>
            {user && (
              <Link href="/bookings" className="px-6 py-3 text-[#171717] hover:bg-yellow-200 relative focus:outline-none focus:ring-2 focus:ring-yellow-400 transition">
                Bookings
                {hasUnreadBookings && (
                  <span className="absolute top-2 right-6 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">•</span>
                )}
              </Link>
            )}
            {user && (
              <Link href="/messages" className="px-6 py-3 text-[#171717] hover:bg-yellow-200 relative focus:outline-none focus:ring-2 focus:ring-yellow-400 transition">
                Messages
                {hasUnreadMessages && (
                  <span className="absolute top-2 right-6 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">•</span>
                )}
              </Link>
            )}
            <Link href="/pricing" className="px-6 py-3 text-[#171717] hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition">Pricing</Link>
            {user && profile && profile.is_admin && (
              <Link href="/admin/ads" className="px-6 py-3 text-[#171717] hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition">Admin Dashboard</Link>
            )}
            {user ? (
              <>
                {profile && (
                  <Link href="/profile/edit" className="flex items-center gap-2 px-6 py-3 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                    <img src={profile.photo || '/default-profile.png'} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-yellow-300 shadow" />
                    <span className="font-semibold text-[#171717] text-sm max-w-[120px] truncate">{profile.name || user.email}</span>
                  </Link>
                )}
                <Link href="/profile" className="px-6 py-3 text-[#171717] hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400">Profile</Link>
                <button
                  onClick={async () => { await signOut(); window.location.reload(); }}
                  className="w-full px-6 py-3 rounded-full border border-[#171717] bg-[#171717] text-white hover:bg-[#333] transition focus:outline-none focus:ring-2 focus:ring-yellow-400 mt-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/signin" className="w-full px-6 py-3 rounded-full border border-[#171717] bg-[#171717] text-white hover:bg-[#333] transition focus:outline-none focus:ring-2 focus:ring-yellow-400 mt-2">Sign In</Link>
            )}
          </div>
        )}
      </nav>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease;
        }
        .lift-effect {
          transition: transform 0.18s cubic-bezier(0.4,0,0.2,1), box-shadow 0.18s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
        }
        .lift-effect:hover, .lift-effect:focus {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 8px 24px 0 rgba(0,0,0,0.18);
        }
      `}</style>
    </header>
  );
} 