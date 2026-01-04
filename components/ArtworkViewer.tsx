
import React from 'react';
import { Artwork } from '../types';
import { ASCIIArt } from './ASCIIArt';

interface ArtworkViewerProps {
  artwork: Artwork;
  onBack: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const ArtworkViewer: React.FC<ArtworkViewerProps> = ({ artwork, onBack, onNext, onPrev }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-12 bg-black">
      <div className="fixed top-12 left-12">
        <button 
          onClick={onBack} 
          className="group flex items-center gap-4 text-[10px] text-neutral-500 hover:text-white uppercase tracking-[0.4em] transition-all"
        >
          <span className="opacity-30 group-hover:opacity-100 transition-opacity">←</span>
          Return to Archive
        </button>
      </div>

      <div className="flex flex-col items-center gap-12 max-w-full">
        {/* Museum Frame in Viewer */}
        <div className="relative border border-neutral-800 bg-[#050505] p-20 shadow-[0_0_100px_rgba(255,255,255,0.02)]">
          <div className="max-w-full overflow-hidden">
            <ASCIIArt grid={artwork.grid} scale={1.2} />
          </div>
          
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neutral-700"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neutral-700"></div>
        </div>

        {/* Catalog Navigation */}
        <div className="flex items-center gap-16">
          <button 
            onClick={onPrev} 
            disabled={!onPrev}
            className="text-[10px] text-neutral-600 hover:text-white disabled:opacity-0 transition-all uppercase tracking-[0.3em]"
          >
            Previous Specimen
          </button>
          
          <div className="w-1 h-1 rounded-full bg-neutral-800"></div>
          
          <button 
            onClick={onNext} 
            disabled={!onNext}
            className="text-[10px] text-neutral-600 hover:text-white disabled:opacity-0 transition-all uppercase tracking-[0.3em]"
          >
            Next Specimen
          </button>
        </div>

        {/* Piece Details Placard */}
        <div className="text-center space-y-3 opacity-60">
          <div className="text-[9px] uppercase tracking-[0.5em] text-neutral-400">
            Internal Record: {artwork.id.split('-')[0].toUpperCase()}
          </div>
          <div className="text-[9px] text-neutral-700 uppercase tracking-[0.3em]">
            Time Stamp: {new Date(artwork.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
