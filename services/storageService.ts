
import { Artwork, GridData } from '../types';
import { INITIAL_ARTWORKS } from '../constants';

const STORAGE_KEY = 'ascii_canvas_artworks';

// Robust ID generation for non-secure contexts
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // Fallback
    }
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const storageService = {
  getArtworks: (): Artwork[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ARTWORKS));
        return INITIAL_ARTWORKS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load artworks', e);
      return INITIAL_ARTWORKS;
    }
  },

  saveArtwork: (grid: GridData): Artwork => {
    const artworks = storageService.getArtworks();
    const newArtwork: Artwork = {
      id: generateId(),
      grid,
      createdAt: Date.now()
    };
    
    try {
      const updated = [newArtwork, ...artworks];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save artwork to localStorage', e);
      // Even if save fails, we return the object so the UI can proceed
    }
    
    return newArtwork;
  },

  getArtworkById: (id: string): Artwork | undefined => {
    const artworks = storageService.getArtworks();
    return artworks.find(a => a.id === id);
  }
};
