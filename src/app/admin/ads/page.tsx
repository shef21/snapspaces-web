"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { getProfile } from "@/utils/profile";

export default function AdminAdsDashboard() {
  const user = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setLoading(false);
        setIsAdmin(false);
        return;
      }
      const { data: profile } = await getProfile(user.id);
      if (profile && profile.is_admin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    }
    checkAdmin();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-red-600 text-xl font-bold">
        403 Forbidden: You do not have access to this page.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Paid Ad Space Dashboard</h1>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow">
        <p className="text-lg text-gray-700">Welcome, Admin! This is your dashboard to manage paid ad spaces. (UI coming soon)</p>
      </div>
    </div>
  );
} 