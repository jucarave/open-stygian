export interface Tile {
  y1: number;
  y2: number;

  floor?: { 
    uv?: number[];
    lowWallUV?: number[]
  };

  ceiling?: {
    uv?: number[];
    highWallUV?: number[]
  };

  wall?: {
    diagonal?: 'tl' | 'tr' | 'bl' | 'br';
    uv: number[];
  };
}

export interface DungeonMap {
  texture: string;
  tiles: Tile[];
  map: number[][];
}