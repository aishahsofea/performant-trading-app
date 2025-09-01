import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { PortfolioSettings, defaultPortfolioSettings } from '@/types/portfolio';

type UsePortfolioSettingsReturn = {
  settings: PortfolioSettings;
  isLoading: boolean;
  error: string | null;
  updateSettings: (data: PortfolioSettings) => Promise<boolean>;
  refetch: () => Promise<void>;
};

export function usePortfolioSettings(): UsePortfolioSettingsReturn {
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<PortfolioSettings>(defaultPortfolioSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    if (status !== 'authenticated' || !session?.user) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await fetch('/api/user/portfolio');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio settings: ${response.status}`);
      }

      const data = await response.json();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching portfolio settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (data: PortfolioSettings): Promise<boolean> => {
    if (!session?.user) {
      setError('Not authenticated');
      return false;
    }

    try {
      setError(null);
      const response = await fetch('/api/user/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update portfolio settings: ${response.status}`);
      }

      // Optimistically update local state
      setSettings(data);
      return true;
    } catch (err) {
      console.error('Error updating portfolio settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      return false;
    }
  };

  const refetch = async () => {
    setIsLoading(true);
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, [status, session?.user?.id]);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    refetch,
  };
}