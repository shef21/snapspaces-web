import { supabase } from './supabaseClient';

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function upsertProfile(profile: any) {
  // profile should include the id (user id)
  const { data, error } = await supabase
    .from('profiles')
    .upsert([profile], { onConflict: 'id' })
    .select()
    .single();
  return { data, error };
}

export async function getProfileList() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  return { data, error };
}

export function getProfileCompletionStatus(profile: any) {
  const missing: string[] = [];
  if (!profile.name) missing.push('Name');
  if (!profile.bio) missing.push('Bio');
  if (!profile.specialties || profile.specialties.length === 0) missing.push('Specialties');
  if (!profile.location) missing.push('Location');
  if (!profile.photo) missing.push('Profile Photo');
  if (!profile.portfolio || profile.portfolio.filter(Boolean).length === 0) missing.push('Portfolio Images');
  return {
    complete: missing.length === 0,
    missing,
  };
}

// Upload a profile photo to Supabase Storage and return the public URL
export async function uploadProfilePhoto(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const filePath = `profile-photos/${userId}.${fileExt}`;
  // Upload the file
  const { data, error } = await supabase.storage.from('profile-photos').upload(filePath, file, {
    upsert: true,
    cacheControl: '3600',
    contentType: file.type,
  });
  if (error) return { url: null, error };
  // Get the public URL
  const { data: publicUrlData } = supabase.storage.from('profile-photos').getPublicUrl(filePath);
  return { url: publicUrlData?.publicUrl || null, error: null };
}

// Upload multiple portfolio images to Supabase Storage and return an array of public URLs
export async function uploadPortfolioImages(userId: string, files: FileList | File[]) {
  const urls: string[] = [];
  const errors: any[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileExt = file.name.split('.').pop();
    const filePath = `portfolio-images/${userId}-${Date.now()}-${i}.${fileExt}`;
    const { error } = await supabase.storage.from('portfolio-images').upload(filePath, file, {
      upsert: true,
      cacheControl: '3600',
      contentType: file.type,
    });
    if (error) {
      errors.push(error);
      continue;
    }
    const { data: publicUrlData } = supabase.storage.from('portfolio-images').getPublicUrl(filePath);
    if (publicUrlData?.publicUrl) {
      urls.push(publicUrlData.publicUrl);
    }
  }
  return { urls, errors };
} 