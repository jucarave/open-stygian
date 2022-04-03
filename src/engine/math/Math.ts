const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const RAD_360 = Math.PI * 2;

export function degToRad(degrees: number): number {
  return (degrees * DEG_TO_RAD + RAD_360) % RAD_360;
}

export function radToDeg(radians: number): number {
  return (radians * RAD_TO_DEG + 360) % 360;
}

export function getAngleBetwen2DVectors(x1: number, y1: number, x2: number, y2: number) {
  const dot = x1 * x2 + y1 * y2;
  const det = y1 * x2 - x1 * y2;

  return (Math.atan2(-det, dot) + RAD_360) % RAD_360;
}