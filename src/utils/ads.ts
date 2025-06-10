import { supabase } from './supabaseClient';

export type AdSlot = {
  id?: string;
  name: string;
  description?: string;
  price: number;
  is_active?: boolean;
};

export type Ad = {
  id?: string;
  slot_id: string;
  client_id: string;
  image_url?: string;
  link_url?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  ad_slots?: AdSlot;
  profiles?: { name?: string; email?: string };
};

export type AdAnalytics = {
  id?: string;
  ad_id: string;
  impressions: number;
  clicks: number;
  last_updated?: string;
};

// Ad Slots
export async function getAdSlots() {
  return await supabase.from('ad_slots').select('*').order('name');
}

export async function createAdSlot(slot: AdSlot) {
  return await supabase.from('ad_slots').insert([slot]).select().single();
}

export async function updateAdSlot(id: string, updates: Partial<AdSlot>) {
  return await supabase.from('ad_slots').update(updates).eq('id', id).select().single();
}

export async function deleteAdSlot(id: string) {
  return await supabase.from('ad_slots').delete().eq('id', id);
}

// Ads
export async function getAds() {
  return await supabase.from('ads').select('*, ad_slots(*), profiles(*)').order('created_at', { ascending: false });
}

export async function createAd(ad: Ad) {
  return await supabase.from('ads').insert([ad]).select().single();
}

export async function updateAd(id: string, updates: Partial<Ad>) {
  return await supabase.from('ads').update(updates).eq('id', id).select().single();
}

export async function deleteAd(id: string) {
  return await supabase.from('ads').delete().eq('id', id);
}

export async function uploadAdImage(adId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const filePath = `ad-images/${adId}-${Date.now()}.${fileExt}`;
  // Upload the file
  const { data, error } = await supabase.storage.from('ad-images').upload(filePath, file, {
    upsert: true,
    cacheControl: '3600',
    contentType: file.type,
  });
  if (error) return { url: null, error };
  // Get the public URL
  const { data: publicUrlData } = supabase.storage.from('ad-images').getPublicUrl(filePath);
  return { url: publicUrlData?.publicUrl || null, error: null };
}

export async function getAdAnalytics() {
  return await supabase.from('ad_analytics').select('*');
}

export async function incrementAdImpression(ad_id: string) {
  // Upsert: increment impressions by 1
  const { data, error } = await supabase.rpc('increment_ad_impression', { ad_id_param: ad_id });
  return { data, error };
}

export async function incrementAdClick(ad_id: string) {
  // Upsert: increment clicks by 1
  const { data, error } = await supabase.rpc('increment_ad_click', { ad_id_param: ad_id });
  return { data, error };
}

export async function getActiveHomepageAd() {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('ads')
    .select('*, ad_slots(*), profiles(*)')
    .eq('status', 'approved')
    .lte('start_date', today)
    .gte('end_date', today)
    .limit(10);
  if (error || !data || data.length === 0) return { ad: null, error };
  // Pick a random ad from the results
  const ad = data[Math.floor(Math.random() * data.length)];
  return { ad, error: null };
}

export async function expirePastAds() {
  const today = new Date().toISOString().slice(0, 10);
  return await supabase
    .from('ads')
    .update({ status: 'expired' })
    .lt('end_date', today)
    .not('status', 'eq', 'expired');
} 