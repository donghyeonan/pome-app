'use client';

import { useState, useEffect, useCallback } from 'react';
import { SavedItem } from '@/types';

interface UseSavedItemsReturn {
  savedItems: SavedItem[];
  saveItem: (itemType: 'clinic' | 'treatment', itemId: string) => Promise<void>;
  unsaveItem: (itemId: string) => Promise<void>;
  isSaved: (itemId: string) => boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for managing saved items (treatments and clinics)
 * Uses real API endpoints with authentication
 */
export function useSavedItems(userId?: string): UseSavedItemsReturn {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch saved items from API on mount
  useEffect(() => {
    const fetchSavedItems = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/saved');
        
        if (!response.ok) {
          if (response.status === 401) {
            // User not authenticated, clear items
            setSavedItems([]);
            setIsLoading(false);
            return;
          }
          throw new Error('Failed to fetch saved items');
        }

        const data = await response.json();
        const items: SavedItem[] = data.savedItems.map((item: any) => ({
          ...item,
          savedAt: new Date(item.savedAt),
        }));
        setSavedItems(items);
      } catch (err) {
        console.error('Failed to load saved items:', err);
        setError('Failed to load saved items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedItems();
  }, [userId]);

  /**
   * Save an item (treatment or clinic)
   */
  const saveItem = useCallback(
    async (itemType: 'clinic' | 'treatment', itemId: string) => {
      // Check if already saved
      const alreadySaved = savedItems.some((item) => item.itemId === itemId);
      if (alreadySaved) {
        return;
      }

      try {
        const response = await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemType, itemId }),
        });

        if (!response.ok) {
          throw new Error('Failed to save item');
        }

        const data = await response.json();
        const newItem: SavedItem = {
          ...data.savedItem,
          savedAt: new Date(data.savedItem.savedAt),
        };

        setSavedItems((prev) => [...prev, newItem]);
        setError(null);
      } catch (err) {
        console.error('Failed to save item:', err);
        setError('Failed to save item');
      }
    },
    [savedItems]
  );

  /**
   * Remove a saved item by itemId
   */
  const unsaveItem = useCallback(
    async (itemId: string) => {
      // Find the saved item to get its ID
      const savedItem = savedItems.find((item) => item.itemId === itemId);
      if (!savedItem) {
        return;
      }

      // Optimistically update UI
      setSavedItems((prev) => prev.filter((item) => item.itemId !== itemId));

      try {
        const response = await fetch(`/api/saved/${savedItem.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to unsave item');
        }

        setError(null);
      } catch (err) {
        console.error('Failed to unsave item:', err);
        setError('Failed to unsave item');
        // Revert optimistic update on error
        setSavedItems((prev) => [...prev, savedItem]);
      }
    },
    [savedItems]
  );

  /**
   * Check if an item is saved
   */
  const isSaved = useCallback(
    (itemId: string) => {
      return savedItems.some((item) => item.itemId === itemId);
    },
    [savedItems]
  );

  return {
    savedItems,
    saveItem,
    unsaveItem,
    isSaved,
    isLoading,
    error,
  };
}
