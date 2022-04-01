interface StructMap {
  [index: string]: Array<string>;
}

interface Attributes {
  [index: string]: number;
}

interface Uniforms {
  [index: string]: WebGLUniformLocation;
}

interface ShaderDefines {
  [index: string]: string;
}

export interface ShaderStruct {
  vertexShader: string;
  fragmentShader: string;
}

export class Shader {
  private _program: WebGLProgram;

  public attributesCount: number;
  public attributes: Attributes;
  public uniforms: Uniforms;

  public readonly key: string;

  public static lastShader: Shader;
  public static maxAttribLength = 0;

  constructor(key: string, shaderInfo: ShaderStruct, gl: WebGLRenderingContext) {
    this.key = key;

    this._compileShaders(shaderInfo, gl);
    this._parseAttributes(shaderInfo, gl);
    this._parseUniforms(shaderInfo, gl);
  }

  /**
   * Compiles the vertex and fragment shaders and links them
   * to a WebGLProgram
   * 
   * @param shaderInfo Object containing the vertex and fragment shader
   * @param gl WebGLRenderingContext
   */
  private _compileShaders(shaderInfo: ShaderStruct, gl: WebGLRenderingContext) {
    const vShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
    gl.shaderSource(vShader, shaderInfo.vertexShader);
    gl.compileShader(vShader);

    if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(vShader));
      throw new Error('Error compiling vertex shader');
    }

    const fShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
    gl.shaderSource(fShader, shaderInfo.fragmentShader);
    gl.compileShader(fShader);

    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(fShader));
      throw new Error('Error compiling fragment shader');
    }

    const program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log(gl.getProgramInfoLog(program));
      throw new Error('Error linking the program');
    }

    this._program = program;
  }

  /**
   * Reads through the vertex shader and looks for attributes and stores
   * them in a map
   * 
   * @param shader Object containing the vertex and fragment shader
   * @param gl WebGLRenderingContext
   */
  private _parseAttributes(shader: ShaderStruct, gl: WebGLRenderingContext): void {
    const code: Array<string> = shader.vertexShader.split(/\n/g),
      program = this._program;

    let attribute: string;
    let location: number;

    this.attributesCount = 0;

    const attributes: Attributes = {};

    for (let i = 0, len = code.length; i < len; i++) {
      const c: Array<string> = code[i].trim().split(/ /g);

      if (c !== undefined && c[0] === 'attribute') {
        attribute = c.pop()?.replace(/;/g, '') as string;
        location = gl.getAttribLocation(program, attribute);

        attributes[attribute] = location;
        this.attributesCount += 1;
      }
    }

    this.attributes = attributes;

    Shader.maxAttribLength = Math.max(Shader.maxAttribLength, this.attributesCount);
  }

  /**
   * Reads through the vertex and fragment shader and look for uniforms and
   * stores them in a map
   * 
   * @param shader Object containing the vertex and fragment shader
   * @param gl WebGLRenderingContext
   */
  private _parseUniforms(shader: ShaderStruct, gl: WebGLRenderingContext): void {
    let code: Array<string> = shader.vertexShader.split(/\n/g);
    code = code.concat(shader.fragmentShader.split(/\n/g));

    const program = this._program;

    const usedUniforms: Array<string> = [];
    let uniform: string;
    let location: WebGLUniformLocation;

    const uniforms: Uniforms = {};

    const structMap: StructMap = {};
    let lastStruct: string | null = null;

    const defines: ShaderDefines = {};

    for (let i = 0, len = code.length; i < len; i++) {
      const c: Array<string> = code[i].trim().split(/ /g);
      if (c[0] === '') {
        continue;
      }

      if (c[0] === '#define') { // Parse precompiling definitions "#define property value"
        defines[c[1]] = c[2];
      } else if (c[0] === 'struct') { // Starts parsing shader structs
        lastStruct = c[1];
        structMap[lastStruct] = [];
      } else if (c[0] === 'uniform') { // Parse uniforms
        uniform = c.pop()?.replace(/;/g, '') as string;
        let size = 0;

        // If the uniform is an array then obtain the size of the array
        // through a literal value or a #define
        if (uniform.indexOf('[') != -1) {
          const ind = uniform.indexOf('[');
          const sizeStr = uniform.substring(ind + 1, uniform.indexOf(']'));

          size = defines[sizeStr] ? parseInt(defines[sizeStr]) : parseInt(sizeStr);
          uniform = uniform.substring(0, ind);
        }

        // Obtain the type of the uniform
        const type: string = c.pop() as string;

        /* If the type of the uniform is a custom structure then parse the 
         * uniform using each property of the struct:
         *
         * uniformName.structProperty1
         * uniformName.structProperty2
         * 
         * or if the uniform is an array
         * 
         * uniformName[0].structProperty1
         * uniformName[0].structProperty2
         * uniformName[1].structProperty1
         * uniformName[1].structProperty2
         */
        if (structMap[type]) {
          const struct = structMap[type];
          for (let k = 0; k < Math.max(size, 1); k++) {
            for (let j = 0, prop; (prop = struct[j]); j++) {
              const uniformProperty = uniform + (size > 0 ? '[' + k + ']' : '') + '.' + prop;
              if (usedUniforms.indexOf(uniformProperty) != -1) {
                continue;
              }

              location = this._getUniformLocation(gl, program, uniformProperty);
              usedUniforms.push(uniformProperty);
              uniforms[uniformProperty] = location;
            }
          }
        } else {
          // Otherwise just parse them as a single variable or an array
          for (let k = 0; k < Math.max(size, 1); k++) {
            const uniformProperty = uniform + (size > 0 ? '[' + k + ']' : '');
            if (usedUniforms.indexOf(uniformProperty) != -1) {
              continue;
            }

            location = this._getUniformLocation(gl, program, uniformProperty);
            usedUniforms.push(uniformProperty);
            uniforms[uniformProperty] = location;
          }
        }
      } else if (lastStruct != null) {
        const property: string | undefined = c.pop()?.replace(/;/g, '');
        if (property === '}') { // Are we closing the struct
          lastStruct = null;
        } else if (property !== undefined) { // Add a property to the current struct
          structMap[lastStruct].push(property);
        }
      } 
    }

    this.uniforms = uniforms;
  }

  /**
   * Try and get the location of a uniform in the shader or throw an error
   * 
   * @param gl WebGLRenderingContext
   * @param program WebGLProgram
   * @param uniformProperty Name of the uniform to get from the shader
   * 
   * @returns The location of the uniform if found
   */
  private _getUniformLocation(gl: WebGLRenderingContext, program: WebGLProgram, uniformProperty: string): WebGLUniformLocation {
    const location = gl.getUniformLocation(program, uniformProperty);
    if (location === null) {
      throw new Error(`Couldn't find uniform: '${uniformProperty}' in shader`);
    }

    return location;
  }

  /**
   * Use the program from this shader and update the count of attributes. 
   * If the last shader used was this same one then don't do anything
   * 
   * @param gl WebGLRenderingContext
   */
  public useProgram(gl: WebGLRenderingContext) {
    if (Shader.lastShader && Shader.lastShader.key === this.key) {
      return;
    }

    gl.useProgram(this._program);

    Shader.lastShader = this;

    for (let i = 0; i < Shader.maxAttribLength; i++) {
      if (i < this.attributesCount) {
        gl.enableVertexAttribArray(i);
      } else {
        gl.disableVertexAttribArray(i);
      }
    }
  }
}