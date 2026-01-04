
import React, { forwardRef } from 'react';
import { GridData } from '../types';
import { CHAR_MAP } from '../constants';

interface ASCIIArtProps {
  grid: GridData;
  scale?: number;
  className?: string;
}

export const ASCIIArt = forwardRef<HTMLPreElement, ASCIIArtProps>(({ grid, scale = 1, className = "" }, ref) => {
  const renderedText = grid.map(row => 
    row.map(density => CHAR_MAP[Math.min(density, CHAR_MAP.length - 1)]).join('')
  ).join('\n');

  return (
    <pre 
      ref={ref}
      className={`leading-[1.0] select-none whitespace-pre font-mono inline-block ${className}`}
      style={{ 
        fontSize: `${scale * 12}px`,
        fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: '0',
      }}
    >
      {renderedText}
    </pre>
  );
});
