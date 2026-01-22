
import React, { useState, useEffect } from 'react';
import { ViewState, Artwork } from './types';
import { Gallery } from './components/Gallery';
import { Canvas } from './components/Canvas';
import { ArtworkViewer } from './components/ArtworkViewer';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('gallery');
  const [selectedArtId, setSelectedArtId] = useState<string | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    setArtworks(storageService.getArtworks());
  }, [view]);

  const currentArtIndex = selectedArtId ? artworks.findIndex(a => a.id === selectedArtId) : -1;
  const currentArt = selectedArtId ? artworks[currentArtIndex] : null;

  const handleNext = () => {
    if (currentArtIndex < artworks.length - 1) {
      setSelectedArtId(artworks[currentArtIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentArtIndex > 0) {
      setSelectedArtId(artworks[currentArtIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen relative z-10 bg-white">
      {view === 'gallery' && (
        <Gallery 
          onSelect={(id) => {
            setSelectedArtId(id);
            setView('viewer');
          }}
          onCreate={() => setView('editor')}
        />
      )}

      {view === 'editor' && (
        <Canvas 
          onCancel={() => setView('gallery')}
          onPublish={() => setView('gallery')}
        />
      )}

      {view === 'viewer' && currentArt && (
        <ArtworkViewer 
          artwork={currentArt}
          onBack={() => setView('gallery')}
          onNext={currentArtIndex < artworks.length - 1 ? handleNext : undefined}
          onPrev={currentArtIndex > 0 ? handlePrev : undefined}
        />
      )}

      {/* Persistent Overlay Elements for that terminal feel */}
      <div className="fixed bottom-4 left-4 text-[8px] text-neutral-300 pointer-events-none uppercase tracking-tighter">
        ASCII-CANVAS-v1.0.0 // PERSISTENCE: LOCAL_STORAGE // MONOCHROME: TRUE
      </div>
    </div>
  );
};

export default App;
