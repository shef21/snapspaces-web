'use client';
import React from 'react';
import Link from "next/link";
import { useUser } from '../context/UserContext';
import { signOut } from '../utils/auth';
import { useEffect, useState } from 'react';
import { getProfile } from '../utils/profile';
import { getBookingsForUser } from '../utils/booking';
import { getUnreadMessageCount } from '../utils/message';
import Image from "next/image";
import Head from 'next/head';

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
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
      </Head>
      <header className="sticky top-0 z-30 w-full backdrop-blur border-b shadow-sm" style={{ background: 'var(--color-primary-accent)', borderColor: 'var(--color-primary-accent)' }}>
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3 relative">
          <Link href="/" className="flex items-center focus:outline-none" aria-label="SnapSpaces Home">
            <span className="font-dreamlife" style={{ fontSize: '3rem', color: 'var(--color-text-contrast)', textShadow: '2px 2px 0 #fffbe6', position: 'relative', top: '6px' }}>
              SnapSpaces
            </span>
          </Link>
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center text-base font-medium">
            <Link href="/about" className="hover:underline underline-offset-4 text-[var(--color-text-contrast)] focus:outline-none transition" style={{ outlineColor: 'var(--color-primary-accent)' }}>About</Link>
            <Link href="/explore" className="hover:underline underline-offset-4 text-[var(--color-text-contrast)] focus:outline-none transition" style={{ outlineColor: 'var(--color-primary-accent)' }}>Explore</Link>
            {user && (
              <Link href="/bookings" className="hover:underline underline-offset-4 text-[var(--color-text-contrast)] relative focus:outline-none transition" style={{ outlineColor: 'var(--color-primary-accent)' }}>
                Bookings
                {hasUnreadBookings && (
                  <span className="absolute -top-2 -right-3 bg-[var(--color-playful-tertiary)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">•</span>
                )}
              </Link>
            )}
            {user && (
              <Link href="/messages" className="hover:underline underline-offset-4 text-[var(--color-text-contrast)] relative focus:outline-none transition" style={{ outlineColor: 'var(--color-primary-accent)' }}>
                Messages
                {hasUnreadMessages && (
                  <span className="absolute -top-2 -right-3 bg-[var(--color-playful-tertiary)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">•</span>
                )}
              </Link>
            )}
            <Link href="/pricing" className="hover:underline underline-offset-4 text-[var(--color-text-contrast)] focus:outline-none transition" style={{ outlineColor: 'var(--color-primary-accent)' }}>Pricing</Link>
            {user && profile && profile.is_admin && (
              <>
                <Link href="/admin/ads" className="hover:underline underline-offset-4 text-[var(--color-text-contrast)] focus:outline-none transition" style={{ outlineColor: 'var(--color-primary-accent)' }}>Admin Dashboard</Link>
                <Link href="/admin/clients" className="hover:underline underline-offset-4 text-[var(--color-text-contrast)] focus:outline-none transition" style={{ outlineColor: 'var(--color-primary-accent)' }}>Admin Clients</Link>
              </>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                {profile && (
                  <Link href="/profile/edit" className="flex items-center gap-2 hover:underline focus:outline-none" style={{ outlineColor: 'var(--color-primary-accent)' }}>
                    <img src={profile.photo || '/default-profile.png'} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 shadow" style={{ borderColor: 'var(--color-secondary-accent)' }} />
                    <span className="font-semibold text-[var(--color-text-contrast)] text-sm max-w-[120px] truncate">{profile.name || user.email}</span>
                  </Link>
                )}
                <Link href="/profile" className="px-5 py-2 rounded-full border bg-[var(--color-background-warm)] text-[var(--color-text-contrast)] hover:bg-yellow-100 transition focus:outline-none font-semibold" style={{ borderColor: 'var(--color-primary-accent)', outlineColor: 'var(--color-primary-accent)' }}>Profile</Link>
                <button
                  onClick={async () => { await signOut(); window.location.reload(); }}
                  className="ml-2 px-5 py-2 rounded-full border bg-[var(--color-text-contrast)] text-[var(--color-background-warm)] hover:bg-[#333] transition focus:outline-none"
                  style={{ borderColor: 'var(--color-text-contrast)', outlineColor: 'var(--color-primary-accent)' }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/signin" className="ml-2 px-5 py-2 rounded-full border" style={{ background: 'var(--color-background-warm)', color: 'var(--color-text-contrast)', borderColor: 'var(--color-text-contrast)', outlineColor: 'var(--color-primary-accent)' }}>Sign In</Link>
            )}
          </div>
          {/* Mobile Nav Toggle */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border bg-[var(--color-background-warm)] text-[var(--color-text-contrast)] hover:opacity-80 focus:outline-none transition"
            style={{ borderColor: 'var(--color-background-warm)', outlineColor: 'var(--color-primary-accent)' }}
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
            <div className="absolute top-full left-0 w-full border-b shadow-lg flex flex-col gap-2 py-4 z-40 animate-fade-in" style={{ background: 'var(--color-primary-accent)', borderColor: 'var(--color-primary-accent)' }}>
              <Link href="/about" className="px-6 py-3 text-[var(--color-text-contrast)] hover:bg-yellow-100 focus:outline-none transition" style={{ outlineColor: 'var(--color-primary-accent)' }}>About</Link>
              <Link href="/explore" className="px-6 py-3 text-[var(--color-text-contrast)] hover:bg-yellow-100 focus:outline-none transition" style={{ outlineColor: 'var(--color-primary-accent)' }}>Explore</Link>
              {user && (
                <Link href="/bookings" className="px-6 py-3 text-[var(--color-text-contrast)] hover:bg-yellow-100 relative focus:outline-none transition" style={{ outlineColor: 'var(--color-primary-accent)' }}>
                  Bookings
                  {hasUnreadBookings && (
                    <span className="absolute top-2 right-6 bg-[var(--color-playful-tertiary)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">•</span>
                  )}
                </Link>
              )}
              {user && (
                <Link href="/messages" className="px-6 py-3 text-[var(--color-text-contrast)] hover:bg-yellow-100 relative focus:outline-none transition" style={{ outlineColor: 'var(--color-primary-accent)' }}>
                  Messages
                  {hasUnreadMessages && (
                    <span className="absolute top-2 right-6 bg-[var(--color-playful-tertiary)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">•</span>
                  )}
                </Link>
              )}
              <Link href="/pricing" className="px-6 py-3 text-[var(--color-text-contrast)] hover:bg-yellow-100 focus:outline-none transition" style={{ outlineColor: 'var(--color-primary-accent)' }}>Pricing</Link>
              {user && profile && profile.is_admin && (
                <>
                  <Link href="/admin/ads" className="px-6 py-3 text-[var(--color-text-contrast)] hover:bg-yellow-100 focus:outline-none transition" style={{ outlineColor: 'var(--color-primary-accent)' }}>Admin Dashboard</Link>
                  <Link href="/admin/clients" className="px-6 py-3 text-[var(--color-text-contrast)] hover:bg-yellow-100 focus:outline-none transition" style={{ outlineColor: 'var(--color-primary-accent)' }}>Admin Clients</Link>
                </>
              )}
              {user ? (
                <>
                  {profile && (
                    <Link href="/profile/edit" className="flex items-center gap-2 px-6 py-3 hover:bg-yellow-100 focus:outline-none" style={{ outlineColor: 'var(--color-primary-accent)' }}>
                      <img src={profile.photo || '/default-profile.png'} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 shadow" style={{ borderColor: 'var(--color-secondary-accent)' }} />
                      <span className="font-semibold text-[var(--color-text-contrast)] text-sm max-w-[120px] truncate">{profile.name || user.email}</span>
                    </Link>
                  )}
                  <Link href="/profile" className="px-6 py-3 text-[var(--color-text-contrast)] hover:bg-yellow-100 focus:outline-none" style={{ outlineColor: 'var(--color-primary-accent)' }}>Profile</Link>
                  <button
                    onClick={async () => { await signOut(); window.location.reload(); }}
                    className="w-full px-6 py-3 rounded-full border bg-[var(--color-text-contrast)] text-[var(--color-background-warm)] hover:bg-[#333] transition focus:outline-none mt-2"
                    style={{ borderColor: 'var(--color-text-contrast)', outlineColor: 'var(--color-primary-accent)' }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/signin" className="w-full px-6 py-3 rounded-full border mt-2" style={{ background: 'var(--color-background-warm)', color: 'var(--color-text-contrast)', borderColor: 'var(--color-text-contrast)', outlineColor: 'var(--color-primary-accent)' }}>Sign In</Link>
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
    </>
  );
} 