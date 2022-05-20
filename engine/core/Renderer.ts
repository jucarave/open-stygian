import { Shader, ShaderStruct } from '../shaders/Shader';
import { DungeonShader } from '../shaders/glsl/DungeonShader';
import { Texture } from './Texture';
import { ColorShader } from '../shaders/glsl/ColorShader';

interface ShadersMap {
  [index: string]: Shader
}

export class Renderer {
  private _canvas: HTMLCanvasElement;
  private _gl: WebGLRenderingContext;
  private _shaders: ShadersMap;
  private _shader: Shader;
  private _currentTexture: string;

  public static instance: Renderer;

  constructor(canvas: HTMLCanvasElement) {
    Renderer.instance = this;

    this._canvas = canvas;
    this._currentTexture = '';

    this._initGL();
    this._initShaders();

    this.useShader('dungeon');
  }

  /**
   * If the browser supports webgl then this method will obtain
   * the context and will set a default viewport size and background
   * color
   */
  private _initGL() {
    const gl = this._canvas.getContext('webgl');
    if (!gl) {
      throw new Error('Couldn\'t create webgl context');
    }

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.cullFace(gl.BACK);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this._gl = gl;
  }

  /**
   * Init the default shaders supported by the engine
   */
  private _initShaders() {
    this._shaders = {};
    this.loadShader('dungeon', DungeonShader);
    this.loadShader('color', ColorShader);
  }

  /**
   * Loads a new shader into the engine
   * 
   * @param name unique name for the shader
   * @param shader shader containing the vertex and the fragment shader
   */
  public loadShader(name: string, shader: ShaderStruct) {
    this._shaders[name] = new Shader(name, shader, this._gl);
  }

  /**
   * Loads a shader into the webgl program, it needs to
   * have been loaded previously with the loadShader(name, shader) method.
   * If the shader is the same one as the one currently loaded then no
   * operation will be performed
   * 
   * @param shaderName unique name for the shader
   */
  public useShader(shaderName: string) {
    if (!this._shaders[shaderName]) {
      throw new Error(`Shader '${shaderName}' was not loaded into the renderer`);
    }

    this._shader = this._shaders[shaderName];
    this._shader.useProgram(this._gl);
  }

  /**
   * Search a shader by it's name, if it doesn't exists then it throws
   * an Error
   * 
   * @param shaderName 
   * @returns Shader instance
   */
  public getShader(shaderName: string) {
    if (!this._shaders[shaderName]) {
      throw new Error(`Shader '${shaderName}' was not loaded into the renderer`);
    }

    return this._shaders[shaderName];
  }

  /**
   * Clears the canvas with the background color (black by default)
   */
  public clear() {
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
  }

  /**
   * Upload a texture to the GPU only if it's not currently there
   * 
   * @param texture Texture to upload
   * @param uniform uniform location to send the texture
   */
  public bindTexture(texture: Texture, uniform: WebGLUniformLocation) {
    if (this._currentTexture === texture.key) {
      return;
    }

    this._gl.bindTexture(this._gl.TEXTURE_2D, texture.texture);
    this.gl.uniform1i(uniform, 0);
  }

  public get gl(): WebGLRenderingContext {
    return this._gl;
  }

  public get shader(): Shader {
    return this._shader;
  }
}