"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { 
  LayoutConfiguration, 
  UserDashboardPreferences, 
  LayoutResponse,
  SaveLayoutRequest 
} from '@/types/dashboard';

export const useDashboardLayout = () => {
  const { data: session, status } = useSession();
  const [layouts, setLayouts] = useState<LayoutResponse[]>([]);
  const [currentLayout, setCurrentLayout] = useState<LayoutConfiguration | null>(null);
  const [preferences, setPreferences] = useState<UserDashboardPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's dashboard layouts
  const fetchLayouts = useCallback(async () => {
    if (status !== 'authenticated') return;

    try {
      const response = await fetch('/api/dashboard/layouts');
      if (!response.ok) throw new Error('Failed to fetch layouts');
      
      const layoutsData = await response.json();
      setLayouts(layoutsData);
    } catch (err) {
      console.error('Error fetching layouts:', err);
      setError('Failed to load layouts');
    }
  }, [status]);

  // Fetch user preferences
  const fetchPreferences = useCallback(async () => {
    if (status !== 'authenticated') return;

    try {
      const response = await fetch('/api/dashboard/preferences');
      if (!response.ok) throw new Error('Failed to fetch preferences');
      
      const prefsData = await response.json();
      setPreferences(prefsData);
      
      // If there's a current layout, load it
      if (prefsData.currentLayoutId) {
        const currentLayoutData = layouts.find(l => l.id === prefsData.currentLayoutId);
        if (currentLayoutData) {
          setCurrentLayout(currentLayoutData.layout);
        }
      }
    } catch (err) {
      console.error('Error fetching preferences:', err);
      setError('Failed to load preferences');
    }
  }, [status, layouts]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      if (status === 'loading') return;
      if (status === 'unauthenticated') {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        await fetchLayouts();
        await fetchPreferences();
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [status, fetchLayouts, fetchPreferences]);

  // Save new layout
  const saveLayout = useCallback(async (layoutData: SaveLayoutRequest) => {
    try {
      const response = await fetch('/api/dashboard/layouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(layoutData),
      });

      if (!response.ok) throw new Error('Failed to save layout');
      
      // Refresh layouts
      await fetchLayouts();
      return true;
    } catch (err) {
      console.error('Error saving layout:', err);
      setError('Failed to save layout');
      return false;
    }
  }, [fetchLayouts]);

  // Update existing layout
  const updateLayout = useCallback(async (id: string, layoutData: Partial<SaveLayoutRequest>) => {
    try {
      const response = await fetch(`/api/dashboard/layouts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(layoutData),
      });

      if (!response.ok) throw new Error('Failed to update layout');
      
      // Refresh layouts
      await fetchLayouts();
      return true;
    } catch (err) {
      console.error('Error updating layout:', err);
      setError('Failed to update layout');
      return false;
    }
  }, [fetchLayouts]);

  // Delete layout
  const deleteLayout = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/dashboard/layouts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete layout');
      
      // Refresh layouts and preferences
      await fetchLayouts();
      await fetchPreferences();
      return true;
    } catch (err) {
      console.error('Error deleting layout:', err);
      setError('Failed to delete layout');
      return false;
    }
  }, [fetchLayouts, fetchPreferences]);

  // Switch to a different layout
  const switchLayout = useCallback(async (layoutId: string) => {
    try {
      const response = await fetch('/api/dashboard/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentLayoutId: layoutId }),
      });

      if (!response.ok) throw new Error('Failed to switch layout');
      
      // Update local state
      const selectedLayout = layouts.find(l => l.id === layoutId);
      if (selectedLayout) {
        setCurrentLayout(selectedLayout.layout);
        setPreferences(prev => prev ? { ...prev, currentLayoutId: layoutId } : null);
      }
      
      return true;
    } catch (err) {
      console.error('Error switching layout:', err);
      setError('Failed to switch layout');
      return false;
    }
  }, [layouts]);

  // Update preferences
  const updatePreferences = useCallback(async (newPreferences: Partial<UserDashboardPreferences>) => {
    try {
      const response = await fetch('/api/dashboard/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPreferences),
      });

      if (!response.ok) throw new Error('Failed to update preferences');
      
      // Update local state
      setPreferences(prev => prev ? { ...prev, ...newPreferences } : null);
      return true;
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError('Failed to update preferences');
      return false;
    }
  }, []);

  // Auto-save current layout
  const autoSaveLayout = useCallback(async (layout: LayoutConfiguration) => {
    if (!preferences?.autoSave || !preferences?.currentLayoutId) return;

    try {
      await updateLayout(preferences.currentLayoutId, { layout });
      setCurrentLayout(layout);
    } catch (err) {
      console.error('Error auto-saving layout:', err);
    }
  }, [preferences, updateLayout]);

  return {
    // Data
    layouts,
    currentLayout,
    preferences,
    isLoading,
    error,
    
    // Actions
    saveLayout,
    updateLayout,
    deleteLayout,
    switchLayout,
    updatePreferences,
    autoSaveLayout,
    
    // Utilities
    refreshLayouts: fetchLayouts,
    clearError: () => setError(null),
  };
};