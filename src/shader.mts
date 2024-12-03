// FRAGMENT_SHADER: 0x8B30;
// VERTEX_SHADER: 0x8B31;
import {mat4} from "gl-matrix";

export type ShaderType = 0x8B30 | 0x8B31

export default class Shader {
    public readonly program: WebGLProgram;
    constructor(VSrc: string, FSrc: string) {
        this.program = gl.createProgram();

        //FIXME: handle errors
        const vs = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
        const fs = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;

        //TODO: possible parallel shader compilation. checkout mdn webgl best practices docs
        gl.shaderSource(vs, VSrc);
        gl.compileShader(vs);
        const vse: string|null = this.checkCompilationError(vs, gl.VERTEX_SHADER);
        if(vse){
            alert(`Vertex shader compilation error.`);
            throw `ERROR - Vertex shader compilation failed.\n${vse}`;
        }
        gl.shaderSource(fs, FSrc);
        gl.compileShader(fs);
        const fse:string|null = this.checkCompilationError(fs, gl.FRAGMENT_SHADER);
        if(fse){
            alert(`Fragment shader compilation error.`);
            throw `ERROR - Fragment shader compilation failed.\n${fse}`;
        }
        gl.attachShader(this.program, vs);
        gl.attachShader(this.program, fs);

        gl.linkProgram(this.program);
        const progErr: string | null = this.checkLinkingError();
        if(progErr){
            throw `ERROR - Shader program linking failed.${progErr}`;
        }
        gl.deleteShader(vs);
        gl.deleteShader(fs);
    }

    public use(){
        gl.useProgram(this.program);
    }

    private checkCompilationError(shader: WebGLShader, type: ShaderType): string | null{
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return gl.getShaderInfoLog(shader);
        }
        return null;
    }
    private checkLinkingError(): string | null{
        if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)){
            return gl.getProgramInfoLog(this.program);
        }
        return null;
    }

    //TODO: learn caching method.
    //TODO: learn how to manipulate error  call stack to show caller line not this method line.

    public uniformMatrix4fv(name: string, value: mat4, alertM = null){
        const location: WebGLUniformLocation | null = gl.getUniformLocation(this.program, name);
        if(location === null){
            if(alertM){
                alert(alertM);
            }
            throw `ERROR - Uniform ${name} matrix location not found in shader.`;
        }
        gl.uniformMatrix4fv(location, false, value);
    }

    public uniform1i(name: string, value: GLint, alertM: null | string = null){
        const location: WebGLUniformLocation | null = gl.getUniformLocation(this.program, name);
        if(location === null){
            if(alertM){
                alert(alertM);
            }
            throw `ERROR - Uniform ${name} matrix location not found in shader.`;
        }
        gl.uniform1i(location, value);
    }
}