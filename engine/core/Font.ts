import { Vector2 } from '../math/Vector2';
import { Texture } from './Texture';

interface FontMap {
  [index: string]: Font;
}

interface GlyphData {
  uv: number[];
  size: Vector2;
}

export class Font {
  private _size: Vector2;
  private _charactersList: string;
  private _glyphSize: Vector2;
  private _colsPerTexture: number;

  private static fonts: FontMap = {};

  public readonly key: string;
  public readonly texture: Texture;

  constructor(key: string, imageSource: string, charactersList: string, glyphSize: Vector2) {
    this.key = key;

    this._charactersList = charactersList;
    this._glyphSize = glyphSize;

    this.texture = new Texture(`font_${imageSource}`, imageSource);
    this.texture.onReady.add(() => {
      this._size = {
        x: this.texture.width,
        y: this.texture.height
      };

      this._colsPerTexture = Math.floor(this._size.x / this._glyphSize.x);
    }, this);

    Font.fonts[key] = this;
  }

  public getGlyphData(character: string): GlyphData {
    const ind = this._charactersList.indexOf(character);
    if (ind === -1) { 
      return this._createGlyphData(0, 0, 0, 0);
    }

    const x = ind % this._colsPerTexture;
    const y = Math.floor(ind / this._colsPerTexture);

    return this._createGlyphData(x * this._glyphSize.x, y * this._glyphSize.y, this._glyphSize.x, this._glyphSize.y);
  }

  private _createGlyphData(x: number, y: number, width: number, height: number): GlyphData {
    return {
      uv: [ 
        x / this.texture.width, 
        y / this.texture.height, 
        width / this.texture.width, 
        height / this.texture.height 
      ],
      // TODO: Find glyph size per character
      size: this._glyphSize
    };
  }

  public static getFont(key: string) {
    if (!Font.fonts[key]) {
      throw new Error(`Font [${key}] not found`);
    }

    return Font.fonts[key];
  }
}