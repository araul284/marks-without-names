
import React, { useEffect, useState } from 'react';
import { Artwork } from '../types';
import { storageService } from '../services/storageService';
import { ASCIIArt } from './ASCIIArt';

interface GalleryProps {
  onSelect: (id: string) => void;
  onCreate: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onSelect, onCreate }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    setArtworks(storageService.getArtworks());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 py-20 bg-white">
      {/* Museum Header / Curatorial Note */}
      <header className="mb-24 flex flex-col md:flex-row items-baseline justify-between border-b border-neutral-200 pb-12">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-light tracking-[0.2em] mb-6 text-black opacity-90 uppercase">
            The Anonymous Archive
          </h1>
          <div className="text-neutral-500 text-sm leading-relaxed space-y-4 font-light italic">
            <p>
              A permanent collection of digital impressions. Each piece is a trace of a singular 
              interaction, preserved as an arrangement of symbols. 
            </p>
            <p className="text-[10px] uppercase tracking-widest not-italic opacity-60 text-neutral-400">
              Total Specimens: {artworks.length.toString().padStart(3, '0')}
            </p>
          </div>
        </div>
        <div className="mt-8 md:mt-0">
          <button 
            onClick={onCreate}
            className="group relative border border-neutral-900 px-10 py-4 overflow-hidden transition-all hover:bg-black"
          >
            <span className="relative z-10 text-xs tracking-[0.3em] uppercase text-black group-hover:text-white transition-colors duration-300">
              [ Submit Entry ]
            </span>
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </header>

      {/* Exhibition Space */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-32">
        {artworks.map((art, index) => (
          <article 
            key={art.id} 
            className="group cursor-pointer"
            onClick={() => onSelect(art.id)}
          >
            {/* The Frame */}
            <div className="relative border border-neutral-100 bg-[#fcfcfc] p-12 transition-all duration-700 group-hover:border-neutral-900 group-hover:shadow-[0_15px_60px_rgba(0,0,0,0.05)]">
              <div className="overflow-hidden aspect-[80/40] flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100 transform scale-95 group-hover:scale-100">
                <ASCIIArt grid={art.grid} scale={0.7} className="text-black" />
              </div>
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neutral-200 group-hover:border-neutral-900"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neutral-200 group-hover:border-neutral-900"></div>
            </div>

            {/* The Placard */}
            <div className="mt-6 ml-4 border-l border-neutral-200 pl-6 py-2">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-1">
                Specimen No. {(artworks.length - index).toString().padStart(4, '0')}
              </h3>
              <p className="text-xs text-neutral-900 font-medium tracking-wider mb-2">
                {art.id.substring(0, 8).toUpperCase()} // MONOCHROME ON WHITE
              </p>
              <div className="flex items-center gap-4 text-[9px] text-neutral-400 uppercase tracking-widest">
                <span>Recorded: {new Date(art.createdAt).toLocaleDateString()}</span>
                <span className="opacity-30">|</span>
                <span>Medium: ASCII / TXT</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {artworks.length === 0 && (
        <div className="text-center py-48">
          <p className="text-neutral-300 text-xs uppercase tracking-[0.5em] animate-pulse">
            Waiting for first contribution...
          </p>
        </div>
      )}

      {/* Footer Info */}
      <footer className="mt-40 pt-20 border-t border-neutral-100 text-center">
        <div className="text-[10px] text-neutral-300 uppercase tracking-[1em]">
          End of Collection
        </div>
      </footer>
    </div>
  );
};
