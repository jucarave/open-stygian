import { Shader, ShaderStruct } from './shaders/Shader';
import { BasicShader } from './shaders/glsl/BasicShader';

interface ShadersMap {
  [index: string]: Shader
}

export class Renderer {
  private _canvas: HTMLCanvasElement;
  private _width: number;
  private _height: number;
  private _gl: WebGLRenderingContext;
  private _shaders: ShadersMap;
  private _shader: Shader;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._width = canvas.width;
    this._height = canvas.height;

    this._initGL();
    this._initShaders();

    this.useShader('basic');
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

    gl.viewport(0, 0, this._width, this._height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this._gl = gl;
  }

  /**
   * Init the default shaders supported by the engine
   */
  private _initShaders() {
    this._shaders = {};
    this.loadShader('basic', BasicShader);
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
   * Clears the canvas with the background color (black by default)
   */
  public clear() {
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
  }

  public get gl(): WebGLRenderingContext {
    return this._gl;
  }

  public get shader(): Shader {
    return this._shader;
  }
}