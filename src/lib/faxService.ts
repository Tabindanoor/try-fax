
import { Fax, Country, EmailNotification, FaxNumberAssignment } from './types';
import { toast } from 'sonner';
import { getCurrentUser } from './authService';
import { supabase } from '@/integrations/supabase/client';

// Mock data for countries (in a real app, this might come from an API)
export const countries: Country[] = [
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'JP', name: 'Japan', dialCode: '+81' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'BR', name: 'Brazil', dialCode: '+55' },
  { code: 'CN', name: 'China', dialCode: '+86' },
];

// Get all faxes for the current user
export const getFaxes = async (includeIncoming = true): Promise<Fax[]> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return [];
  }
  
  let query = supabase
    .from('faxes')
    .select('*')
    .eq('user_id', currentUser.id);
  
  // Filter out incoming faxes if not requested
  if (!includeIncoming) {
    query = query.eq('is_incoming', false);
  }
  
  const { data, error } = await query.order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching faxes:', error);
    return [];
  }
  
  return data.map(fax => ({
    id: fax.id,
    recipientNumber: fax.recipient_number,
    recipientCountry: fax.recipient_country,
    date: fax.date,
    pages: fax.pages,
    status: fax.status,
    fileName: fax.file_name,
    fileUrl: fax.file_url,
    userId: fax.user_id,
    isIncoming: fax.is_incoming,
    senderNumber: fax.sender_number,
    senderCountry: fax.sender_country,
    read: fax.read
  }));
};

// Get received faxes only
export const getReceivedFaxes = async (): Promise<Fax[]> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('faxes')
    .select('*')
    .eq('user_id', currentUser.id)
    .eq('is_incoming', true)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching received faxes:', error);
    return [];
  }
  
  return data.map(fax => ({
    id: fax.id,
    recipientNumber: fax.recipient_number,
    recipientCountry: fax.recipient_country,
    date: fax.date,
    pages: fax.pages,
    status: fax.status,
    fileName: fax.file_name,
    fileUrl: fax.file_url,
    userId: fax.user_id,
    isIncoming: fax.is_incoming,
    senderNumber: fax.sender_number,
    senderCountry: fax.sender_country,
    read: fax.read
  }));
};

// Get a specific fax by ID
export const getFaxById = async (id: string): Promise<Fax | undefined> => {
  const { data, error } = await supabase
    .from('faxes')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error || !data) {
    console.error('Error fetching fax by ID:', error);
    return undefined;
  }
  
  return {
    id: data.id,
    recipientNumber: data.recipient_number,
    recipientCountry: data.recipient_country,
    date: data.date,
    pages: data.pages,
    status: data.status,
    fileName: data.file_name,
    fileUrl: data.file_url,
    userId: data.user_id,
    isIncoming: data.is_incoming,
    senderNumber: data.sender_number,
    senderCountry: data.sender_country,
    read: data.read
  };
};

