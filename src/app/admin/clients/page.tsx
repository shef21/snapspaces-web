"use client";
import { useEffect, useState } from "react";
import { getProfileList } from "@/utils/profile";
import { getAds, getAdAnalytics, updateAd } from "@/utils/ads";
import { supabase } from "@/utils/supabaseClient";

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [adAnalytics, setAdAnalytics] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setRefreshing(true);
    const { data: clientList } = await getProfileList();
    setClients(clientList || []);
    const { data: adsData } = await getAds();
    setAds(adsData || []);
    const { data: analyticsData } = await getAdAnalytics();
    setAdAnalytics(analyticsData || []);
    setRefreshing(false);
  }

  function getClientAds(clientId: string) {
    return ads.filter((ad: any) => ad.client_id === clientId);
  }

  function getClientAnalytics(clientId: string) {
    const clientAds = getClientAds(clientId);
    let impressions = 0, clicks = 0, approved = 0, rejected = 0;
    clientAds.forEach((ad: any) => {
      const analytics = adAnalytics.find((a: any) => a.ad_id === ad.id);
      if (analytics) {
        impressions += analytics.impressions;
        clicks += analytics.clicks;
      }
      if (ad.status === "approved") approved++;
      if (ad.status === "rejected") rejected++;
    });
    return { impressions, clicks, approved, rejected, total: clientAds.length };
  }

  async function handleStatusChange(clientId: string, newStatus: string) {
    await supabase.from('profiles').update({ status: newStatus }).eq('id', clientId);
    fetchData();
  }

  function handleViewAds(client: any) {
    setSelectedClient(client);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setSelectedClient(null);
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Client Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-yellow-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border"># Ads</th>
              <th className="p-2 border">Impressions</th>
              <th className="p-2 border">Clicks</th>
              <th className="p-2 border">Approved</th>
              <th className="p-2 border">Rejected</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => {
              const analytics = getClientAnalytics(client.id);
              return (
                <tr key={client.id} className={client.status === 'banned' ? 'bg-red-50 text-red-400' : ''}>
                  <td className="p-2 border">{client.name || client.email}</td>
                  <td className="p-2 border">{client.email}</td>
                  <td className="p-2 border">{client.status || 'active'}</td>
                  <td className="p-2 border text-center">{analytics.total}</td>
                  <td className="p-2 border text-center">{analytics.impressions}</td>
                  <td className="p-2 border text-center">{analytics.clicks}</td>
                  <td className="p-2 border text-center">{analytics.approved}</td>
                  <td className="p-2 border text-center">{analytics.rejected}</td>
                  <td className="p-2 border flex gap-2">
                    <button onClick={() => handleViewAds(client)} className="text-blue-600 hover:underline">View Ads</button>
                    <a href={`mailto:${client.email}`} className="text-yellow-600 hover:underline">Email</a>
                    {client.status !== 'banned' ? (
                      <button onClick={() => handleStatusChange(client.id, 'banned')} className="text-red-600 hover:underline">Ban</button>
                    ) : (
                      <button onClick={() => handleStatusChange(client.id, 'active')} className="text-green-600 hover:underline">Reactivate</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative">
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4">Ads for {selectedClient.name || selectedClient.email}</h2>
            <table className="min-w-full border text-sm mb-4">
              <thead>
                <tr className="bg-yellow-100">
                  <th className="p-2 border">Image</th>
                  <th className="p-2 border">Slot</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Impressions</th>
                  <th className="p-2 border">Clicks</th>
                  <th className="p-2 border">Dates</th>
                </tr>
              </thead>
              <tbody>
                {getClientAds(selectedClient.id).map((ad: any) => {
                  const analytics = adAnalytics.find((a: any) => a.ad_id === ad.id) || { impressions: 0, clicks: 0 };
                  return (
                    <tr key={ad.id}>
                      <td className="p-2 border">{ad.image_url ? <img src={ad.image_url} alt="Ad" className="w-16 h-10 object-cover rounded" /> : '-'}</td>
                      <td className="p-2 border">{ad.ad_slots?.name || '-'}</td>
                      <td className="p-2 border">{ad.status}</td>
                      <td className="p-2 border text-center">{analytics.impressions}</td>
                      <td className="p-2 border text-center">{analytics.clicks}</td>
                      <td className="p-2 border">{ad.start_date} - {ad.end_date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button onClick={handleCloseModal} className="mt-2 px-4 py-2 rounded bg-yellow-300 hover:bg-yellow-400 font-bold">Close</button>
          </div>
        </div>
      )}
      {refreshing && <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-40 flex items-center justify-center z-50"><div className="p-6 bg-white rounded shadow text-lg">Refreshing...</div></div>}
    </div>
  );
} 