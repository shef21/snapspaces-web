import { supabase } from './supabase';

export async function createConversation(user1: string, user2: string) {
  // Always store user1 < user2 for uniqueness
  const [a, b] = [user1, user2].sort();
  const { data, error } = await supabase
    .from('conversations')
    .upsert([{ user1: a, user2: b }], { onConflict: 'user1,user2' })
    .select()
    .single();
  return { data, error };
}

export async function getConversationsForUser(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`user1.eq.${userId},user2.eq.${userId}`)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function sendMessage(conversationId: string, sender: string, content: string) {
  // Insert message and set unread for the recipient
  const { data: message, error } = await supabase
    .from('messages')
    .insert([{ conversation_id: conversationId, sender, content, unread: true }])
    .select()
    .single();
  return { data: message, error };
}

export async function getMessagesForConversation(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  return { data, error };
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
  // Mark all messages not sent by user as read
  const { error } = await supabase
    .from('messages')
    .update({ unread: false })
    .eq('conversation_id', conversationId)
    .neq('sender', userId)
    .eq('unread', true);
  return { error };
}

export async function getUnreadMessageCount(userId: string) {
  // Count unread messages for user across all conversations
  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, sender, unread')
    .eq('unread', true);
  if (error) return { count: 0, error };
  // Filter messages where user is a participant but not the sender
  let count = 0;
  if (data) {
    for (const m of data) {
      const { data: convo } = await supabase
        .from('conversations')
        .select('user1, user2')
        .eq('id', m.conversation_id)
        .single();
      if (convo && (convo.user1 === userId || convo.user2 === userId) && m.sender !== userId) {
        count++;
      }
    }
  }
  return { count, error: null };
} 