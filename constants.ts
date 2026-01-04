
export const GRID_WIDTH = 80;
export const GRID_HEIGHT = 40;

// Character density map from lightest to darkest
export const CHAR_MAP = [
  " ", 
  ".", 
  ":", 
  "-", 
  "=", 
  "+", 
  "*", 
  "#", 
  "%", 
  "@", 
  "█"
];

export const MAX_DENSITY = CHAR_MAP.length - 1;

export const INITIAL_ARTWORKS: any[] = [
  {
    id: 'seed-1',
    createdAt: Date.now() - 10000000,
    grid: Array(GRID_HEIGHT).fill(0).map((_, y) => 
      Array(GRID_WIDTH).fill(0).map((_, x) => {
        // Simple circle formula for seed
        const dx = x - GRID_WIDTH / 2;
        const dy = y - GRID_HEIGHT / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 10) return Math.floor(Math.random() * 5) + 5;
        if (dist < 15) return Math.floor(Math.random() * 3) + 1;
        return 0;
      })
    )
  }
];
