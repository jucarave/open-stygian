import { Camera } from '../core/Camera';
import { FLOAT_SIZE, TEXCOORD_SIZE, UVS_SIZE, VERTICE_SIZE } from '../system/Constants';
import { Entity } from '../entities/Entity';
import { Geometry } from '../geometries/Geometry';
import { Renderer } from '../core/Renderer';
import { Shader } from '../shaders/Shader';
import { Texture } from '../core/Texture';
import { Material } from './Material';

const VERTEX_OFFSET = 0;
const TEXCOORD_OFFSET = VERTICE_SIZE * FLOAT_SIZE;
const UV_OFFSET = (VERTICE_SIZE + TEXCOORD_SIZE) * FLOAT_SIZE;
const STRIDE = (VERTICE_SIZE + TEXCOORD_SIZE + UVS_SIZE) * FLOAT_SIZE;
const SHADER_KEY = 'dungeon';

/**
 * MaterialDungeon renders a level geometry using 
 * vertices with: position, texcoords and uvs
 * it uses the 'dungeon' shader
 */
export class MaterialDungeon extends Material {
  private _gl: WebGLRenderingContext;
  private _shader: Shader;
  private _renderer: Renderer;
  private _texture: Texture;

  public v4UV: number[];
  public v2Repeat: number[];

  constructor(texture: Texture) {
    super();

    this._renderer = Renderer.instance;

    this._gl = this._renderer.gl;
    this._shader = this._renderer.getShader(SHADER_KEY);

    this._texture = texture;

    this.v4UV = [0, 0, 1, 1];
    this.v2Repeat = [1, 1];
  }

  /**
   * Upload the vertex data of a geometry, it uploads:
   *  - vertex position
   *  - texture coordinates
   *  - triangles UVs
   * 
   * @param geometry 
   */
  private _uploadGeometryData(geometry: Geometry) {
    const gl = this._gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vertexBuffer);
    gl.vertexAttribPointer(this._shader.attributes['aPosition'], VERTICE_SIZE, gl.FLOAT, false, STRIDE, VERTEX_OFFSET);
    gl.vertexAttribPointer(this._shader.attributes['aTexCoord'], TEXCOORD_SIZE, gl.FLOAT, false, STRIDE, TEXCOORD_OFFSET);
    gl.vertexAttribPointer(this._shader.attributes['aUV'], UVS_SIZE, gl.FLOAT, false, STRIDE, UV_OFFSET);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer);
  }

  /**
   * Uploads the view matrix and projection matrix to the GPU
   * 
   * @param entity to calculate the world matrix
   * @param camera containing the projection matrix
   */
  private _uploadCameraData(entity: Entity, camera: Camera) {
    const gl = this._gl;

    gl.uniformMatrix4fv(this._shader.uniforms['uProjection'], false, camera.projectionMatrix.data);
    gl.uniformMatrix4fv(this._shader.uniforms['uView'], false, entity.getWorldMatrix(camera).data);
  }

  /**
   * Upload the texture to the GPU.
   */
  private _uploadTexture() {
    this._renderer.bindTexture(this._texture, this._shader.uniforms['uTexture']);
  }

  /**
   * Renders a geometry from an entity position and a camera perspective
   * 
   * @param entity Entity where the geometry is
   * @param camera Point of view to render the geometry
   * @param geometry Geometry to render
   */
  public override render(entity: Entity, camera: Camera, geometry: Geometry) {
    const gl = this._gl;

    this._renderer.useShader(SHADER_KEY);

    this._uploadGeometryData(geometry);
    this._uploadCameraData(entity, camera);
    this._uploadTexture();

    gl.drawElements(gl.TRIANGLES, geometry.indicesLength, gl.UNSIGNED_SHORT, 0);
  }
}