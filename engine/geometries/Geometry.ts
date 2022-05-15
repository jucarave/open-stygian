import { Renderer } from '../core/Renderer';

export class Geometry {
  protected _vertexData: number[];
  protected _indexData: number[];
  protected _vertexBuffer: WebGLBuffer;
  protected _indexBuffer: WebGLBuffer;

  constructor() {
    this._vertexData = [];
    this._indexData = [];
  }

  public addVertice(x: number, y: number, z: number): Geometry {
    this._vertexData.push(x, y, z);

    return this;
  }

  public addNormal(x: number, y: number, z: number): Geometry {
    this._vertexData.push(x, y, z);
    return this;
  }

  public addTexCoord(u: number, v: number): Geometry {
    this._vertexData.push(u, v);

    return this;
  }

  public addTriangle(vertex1: number, vertex2: number, vertex3: number): Geometry {
    this._indexData.push(vertex1, vertex2, vertex3);

    return this;
  }

  public addColor(r: number, g: number, b: number, a: number): Geometry {
    this._vertexData.push(r, g, b, a);

    return this;
  }

  public addUV(x: number, y: number, w: number, h: number): Geometry {
    this._vertexData.push(x, y, w, h);

    return this;
  }

  public clearData() {
    const gl = Renderer.instance.gl;
    
    // Clear previous mesh
    this._vertexData = [];
    this._indexData = [];
    if (this._vertexBuffer) { gl.deleteBuffer(this._vertexBuffer); }
    if (this._indexBuffer) { gl.deleteBuffer(this._indexBuffer); }
  }

  /**
   * Builds the vertex buffer and index buffer for rendering
   * 
   * @returns Same Geometry object for method chaining
   */
  public build(): Geometry {
    const gl = Renderer.instance.gl;

    this._vertexBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertexData), gl.STATIC_DRAW);

    this._indexBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indexData), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return this;
  }

  public get vertexBuffer() {
    return this._vertexBuffer;
  }

  public get indexBuffer() {
    return this._indexBuffer;
  }

  public get indicesLength() {
    return this._indexData.length;
  }

  public get vertexLength() {
    return this._vertexData.length;
  }
}