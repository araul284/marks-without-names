
export type GridData = number[][];

export interface Artwork {
  id: string;
  grid: GridData;
  createdAt: number;
}

export type ViewState = 'gallery' | 'editor' | 'viewer';
