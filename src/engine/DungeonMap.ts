export interface Tile {
    type: 'Wall' | 'Floor';
    uv: number[],
    ceilUV?: number[]
}

export interface DungeonMap {
    texture: string;
    tiles: Tile[];
    map: number[][];
}