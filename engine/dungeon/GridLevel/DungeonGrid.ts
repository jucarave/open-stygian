export interface Tile {
  y: number;
  height: number;
  floorUV?: number[];
  ceilingUV?: number[];
  wallUV?: number[];
  lowWallUV?: number[];
  highWallUV?: number[];
  diagonal?: 'tl' | 'tr' | 'bl' | 'br';
  slope?: 'n' | 's' | 'w' | 'e'
}

export interface DungeonGrid {
  texture: string;
  tiles: Tile[];
  map: number[][];
}