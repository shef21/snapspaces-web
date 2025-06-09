import { supabase } from './supabaseClient';

export async function createBooking({ client_id, creative_id, date, message }: { client_id: string, creative_id: string, date: string, message: string }) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([{ client_id, creative_id, date, message, status: 'pending', client_unread: true, creative_unread: true }])
    .select()
    .single();
  return { data, error };
}

export async function getBookingsForUser(userId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .or(`client_id.eq.${userId},creative_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function updateBookingStatus(id: string, status: 'accepted' | 'declined') {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
} 