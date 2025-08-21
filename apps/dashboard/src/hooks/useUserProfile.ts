import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type ProfileData = {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio: string;
  timezone: string;
  avatarUrl?: string;
};

type UseUserProfileReturn = {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: Partial<ProfileData>) => Promise<boolean>;
  refetch: () => Promise<void>;
};

export function useUserProfile(): UseUserProfileReturn {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (status !== 'authenticated' || !session?.user) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<ProfileData>): Promise<boolean> => {
    if (!session?.user) {
      setError('Not authenticated');
      return false;
    }

    try {
      setError(null);
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      // Optimistically update local state
      setProfile(prev => prev ? { ...prev, ...data } : null);
      return true;
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return false;
    }
  };

  const refetch = async () => {
    setIsLoading(true);
    await fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, [status, session?.user?.id]);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetch,
  };
}