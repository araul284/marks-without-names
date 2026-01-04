
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GRID_WIDTH, GRID_HEIGHT, MAX_DENSITY, CHAR_MAP } from '../constants';
import { ASCIIArt } from './ASCIIArt';
import { storageService } from '../services/storageService';
import { GridData } from '../types';

interface CanvasProps {
  onCancel: () => void;
  onPublish: () => void;
}

export const Canvas: React.FC<CanvasProps> = ({ onCancel, onPublish }) => {
  const gridRef = useRef<GridData>(
    Array(GRID_HEIGHT).fill(0).map(() => Array(GRID_WIDTH).fill(0))
  );
  
  const [gridState, setGridState] = useState<GridData>(gridRef.current);
  const [history, setHistory] = useState<GridData[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const lastCoords = useRef<{ x: number, y: number } | null>(null);
  const artRef = useRef<HTMLPreElement>(null);

  const syncState = useCallback(() => {
    setGridState(gridRef.current.map(row => [...row]));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, isPublishing]);

  const setCellValue = (x: number, y: number, increment: number = 1) => {
    if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
      const current = gridRef.current[y][x];
      if (current < MAX_DENSITY) {
        gridRef.current[y][x] = Math.min(current + increment, MAX_DENSITY);
        
        const neighbors = [[0,1], [0,-1], [1,0], [-1,0]];
        neighbors.forEach(([dx, dy]) => {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
            if (Math.random() > 0.8) {
              gridRef.current[ny][nx] = Math.min(gridRef.current[ny][nx] + 1, MAX_DENSITY);
            }
          }
        });
      }
    }
  };

  const drawLine = (x0: number, y0: number, x1: number, y1: number) => {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      setCellValue(x0, y0);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  };

  const getCoords = (e: React.PointerEvent) => {
    if (!artRef.current) return null;
    const rect = artRef.current.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * GRID_WIDTH);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * GRID_HEIGHT);
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isPublishing || isExporting) return;
    setHistory(prev => [...prev.slice(-49), gridRef.current.map(row => [...row])]);
    setIsDrawing(true);
    const coords = getCoords(e);
    if (coords) {
      setCellValue(coords.x, coords.y);
      lastCoords.current = coords;
      syncState();
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || isPublishing || isExporting) return;
    const coords = getCoords(e);
    if (coords) {
      if (lastCoords.current) {
        drawLine(lastCoords.current.x, lastCoords.current.y, coords.x, coords.y);
      } else {
        setCellValue(coords.x, coords.y);
      }
      lastCoords.current = coords;
      syncState();
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    lastCoords.current = null;
  };

  const handleUndo = () => {
    if (history.length === 0 || isPublishing || isExporting) return;
    const previous = history[history.length - 1];
    gridRef.current = previous.map(row => [...row]);
    setHistory(prev => prev.slice(0, -1));
    syncState();
  };

  const handlePublish = async () => {
    if (isPublishing || isExporting) return;
    setIsPublishing(true);
    setTimeout(() => {
      storageService.saveArtwork(gridRef.current);
      onPublish();
    }, 100);
  };

  const downloadPng = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      // Ensure font is loaded before drawing
      await document.fonts.load("14px 'IBM Plex Mono'");

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas context');

      const fontSize = 16;
      ctx.font = `${fontSize}px 'IBM Plex Mono', monospace`;
      
      // Calculate character dimensions for monospace
      const metrics = ctx.measureText('█');
      const charWidth = metrics.width;
      const charHeight = fontSize; // Mono height usually matches font size in standard contexts

      // Canvas dimensions with padding
      const padding = 60;
      canvas.width = charWidth * GRID_WIDTH + padding * 2;
      canvas.height = charHeight * GRID_HEIGHT + padding * 2;

      // Draw background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${fontSize}px 'IBM Plex Mono', monospace`;
      ctx.textBaseline = 'top';

      gridRef.current.forEach((row, y) => {
        row.forEach((density, x) => {
          const char = CHAR_MAP[Math.min(density, MAX_DENSITY)];
          if (char !== " ") {
            ctx.fillText(
              char, 
              padding + (x * charWidth), 
              padding + (y * charHeight)
            );
          }
        });
      });

      // Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ascii-artifact-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black">
      <div className="mb-12 flex flex-wrap justify-center gap-10">
        <button 
          onClick={onCancel} 
          disabled={isPublishing || isExporting}
          className="text-[10px] opacity-40 hover:opacity-100 uppercase tracking-[0.3em] disabled:opacity-10 transition-all"
        >
          [ Cancel ]
        </button>
        <button 
          onClick={handleUndo} 
          disabled={isPublishing || isExporting || history.length === 0}
          className="text-[10px] opacity-40 hover:opacity-100 uppercase tracking-[0.3em] disabled:opacity-10 transition-all"
        >
          [ Undo ]
        </button>
        <button 
          onClick={downloadPng} 
          disabled={isPublishing || isExporting}
          className="text-[10px] opacity-40 hover:opacity-100 uppercase tracking-[0.3em] disabled:opacity-10 transition-all"
        >
          {isExporting ? '[ Generating... ]' : '[ Export PNG ]'}
        </button>
        <button 
          onClick={handlePublish}
          disabled={isPublishing || isExporting}
          className="text-[10px] font-bold border-b border-neutral-700 uppercase tracking-[0.3em] hover:border-white transition-all disabled:opacity-20"
        >
          {isPublishing ? 'Archiving...' : 'Publish to Collection'}
        </button>
      </div>

      {/* The Studio Frame */}
      <div className="relative p-16 border border-neutral-900 bg-[#020202] shadow-2xl">
        <div 
          className="relative cursor-crosshair touch-none select-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerMove={handlePointerMove}
        >
          <ASCIIArt ref={artRef} grid={gridState} scale={1.2} />
        </div>
        
        {/* Detail accents */}
        <div className="absolute top-4 left-4 text-[8px] text-neutral-800 uppercase tracking-widest">
          Studio Mode // Raw Input
        </div>
        <div className="absolute bottom-4 right-4 text-[8px] text-neutral-800 uppercase tracking-widest">
          {history.length} Ops
        </div>
      </div>

      <div className="mt-12 text-center max-w-md">
        <div className="text-[10px] text-neutral-700 italic tracking-[0.1em] leading-relaxed">
          The canvas captures the intensity of your movement. 
          Use [Cmd+Z] to step back through the history of the piece.
        </div>
      </div>
    </div>
  );
};
