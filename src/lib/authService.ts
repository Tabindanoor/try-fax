
import { User, NotificationPreferences } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  // Check for a session in localStorage or memory
  return !!localStorage.getItem('sb-bmeqyeqzmwkavscvxaph-auth-token');
};

// Login user
export const loginUser = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (!data.user) {
    throw new Error('No user returned from authentication');
  }
  
  // Fetch user profile from our profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
    
  if (profileError) {
    console.error('Error fetching profile:', profileError);
  }

  // Fetch user's fax number if exists
  const { data: faxNumberData } = await supabase
    .from('fax_numbers')
    .select('*')
    .eq('user_id', data.user.id)
    .eq('active', true)
    .maybeSingle();
  
  const userData: User = {
    id: data.user.id,
    email: data.user.email || '',
    name: profileData?.name || data.user.email?.split('@')[0] || '',
    notificationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
      instantNotifications: true
    },
    faxNumber: faxNumberData?.fax_number || ''
  };
  
  return userData;
};

// Register new user
export const registerUser = async (email: string, password: string, name: string): Promise<User> => {
  // Register with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (!data.user) {
    throw new Error('No user returned from registration');
  }
  
  // Default notification preferences
  const notificationPreferences: NotificationPreferences = {
    emailNotifications: true,
    smsNotifications: false,
    instantNotifications: true
  };
  
  // Return user data
  return {
    id: data.user.id,
    email: data.user.email || '',
    name,
    notificationPreferences,
    faxNumber: ''
  };
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  await supabase.auth.signOut();
  localStorage.removeItem('faxo_user');
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  // Check if we have current session
  const { data: sessionData } = await supabase.auth.getSession();
  
  if (!sessionData.session) {
    return null;
  }
  
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    return null;
  }
  
  // Fetch user profile from our profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userData.user.id)
    .single();
    
  if (profileError) {
    console.error('Error fetching profile:', profileError);
  }
  
  // Fetch user's fax number if exists
  const { data: faxNumberData } = await supabase
    .from('fax_numbers')
    .select('*')
    .eq('user_id', userData.user.id)
    .eq('active', true)
    .maybeSingle();
  
  return {
    id: userData.user.id,
    email: userData.user.email || '',
    name: profileData?.name || userData.user.email?.split('@')[0] || '',
    notificationPreferences: {
      emailNotifications: true, 
      smsNotifications: false,
      instantNotifications: true
    },
    faxNumber: faxNumberData?.fax_number || ''
  };
};

// Create a synchronous version for components that can't use async
export const getCurrentUserSync = (): User | null => {
  // Try to get from localStorage or memory cache
  const storedUser = localStorage.getItem('faxo_user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error('Error parsing stored user:', e);
    }
  }
  return null;
};

// Update current user in localStorage after login/update
export const updateCurrentUserInStorage = (user: User): void => {
  localStorage.setItem('faxo_user', JSON.stringify(user));
};

// Update user notification preferences
export const updateNotificationPreferences = async (
  userId: string, 
  preferences: NotificationPreferences
): Promise<User> => {
  // In a real implementation, we would store these preferences in the database
  // For now, we'll just return the updated user data
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    throw new Error('User not found');
  }
  
  return {
    ...currentUser,
    notificationPreferences: preferences
  };
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  updates: { name?: string; email?: string }
): Promise<User> => {
  // Update profile in database
  if (updates.name) {
    const { error } = await supabase
      .from('profiles')
      .update({ name: updates.name })
      .eq('id', userId);
      
    if (error) {
      throw new Error(`Error updating profile: ${error.message}`);
    }
  }
  
  // Update email in auth if needed
  if (updates.email) {
    const { error } = await supabase.auth.updateUser({
      email: updates.email
    });
    
    if (error) {
      throw new Error(`Error updating email: ${error.message}`);
    }
  }
  
  // Return updated user
  const updatedUser = await getCurrentUser();
  if (!updatedUser) {
    throw new Error('Failed to get updated user data');
  }
  
  return updatedUser;
};
