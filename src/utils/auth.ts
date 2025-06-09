import { supabase } from './supabaseClient';

// Sign up
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

// Sign in
export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

// Sign out
export async function signOut() {
  return supabase.auth.signOut();
}

// Get current user/session
export function getUser() {
  return supabase.auth.getUser();
} 