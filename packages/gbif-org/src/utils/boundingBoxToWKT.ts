import { BoundingBox } from '@/types';

// create wkt from bounds, making sure that it is counter clockwise
export function boundingBoxToWKT({ left, top, bottom, right }: BoundingBox): string {
  return `POLYGON((${left} ${top},${left} ${bottom},${right} ${bottom},${right} ${top},${left} ${top}))`;
}
