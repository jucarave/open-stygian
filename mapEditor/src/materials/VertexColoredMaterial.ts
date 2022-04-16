import { Camera } from '../../../engine/core/Camera';
import { Renderer } from '../../../engine/core/Renderer';
import { Entity } from '../../../engine/entities/Entity';
import { Geometry } from '../../../engine/geometries/Geometry';
import { Material } from '../../../engine/materials/Material';
import { Shader } from '../../../engine/shaders/Shader';
import { COLOR_SIZE, FLOAT_SIZE, VERTICE_SIZE } from '../../../engine/system/Constants';

const SHADER_KEY = 'VERTEX_COLORED';
const VERTEX_OFFSET = 0;
const COLOR_OFFSET = VERTICE_SIZE * FLOAT_SIZE;
const STRIDE = (VERTICE_SIZE + COLOR_SIZE) * FLOAT_SIZE;

/**
 * VertexColoredMaterial renders a level geometry using 
 * vertices with: position and colors
 * it uses the 'VERTEX_COLORED' shader
 */
export class VertexColoredMaterial extends Material {
  private _renderer: Renderer;
  private _gl: WebGLRenderingContext;
  private _shader: Shader;

  constructor() {
    super();

    this._renderer = Renderer.instance;
    this._gl = this._renderer.gl;
    this._shader = this._renderer.getShader(SHADER_KEY);
  }

  /**
   * Upload the vertex data of a geometry, it uploads:
   *  - vertex position
   *  - vertex color
   * 
   * @param geometry 
   */
  private _uploadGeometryData(geometry: Geometry) {
    const gl = this._gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vertexBuffer);
    gl.vertexAttribPointer(this._shader.attributes['aPosition'], VERTICE_SIZE, gl.FLOAT, false, STRIDE, VERTEX_OFFSET);
    gl.vertexAttribPointer(this._shader.attributes['aColor'], COLOR_SIZE, gl.FLOAT, false, STRIDE, COLOR_OFFSET);
    
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
   * Renders a geometry from an entity position and a camera perspective
   * 
   * @param entity Entity where the geometry is
   * @param camera Point of view to render the geometry
   * @param geometry Geometry to render
   */
  public render(entity: Entity, camera: Camera, geometry: Geometry): void {
    const gl = this._gl;
    this._renderer.useShader(SHADER_KEY);

    this._uploadGeometryData(geometry);
    this._uploadCameraData(entity, camera);

    gl.drawArrays(gl.LINES, 0, geometry.vertexLength);
  }

}