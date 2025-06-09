import { supabase } from './supabaseClient';

export async function createReview({ booking_id, reviewer_id, creative_id, rating, text }: { booking_id: string, reviewer_id: string, creative_id: string, rating: number, text: string }) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ booking_id, reviewer_id, creative_id, rating, text }])
    .select()
    .single();
  return { data, error };
}

export async function getReviewsForCreative(creative_id: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('creative_id', creative_id)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function getAverageRatingForCreative(creative_id: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('creative_id', creative_id);
  if (error) return { average: null, error };
  if (!data || data.length === 0) return { average: null, error: null };
  const average = data.reduce((sum, r) => sum + (r.rating || 0), 0) / data.length;
  return { average, error: null };
} 