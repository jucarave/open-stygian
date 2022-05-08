export interface Tile {
  y: number;
  height: number;
  floorUV?: number[];
  ceilingUV?: number[];
  wallUV?: number[];
  lowWallUV?: number[];
  highWallUV?: number[];
  diagonal?: 'tl' | 'tr' | 'bl' | 'br';
}

export interface DungeonGrid {
  texture: string;
  tiles: Tile[];
  map: number[][];
}