// Send a new fax
export const sendFax = async (
  recipientNumber: string,
  recipientCountry: string,
  file: File,
  userId: string
): Promise<Fax> => {
  // Upload file to Supabase Storage
  const filePath = `${userId}/${Date.now()}_${file.name}`;
  
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('fax_documents')
    .upload(filePath, file);
  
  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw new Error('Failed to upload file');
  }
  
  // Get public URL for the file
  const { data: urlData } = supabase
    .storage
    .from('fax_documents')
    .getPublicUrl(filePath);
  
  const fileUrl = urlData.publicUrl;
  
  // Create a new fax entry
  const newFax = {
    user_id: userId,
    recipient_number: recipientNumber,
    recipient_country: recipientCountry,
    date: new Date().toISOString(),
    pages: Math.floor(Math.random() * 5) + 1, // Random 1-5 pages
    status: 'pending',
    file_name: file.name,
    file_url: fileUrl,
    is_incoming: false
  };
  
  const { data, error } = await supabase
    .from('faxes')
    .insert(newFax)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating fax entry:', error);
    throw new Error('Failed to create fax entry');
  }
  
  // Simulate fax sending process
  setTimeout(async () => {
    // 70% chance of success, 30% chance of failure
    const success = Math.random() > 0.3;
    
    const { error: updateError } = await supabase
      .from('faxes')
      .update({ status: success ? 'sent' : 'failed' })
      .eq('id', data.id);
    
    if (updateError) {
      console.error('Error updating fax status:', updateError);
    }
    
    // Create notification
    const notification = {
      user_id: userId,
      fax_id: data.id,
      type: success ? 'sent' : 'failed',
      read: false
    };
    
    await supabase.from('notifications').insert(notification);
    
    // In a real app, we would trigger an email notification here
    console.log(`Fax ${data.id} ${success ? 'sent successfully' : 'failed to send'}`);
  }, 30000); // 30 seconds
  
  return {
    id: data.id,
    recipientNumber: data.recipient_number,
    recipientCountry: data.recipient_country,
    date: data.date,
    pages: data.pages,
    status: data.status,
    fileName: data.file_name,
    fileUrl: data.file_url,
    userId: data.user_id,
    isIncoming: data.is_incoming
  };
};

// Mark a received fax as read
export const markFaxAsRead = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('faxes')
    .update({ read: true })
    .eq('id', id)
    .eq('is_incoming', true);
  
  if (error) {
    console.error('Error marking fax as read:', error);
    return false;
  }
  
  return true;
};

// Format a phone number for display
export const formatPhoneNumber = (number: string, countryCode: string): string => {
  const country = countries.find(c => c.code === countryCode);
  
  if (!country) return number;
  
  // Very basic formatting - in a real app, use a proper phone formatting library
  return `${country.dialCode} ${number}`;
};

// Delete a fax
export const deleteFax = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('faxes')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting fax:', error);
    return false;
  }
  
  return true;
};

// Retry a failed fax
export const retryFax = async (id: string): Promise<Fax> => {
  // First get the fax details
  const { data, error } = await supabase
    .from('faxes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error getting fax:', error);
    throw new Error('Fax not found');
  }
  
  // Update status to pending
  const { data: updatedFax, error: updateError } = await supabase
    .from('faxes')
    .update({
      status: 'pending',
      date: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (updateError) {
    console.error('Error updating fax:', updateError);
    throw new Error('Failed to update fax status');
  }
  
  // Simulate fax sending process
  setTimeout(async () => {
    // 80% chance of success for retry
    const success = Math.random() > 0.2;
    
    const { error: retryError } = await supabase
      .from('faxes')
      .update({ status: success ? 'sent' : 'failed' })
      .eq('id', id);
    
    if (retryError) {
      console.error('Error updating fax status:', retryError);
    }
    
    // Create new notification for retry
    const notification = {
      user_id: data.user_id,
      fax_id: id,
      type: success ? 'sent' : 'failed',
      read: false
    };
    
    await supabase.from('notifications').insert(notification);
  }, 20000); // 20 seconds
  
  return {
    id: updatedFax.id,
    recipientNumber: updatedFax.recipient_number,
    recipientCountry: updatedFax.recipient_country,
    date: updatedFax.date,
    pages: updatedFax.pages,
    status: updatedFax.status,
    fileName: updatedFax.file_name,
    fileUrl: updatedFax.file_url,
    userId: updatedFax.user_id,
    isIncoming: updatedFax.is_incoming,
    senderNumber: updatedFax.sender_number,
    senderCountry: updatedFax.sender_country,
    read: updatedFax.read
  };
};

// Get user's fax number
export const getUserFaxNumber = async (userId: string): Promise<FaxNumberAssignment | undefined> => {
  const { data, error } = await supabase
    .from('fax_numbers')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .maybeSingle();
  
  if (error || !data) {
    console.error('Error getting fax number:', error);
    return undefined;
  }
  
  return {
    id: data.id,
    userId: data.user_id,
    faxNumber: data.fax_number,
    countryCode: data.country_code,
    assignmentDate: data.assignment_date,
    active: data.active
  };
};

// Request a new fax number
export const requestFaxNumber = async (
  userId: string, 
  countryCode: string
): Promise<FaxNumberAssignment> => {
  // Generate a random fax number for the requested country
  let newFaxNumber = '';
  const country = countries.find(c => c.code === countryCode);
  
  if (countryCode === 'US' || countryCode === 'CA') {
    // Format for North American numbers: ###-###-####
    newFaxNumber = `${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 9000) + 1000}`;
  } else {
    // Generic format for international
    newFaxNumber = `${Math.floor(Math.random() * 90000000) + 10000000}`;
  }
  
  // Deactivate any existing numbers for this user
  await supabase
    .from('fax_numbers')
    .update({ active: false })
    .eq('user_id', userId);
  
  // Create new number assignment
  const newAssignment = {
    user_id: userId,
    fax_number: newFaxNumber,
    country_code: countryCode,
    assignment_date: new Date().toISOString(),
    active: true
  };
  
  const { data, error } = await supabase
    .from('fax_numbers')
    .insert(newAssignment)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating fax number:', error);
    throw new Error('Failed to create fax number');
  }
  
  return {
    id: data.id,
    userId: data.user_id,
    faxNumber: data.fax_number,
    countryCode: data.country_code,
    assignmentDate: data.assignment_date,
    active: data.active
  };
};

