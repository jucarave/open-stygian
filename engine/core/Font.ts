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
  private _charactersSize: Vector2[];
  private _glyphSize: Vector2;
  private _colsPerTexture: number;

  private static fonts: FontMap = {};

  public readonly key: string;
  public readonly texture: Texture;

  constructor(key: string, imageSource: string, charactersList: string, glyphSize: Vector2) {
    this.key = key;

    this._charactersList = charactersList;
    this._charactersSize = new Array(charactersList.length);
    this._glyphSize = glyphSize;

    this.texture = new Texture(`font_${imageSource}`, imageSource);
    this.texture.onReady.add(() => {
      this._size = {
        x: this.texture.width,
        y: this.texture.height
      };

      this._colsPerTexture = Math.floor(this._size.x / this._glyphSize.x);

      this._calculateGlyphSizes();
    }, this);

    Font.fonts[key] = this;
  }

  private _calculateGlyphSizes() {
    const canvas = document.createElement('canvas');
    canvas.width = this.texture.width;
    canvas.height = this.texture.height;

    const ctx = canvas.getContext('2d');

    ctx.drawImage(this.texture.image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const length = this._charactersList.length;
    let characterOffset = 0;
    let row = 0;
    for (let i=0;i<length;i++) {
      let width = 0;
      for (let y=0;y<this._glyphSize.y;y++) {
        for (let x=width;x<this._glyphSize.x;x++) {
          const alpha = imageData.data[((row + y) * canvas.width + x + characterOffset) * 4];
          if (alpha > 0) {
            width = x;
          }
        }
      }

      if (characterOffset !== 0 && (i + 1) % this._colsPerTexture === 0) { 
        characterOffset = 0;
        row += this._glyphSize.y;
      } else {
        characterOffset += this._glyphSize.x;
      }

      this._charactersSize[i] = { x: width + 1, y: this._glyphSize.y };
    }
  }

  public getGlyphData(character: string): GlyphData {
    const ind = this._charactersList.indexOf(character);
    if (ind === -1) { 
      return this._createGlyphData(0, 0, 0, 0, this._glyphSize);
    }

    const x = ind % this._colsPerTexture;
    const y = Math.floor(ind / this._colsPerTexture);
    const size = this._charactersSize[ind];

    return this._createGlyphData(x * this._glyphSize.x, y * this._glyphSize.y, size.x, size.y, size);
  }

  private _createGlyphData(x: number, y: number, width: number, height: number, size: Vector2): GlyphData {
    return {
      uv: [ 
        x / this.texture.width, 
        y / this.texture.height, 
        width / this.texture.width, 
        height / this.texture.height 
      ],
      size
    };
  }

  public static getFont(key: string) {
    if (!Font.fonts[key]) {
      throw new Error(`Font [${key}] not found`);
    }

    return Font.fonts[key];
  }
}