import Shader from "./shader.mts";
import {IModelData} from "./model-reader.mts";

export default class Mesh{
    public  VAO!: WebGLVertexArrayObject;
    private VBO!: WebGLBuffer;
    private EBO!: WebGLBuffer;

    private readonly data: IModelData;
    private readonly shaderProgram: WebGLProgram;
    constructor(data: IModelData, shaderProgram: Shader) {
        this.data = data;
        this.shaderProgram = shaderProgram.program;
        this.setup();
    }

    public draw(){
        gl.bindVertexArray(this.VAO);
        gl.drawElements(gl.TRIANGLES, this.data.indices.length, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }

    private setup(){
        const {buffer, indices} = this.data;
        this.VAO = gl.createVertexArray();

        this.VBO = gl.createBuffer();
        this.EBO = gl.createBuffer();

        gl.bindVertexArray(this.VAO);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        const posL = gl.getAttribLocation(this.shaderProgram, "a_pos");
        const normalL = gl.getAttribLocation(this.shaderProgram, "a_normal");
        const UVL = gl.getAttribLocation(this.shaderProgram, "a_uv");

        if(posL === -1){
            throw 'ERROR - Mesh vertex position attribute not found in shader program.';
        }

        if(normalL === -1){
            throw 'ERROR - Mesh vertex normal attribute not found in shader program.';
        }

        if(UVL === -1){
            throw 'ERROR - Mesh vertex UV attribute not found in shader program.';
        }

        gl.enableVertexAttribArray(posL);
        gl.enableVertexAttribArray(normalL);
        gl.enableVertexAttribArray(UVL);

        const stride: number = (3+3+2) * buffer.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(posL, 3, gl.FLOAT, false, stride, 0);
        gl.vertexAttribPointer(normalL, 3, gl.FLOAT, false, stride, 3 * buffer.BYTES_PER_ELEMENT);
        gl.vertexAttribPointer(UVL, 2, gl.FLOAT, false, stride, 6 * buffer.BYTES_PER_ELEMENT);

        gl.bindVertexArray(null);

    }


}

