import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TradingPreferences, defaultTradingPreferences } from "@/types/profile";

type UseTradingPreferencesReturn = {
  preferences: TradingPreferences;
  isLoading: boolean;
  error: string | null;
  updatePreferences: (data: TradingPreferences) => Promise<boolean>;
  refetch: () => Promise<void>;
};

export function useTradingPreferences(): UseTradingPreferencesReturn {
  const { data: session, status } = useSession();
  const [preferences, setPreferences] = useState<TradingPreferences>(
    defaultTradingPreferences
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = async () => {
    if (status !== "authenticated" || !session?.user) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await fetch("/api/user/preferences");

      if (!response.ok) {
        throw new Error(`Failed to fetch preferences: ${response.status}`);
      }

      const data = await response.json();
      setPreferences(data);
    } catch (err) {
      console.error("Error fetching trading preferences:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load preferences"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (
    data: TradingPreferences
  ): Promise<boolean> => {
    // if (!session?.user) {
    //   setError('Not authenticated');
    //   return false;
    // }

    try {
      setError(null);
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update preferences: ${response.status}`);
      }

      // Optimistically update local state
      setPreferences(data);
      return true;
    } catch (err) {
      console.error("Error updating trading preferences:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update preferences"
      );
      return false;
    }
  };

  const refetch = async () => {
    setIsLoading(true);
    await fetchPreferences();
  };

  useEffect(() => {
    fetchPreferences();
  }, [status, session?.user?.id]);

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    refetch,
  };
}
