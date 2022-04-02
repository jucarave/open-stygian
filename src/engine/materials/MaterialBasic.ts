import { Camera } from 'engine/Camera';
import { FLOAT_SIZE, TEXCOORD_SIZE, VERTICE_SIZE } from 'engine/Constants';
import { Entity } from 'engine/entities/Entity';
import { Geometry } from 'engine/geometries/Geometry';
import { Renderer } from 'engine/Renderer';
import { Shader } from 'engine/shaders/Shader';
import { Texture } from 'engine/Texture';
import { Material } from './Material';

const VERTEX_OFFSET = 0;
const TEXCOORD_OFFSET = 3 * FLOAT_SIZE;
const STRIDE = (VERTICE_SIZE + TEXCOORD_SIZE) * FLOAT_SIZE;

/**
 * MaterialBasic renders a geometry using vertices with: position
 * it uses the 'basic' shader
 */
export class MaterialBasic extends Material {
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
    this._shader = this._renderer.getShader('basic');

    this._texture = texture;

    this.v4UV = [0, 0, 1, 1];
    this.v2Repeat = [1, 1];
  }

  /**
   * Upload the vertex data of a geometry, it uploads:
   *  - vertex position
   * 
   * @param geometry 
   */
  private _uploadGeometryData(geometry: Geometry) {
    const gl = this._gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vertexBuffer);
    gl.vertexAttribPointer(this._shader.attributes['aPosition'], VERTICE_SIZE, gl.FLOAT, false, STRIDE, VERTEX_OFFSET);
    gl.vertexAttribPointer(this._shader.attributes['aTexCoord'], TEXCOORD_SIZE, gl.FLOAT, false, STRIDE, TEXCOORD_OFFSET);
    
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
   * Upload the texture to the GPU. It also sends UV and Repeat settings, 
   * this will allow a single face in a texturemap to be repeated as needed.
   */
  private _uploadTexture() {
    this._renderer.bindTexture(this._texture, this._shader.uniforms['uTexture']);

    this._gl.uniform4fv(this._shader.uniforms['uUV'], this.v4UV);
    this._gl.uniform2fv(this._shader.uniforms['uRepeat'], this.v2Repeat);
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

    this._renderer.useShader('basic');

    this._uploadGeometryData(geometry);
    this._uploadCameraData(entity, camera);
    this._uploadTexture();

    gl.drawElements(gl.TRIANGLES, geometry.indicesLength, gl.UNSIGNED_SHORT, 0);
  }
}