import { Geometry } from './Geometry';

export class GeometryQuad extends Geometry {
  constructor(width: number, height: number) {
    super();

    const w = width / 2;
    const h = height / 2;

    this.addVertice(-w, -h, 0)
        .addTexCoord(0, 1)

        .addVertice(w, -h, 0)
        .addTexCoord(1, 1)

        .addVertice(-w, h, 0)
        .addTexCoord(0, 0)

        .addVertice(w, h, 0)
        .addTexCoord(1, 0);
    
    this.addTriangle(0, 1, 2)
        .addTriangle(1, 3, 2);

    this.build();
  }
}