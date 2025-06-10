'use client';
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
    <header className="bg-yellow-300 p-4">
      <h1 className="text-2xl font-bold text-[#171717]">SnapSpaces</h1>
    </header>
  );
} 