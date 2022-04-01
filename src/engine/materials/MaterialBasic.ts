import { FLOAT_SIZE, VERTICE_SIZE } from 'engine/Constants';
import { Geometry } from 'engine/geometries/Geometry';
import { Renderer } from 'engine/Renderer';
import { Shader } from 'engine/shaders/Shader';
import { Material } from './Material';

const VERTEX_OFFSET = 0;
const STRIDE = VERTICE_SIZE * FLOAT_SIZE;

/**
 * MaterialBasic renders a geometry using vertices with: position
 * it uses the 'basic' shader
 */
export class MaterialBasic extends Material {
  private _gl: WebGLRenderingContext;
  private _shader: Shader;
  private _renderer: Renderer;

  constructor() {
    super();

    this._renderer = Renderer.instance;

    this._gl = this._renderer.gl;
    this._shader = this._renderer.getShader('basic');
  }

  private _uploadVertexData(geometry: Geometry) {
    const gl = this._gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vertexBuffer);
    gl.vertexAttribPointer(this._shader.attributes['aPosition'], VERTICE_SIZE, gl.FLOAT, false, STRIDE, VERTEX_OFFSET);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer);
  }

  public override render(geometry: Geometry) {
    const gl = this._gl;

    this._renderer.useShader('basic');

    this._uploadVertexData(geometry);

    gl.drawElements(gl.TRIANGLES, geometry.indicesLength, gl.UNSIGNED_SHORT, 0);
  }
}