export interface Tile {
  y: number;
  height: number;
  floorUV?: number[];
  wallUV?: number[];
  ceilingUV?: number[];
}

export interface DungeonGrid {
  texture: string;
  tiles: Tile[];
  map: number[][];
}