// Get user's email notifications
export const getUserNotifications = async (userId: string): Promise<EmailNotification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*, faxes(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
  
  return data.map(item => ({
    id: item.id,
    userId: item.user_id,
    faxId: item.fax_id,
    type: item.type,
    sentDate: item.created_at,
    delivered: true
  }));
};

// Get unread fax count
export const getUnreadFaxCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('faxes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_incoming', true)
    .eq('read', false);
  
  if (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
  
  return count || 0;
};

// Simulate receiving a new fax (for demo purposes)
export const simulateIncomingFax = async (userId: string): Promise<Fax> => {
  // First, check if user has a fax number
  const userFaxNumber = await getUserFaxNumber(userId);
  
  if (!userFaxNumber) {
    throw new Error('User does not have an assigned fax number');
  }
  
  // Generate a random sender from a random country
  const senderCountry = countries[Math.floor(Math.random() * countries.length)].code;
  const senderNumber = `${Math.floor(Math.random() * 9000000) + 1000000}`;
  
  // Create a new incoming fax
  const incomingFax = {
    user_id: userId,
    recipient_number: userFaxNumber.faxNumber,
    recipient_country: userFaxNumber.countryCode,
    sender_number: senderNumber,
    sender_country: senderCountry,
    date: new Date().toISOString(),
    pages: Math.floor(Math.random() * 4) + 1, // Random 1-4 pages
    status: 'sent',
    file_name: `incoming_fax_${Date.now()}.pdf`,
    is_incoming: true,
    read: false
  };
  
  const { data, error } = await supabase
    .from('faxes')
    .insert(incomingFax)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating incoming fax:', error);
    throw new Error('Failed to create incoming fax');
  }
  
  // Create notification
  const notification = {
    user_id: userId,
    fax_id: data.id,
    type: 'received',
    read: false
  };
  
  await supabase.from('notifications').insert(notification);
  
  // Show toast notification
  toast.info('New fax received!', {
    description: `You received a ${data.pages}-page fax from ${formatPhoneNumber(senderNumber, senderCountry)}`
  });
  
  return {
    id: data.id,
    recipientNumber: data.recipient_number,
    recipientCountry: data.recipient_country,
    date: data.date,
    pages: data.pages,
    status: data.status,
    fileName: data.file_name,
    userId: data.user_id,
    isIncoming: data.is_incoming,
    senderNumber: data.sender_number,
    senderCountry: data.sender_country,
    read: data.read
  };
};
