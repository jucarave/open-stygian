export interface Vector2 {
  x: number;
  y: number;
}

export function vector2DLength(vector: Vector2) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

export function vector2DNormalize(vector: Vector2): Vector2 {
  const length = vector2DLength(vector);
  return { x: vector.x / length, y: vector.y / length };
}

export function vector2DDot(vectorA: Vector2, vectorB: Vector2): number {
  return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
}
