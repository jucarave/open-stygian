import { Camera } from '../core/Camera';
import { Font } from '../core/Font';
import { Geometry } from '../geometries/Geometry';
import { MaterialColor } from '../materials/MaterialColor';
import { Entity } from './Entity';

export class Text extends Entity {
  private _text: string;
  private _font: Font;
  private _horizontalOffset: number;
  private _geometryIndex: number;

  constructor(text: string, font: Font) {
    super();

    this._text = text;
    this.geometry = new Geometry();
    this.material = new MaterialColor(font.texture, [1, 0, 1, 1]);
    this._font = font;

    this._rebuildGeometry();
  }

  private _rebuildGeometry() {
    if (!this._font.texture.isReady) { 
      return; 
    }

    this._horizontalOffset = 0;
    this._geometryIndex = 0;

    this.geometry.clearData();
    
    const length = this._text.length;
    for (let i=0;i<length;i++) {
      const character = this._text.charAt(i);
      this._addCharacterToGeometry(character);
    }

    this.geometry.build();
  }

  private _addCharacterToGeometry(character: string) {
    const glyph = this._font.getGlyphData(character);
    const uvs = glyph.uv;

    const width = glyph.size.x;
    const height = glyph.size.y;

    this.geometry
        .addVertice(this._horizontalOffset, 0, 0).addTexCoord(uvs[0], 1 - uvs[1] - uvs[3])
        .addVertice(this._horizontalOffset + width, 0, 0).addTexCoord(uvs[0]+uvs[2], 1 - uvs[1] - uvs[3])
        .addVertice(this._horizontalOffset, height, 0).addTexCoord(uvs[0], 1 - uvs[1])
        .addVertice(this._horizontalOffset + width, height, 0).addTexCoord(uvs[0]+uvs[2], 1 - uvs[1]);

    this.geometry
        .addTriangle(this._geometryIndex, this._geometryIndex + 1, this._geometryIndex + 2)
        .addTriangle(this._geometryIndex + 1, this._geometryIndex + 3, this._geometryIndex + 2);

    this._geometryIndex += 4;
    this._horizontalOffset += width;
  }

  public override render(camera: Camera) {
    if (this.geometry.indicesLength === 0) {
      this._rebuildGeometry();
    }

    super.render(camera);
  }

  public get text(): string {
    return this._text;
  }

  public set text(text: string) {
    this._text = text;

    this._rebuildGeometry();
  }
}