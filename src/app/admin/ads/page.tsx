"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { getProfile } from "@/utils/profile";
import {
  getAdSlots,
  createAdSlot,
  updateAdSlot,
  deleteAdSlot,
  getAds,
  createAd,
  updateAd,
  deleteAd,
  uploadAdImage,
  getAdAnalytics,
  expirePastAds,
  AdSlot,
  Ad,
  AdAnalytics
} from "@/utils/ads";

export default function AdminAdsDashboard() {
  const user = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [slotForm, setSlotForm] = useState<Partial<AdSlot>>({ name: "", description: "", price: 0 });
  const [slotFormMode, setSlotFormMode] = useState<"add" | "edit">("add");
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [adForm, setAdForm] = useState<Partial<Ad>>({ slot_id: "", client_id: "", link_url: "", start_date: "", end_date: "" });
  const [adImageFile, setAdImageFile] = useState<File | null>(null);
  const [adFormMode, setAdFormMode] = useState<"add" | "edit">("add");
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [adAnalytics, setAdAnalytics] = useState<AdAnalytics[]>([]);

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

  useEffect(() => {
    async function handleExpireAndFetch() {
      if (isAdmin) {
        await expirePastAds();
        fetchData();
      }
    }
    handleExpireAndFetch();
    // eslint-disable-next-line
  }, [isAdmin]);

  async function fetchData() {
    setRefreshing(true);
    const { data: slots } = await getAdSlots();
    setAdSlots(slots || []);
    const { data: adsData } = await getAds();
    setAds(adsData || []);
    const { data: analyticsData } = await getAdAnalytics();
    setAdAnalytics(analyticsData || []);
    setRefreshing(false);
  }

  function handleSlotFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setSlotForm({ ...slotForm, [e.target.name]: e.target.value });
  }

  async function handleSlotFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (slotFormMode === "add") {
      await createAdSlot({
        name: slotForm.name || "",
        description: slotForm.description || "",
        price: Number(slotForm.price) || 0,
        is_active: true,
      });
    } else if (slotFormMode === "edit" && editingSlotId) {
      await updateAdSlot(editingSlotId, {
        name: slotForm.name,
        description: slotForm.description,
        price: Number(slotForm.price),
      });
    }
    setSlotForm({ name: "", description: "", price: 0 });
    setSlotFormMode("add");
    setEditingSlotId(null);
    fetchData();
  }

  function handleEditSlot(slot: AdSlot) {
    setSlotForm({ name: slot.name, description: slot.description, price: slot.price });
    setSlotFormMode("edit");
    setEditingSlotId(slot.id || null);
  }

  async function handleDeactivateSlot(id: string) {
    await updateAdSlot(id, { is_active: false });
    fetchData();
  }

  async function handleDeleteSlot(id: string) {
    await deleteAdSlot(id);
    fetchData();
  }

  function handleAdFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setAdForm({ ...adForm, [e.target.name]: e.target.value });
  }

  function handleAdImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setAdImageFile(e.target.files[0]);
    }
  }

  async function handleAdFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    let imageUrl = adForm.image_url || "";
    if (adImageFile) {
      const { url } = await uploadAdImage(editingAdId || "new", adImageFile);
      if (url) imageUrl = url;
    }
    if (adFormMode === "add") {
      await createAd({
        slot_id: adForm.slot_id!,
        client_id: adForm.client_id!,
        link_url: adForm.link_url,
        image_url: imageUrl,
        start_date: adForm.start_date,
        end_date: adForm.end_date,
        status: "pending"
      });
    } else if (adFormMode === "edit" && editingAdId) {
      await updateAd(editingAdId, {
        slot_id: adForm.slot_id!,
        client_id: adForm.client_id!,
        link_url: adForm.link_url,
        image_url: imageUrl,
        start_date: adForm.start_date,
        end_date: adForm.end_date,
      });
    }
    setAdForm({ slot_id: "", client_id: "", link_url: "", start_date: "", end_date: "" });
    setAdImageFile(null);
    setAdFormMode("add");
    setEditingAdId(null);
    fetchData();
  }

  function handleEditAd(ad: Ad) {
    setAdForm({
      slot_id: ad.slot_id,
      client_id: ad.client_id,
      link_url: ad.link_url,
      image_url: ad.image_url,
      start_date: ad.start_date,
      end_date: ad.end_date,
    });
    setAdFormMode("edit");
    setEditingAdId(ad.id || null);
  }

  async function handleApproveAd(id: string) {
    await updateAd(id, { status: "approved" });
    fetchData();
  }

  async function handleRejectAd(id: string) {
    await updateAd(id, { status: "rejected" });
    fetchData();
  }

  async function handleDeleteAd(id: string) {
    await deleteAd(id);
    fetchData();
  }

  function getAnalyticsForAd(adId: string) {
    return adAnalytics.find(a => a.ad_id === adId) || { impressions: 0, clicks: 0 };
  }

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
    <div className="w-full min-h-screen bg-[#F6F5F3] flex justify-center">
      <div className="w-full max-w-6xl p-4 sm:p-8 flex flex-col gap-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-[#171717] tracking-tight text-center drop-shadow-lg">Paid Ad Space Dashboard</h1>
        {/* Ad Slots Section */}
        <section className="mb-2 bg-white rounded-3xl shadow-xl border border-yellow-200 p-6 sm:p-10 flex flex-col gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-yellow-600 flex items-center gap-2"><span className="inline-block w-3 h-3 bg-yellow-300 rounded-full"></span> Ad Slots</h2>
          <form onSubmit={handleSlotFormSubmit} className="flex flex-col md:flex-row gap-4 mb-4 items-end">
            <input
              type="text"
              name="name"
              placeholder="Slot Name"
              value={slotForm.name}
              onChange={handleSlotFormChange}
              className="border border-yellow-200 p-3 rounded-xl w-48 focus:ring-2 focus:ring-yellow-300 shadow-sm"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={slotForm.price}
              onChange={handleSlotFormChange}
              className="border border-yellow-200 p-3 rounded-xl w-32 focus:ring-2 focus:ring-yellow-300 shadow-sm"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={slotForm.description}
              onChange={handleSlotFormChange}
              className="border border-yellow-200 p-3 rounded-xl w-64 focus:ring-2 focus:ring-yellow-300 shadow-sm"
            />
            <button type="submit" className="bg-yellow-400 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition text-[#171717] shadow-lg border border-yellow-300">
              {slotFormMode === "add" ? "Add Slot" : "Update Slot"}
            </button>
            {slotFormMode === "edit" && (
              <button type="button" onClick={() => { setSlotFormMode("add"); setSlotForm({ name: "", description: "", price: 0 }); setEditingSlotId(null); }} className="ml-2 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#171717] font-semibold border border-gray-200 shadow">Cancel</button>
            )}
          </form>
          <div className="overflow-x-auto rounded-2xl border border-yellow-100 bg-yellow-50 text-[#171717] shadow-sm">
            <table className="min-w-full text-sm rounded-2xl">
              <thead>
                <tr className="bg-yellow-100 text-[#171717]">
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Active</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adSlots.map(slot => (
                  <tr key={slot.id} className={slot.is_active ? "hover:bg-yellow-100/60 transition" : "bg-gray-100 text-gray-400"}>
                    <td className="p-4 font-semibold">{slot.name}</td>
                    <td className="p-4">{slot.description}</td>
                    <td className="p-4">R{slot.price}</td>
                    <td className="p-4 text-center">{slot.is_active ? <span className="inline-block px-2 py-1 rounded-full bg-yellow-200 text-yellow-800 text-xs font-bold">Yes</span> : <span className="inline-block px-2 py-1 rounded-full bg-gray-200 text-gray-500 text-xs font-bold">No</span>}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleEditSlot(slot)} className="text-blue-600 hover:underline font-semibold">Edit</button>
                      {slot.is_active && <button onClick={() => handleDeactivateSlot(slot.id!)} className="text-yellow-600 hover:underline font-semibold">Deactivate</button>}
                      <button onClick={() => handleDeleteSlot(slot.id!)} className="text-red-600 hover:underline font-semibold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* Create/Edit Ad Section */}
        <section className="mb-2 bg-white rounded-3xl shadow-xl border border-yellow-200 p-6 sm:p-10 flex flex-col gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-yellow-600 flex items-center gap-2"><span className="inline-block w-3 h-3 bg-yellow-300 rounded-full"></span> Create / Edit Ad</h2>
          <form onSubmit={handleAdFormSubmit} className="flex flex-col md:flex-row gap-4 mb-4 items-end">
            <select
              name="slot_id"
              value={adForm.slot_id}
              onChange={handleAdFormChange}
              className="border border-yellow-200 p-3 rounded-xl w-48 focus:ring-2 focus:ring-yellow-300 shadow-sm"
              required
            >
              <option value="">Select Slot</option>
              {adSlots.map(slot => (
                <option key={slot.id} value={slot.id}>{slot.name}</option>
              ))}
            </select>
            <input
              type="text"
              name="client_id"
              placeholder="Client User ID"
              value={adForm.client_id}
              onChange={handleAdFormChange}
              className="border border-yellow-200 p-3 rounded-xl w-48 focus:ring-2 focus:ring-yellow-300 shadow-sm"
              required
            />
            <input
              type="text"
              name="link_url"
              placeholder="Ad Link URL"
              value={adForm.link_url}
              onChange={handleAdFormChange}
              className="border border-yellow-200 p-3 rounded-xl w-64 focus:ring-2 focus:ring-yellow-300 shadow-sm"
            />
            <input
              type="date"
              name="start_date"
              value={adForm.start_date}
              onChange={handleAdFormChange}
              className="border border-yellow-200 p-3 rounded-xl w-40 focus:ring-2 focus:ring-yellow-300 shadow-sm"
            />
            <input
              type="date"
              name="end_date"
              value={adForm.end_date}
              onChange={handleAdFormChange}
              className="border border-yellow-200 p-3 rounded-xl w-40 focus:ring-2 focus:ring-yellow-300 shadow-sm"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleAdImageChange}
              className="border border-yellow-200 p-3 rounded-xl w-64 focus:ring-2 focus:ring-yellow-300 shadow-sm"
            />
            <button type="submit" className="bg-yellow-400 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition text-[#171717] shadow-lg border border-yellow-300">
              {adFormMode === "add" ? "Create Ad" : "Update Ad"}
            </button>
            {adFormMode === "edit" && (
              <button type="button" onClick={() => { setAdFormMode("add"); setAdForm({ slot_id: "", client_id: "", link_url: "", start_date: "", end_date: "" }); setAdImageFile(null); setEditingAdId(null); }} className="ml-2 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#171717] font-semibold border border-gray-200 shadow">Cancel</button>
            )}
          </form>
        </section>
        {/* Ads Table Section */}
        <section className="bg-white rounded-3xl shadow-xl border border-yellow-200 p-6 sm:p-10 flex flex-col gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-yellow-600 flex items-center gap-2"><span className="inline-block w-3 h-3 bg-yellow-300 rounded-full"></span> Ads</h2>
          <div className="overflow-x-auto rounded-2xl border border-yellow-100 bg-yellow-50 text-[#171717] shadow-sm">
            <table className="min-w-full text-sm rounded-2xl">
              <thead>
                <tr className="bg-yellow-100 text-[#171717]">
                  <th className="p-4 font-semibold">Image</th>
                  <th className="p-4 font-semibold">Link</th>
                  <th className="p-4 font-semibold">Slot</th>
                  <th className="p-4 font-semibold">Client</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Dates</th>
                  <th className="p-4 font-semibold">Impressions</th>
                  <th className="p-4 font-semibold">Clicks</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ads.map(ad => (
                  <tr key={ad.id} className="hover:bg-yellow-100/60 transition rounded-xl">
                    <td className="p-4">{ad.image_url ? <img src={ad.image_url} alt="Ad" className="w-24 h-12 object-cover rounded-xl border border-yellow-200 shadow" /> : "-"}</td>
                    <td className="p-4">{ad.link_url ? <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{ad.link_url}</a> : "-"}</td>
                    <td className="p-4">{ad.ad_slots?.name || "-"}</td>
                    <td className="p-4">{ad.profiles?.name || ad.profiles?.email || "-"}</td>
                    <td className="p-4">{ad.status}</td>
                    <td className="p-4">{ad.start_date} - {ad.end_date}</td>
                    <td className="p-4 text-center">{getAnalyticsForAd(ad.id!).impressions}</td>
                    <td className="p-4 text-center">{getAnalyticsForAd(ad.id!).clicks}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleEditAd(ad)} className="text-blue-600 hover:underline font-semibold">Edit</button>
                      {ad.status === "pending" && <button onClick={() => handleApproveAd(ad.id!)} className="text-green-600 hover:underline font-semibold">Approve</button>}
                      {ad.status === "pending" && <button onClick={() => handleRejectAd(ad.id!)} className="text-yellow-600 hover:underline font-semibold">Reject</button>}
                      <button onClick={() => handleDeleteAd(ad.id!)} className="text-red-600 hover:underline font-semibold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {refreshing && <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-40 flex items-center justify-center z-50"><div className="p-6 bg-white rounded shadow text-lg">Refreshing...</div></div>}
      </div>
    </div>
  );
} 