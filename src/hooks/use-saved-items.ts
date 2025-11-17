'use client';

import { useState, useEffect, useCallback } from 'react';
import { SavedItem } from '@/types';

interface UseSavedItemsReturn {
  savedItems: SavedItem[];
  saveItem: (itemType: 'clinic' | 'treatment', itemId: string) => void;
  unsaveItem: (itemId: string) => void;
  isSaved: (itemId: string) => boolean;
  isLoading: boolean;
}

const STORAGE_KEY = 'pome_saved_items';

/**
 * Hook for managing saved items (treatments and clinics)
 * Uses localStorage for persistence in Phase 1
 */
export function useSavedItems(userId?: string): UseSavedItemsReturn {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved items from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Array<
          Omit<SavedItem, 'savedAt'> & { savedAt: string }
        >;
        // Convert savedAt strings back to Date objects
        const items: SavedItem[] = parsed.map((item) => ({
          ...item,
          savedAt: new Date(item.savedAt),
        }));
        setSavedItems(items);
      }
    } catch (error) {
      console.error('Failed to load saved items:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever savedItems changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
      } catch (error) {
        console.error('Failed to save items to localStorage:', error);
      }
    }
  }, [savedItems, isLoading]);

  /**
   * Save an item (treatment or clinic)
   */
  const saveItem = useCallback(
    (itemType: 'clinic' | 'treatment', itemId: string) => {
      // Check if already saved
      const alreadySaved = savedItems.some((item) => item.itemId === itemId);
      if (alreadySaved) {
        return;
      }

      const newItem: SavedItem = {
        id: `saved_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: userId || 'mock_user',
        itemType,
        itemId,
        savedAt: new Date(),
      };

      setSavedItems((prev) => [...prev, newItem]);
    },
    [savedItems, userId]
  );

  /**
   * Remove a saved item by itemId
   */
  const unsaveItem = useCallback((itemId: string) => {
    setSavedItems((prev) => prev.filter((item) => item.itemId !== itemId));
  }, []);

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
  };
}
