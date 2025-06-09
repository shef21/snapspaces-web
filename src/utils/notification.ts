import { supabase } from './supabaseClient';

export async function sendBookingNotification(booking: any, creative: any, client: any) {
  const { data, error } = await supabase.functions.invoke('booking-notification', {
    body: { booking, creative, client }
  });
  return { data, error };
} 