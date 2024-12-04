import Mesh from "./mesh.mts";
import Shader from "./shader.mts";
import ModelReader, {IModelData} from "./model-reader.mts";
import {mat4, vec3} from "gl-matrix";
import {getTextureImage} from "./utils.mts";
import InputHandler from "./input-handler.mts";


// engine components
let shader: Shader;
let cubeMesh: Mesh;
let controller: InputHandler;

// camera
let cameraPos: vec3 = vec3.fromValues(0, 0, 3);
let cameraFront: vec3 = vec3.fromValues(0, 0, -1);
let cameraUp: vec3 = vec3.fromValues(0, 1, 0);

//textures
let bottomTex: WebGLTexture;
let sideTex: WebGLTexture;
let topTex: WebGLTexture;

let dt: number = 0, lastFrame: number = 0, cubeRotation: number = 0;


async function prepareRendering(){
    if(!(window as any).canvas){
        throw `ERROR - <canvas id="canvas"></canvas> element not found in DOM`;
    }

    (window as any).canvas = canvas;

    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;

    (window as any).gl = canvas.getContext("webgl2")!;

    if(!gl){
        throw "Error: failed to get WebGL2 context";
    }

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);


    if(!(window as any).vertexShader){
        throw `ERROR - <script id="vertexShader" type="x-shader/x-vertex"></script> not found in DOM.`;
    }
    const vertexShaderSrc = (window as any).vertexShader.innerText.trim();


    if(!(window as any).fragmentShader){
        throw `ERROR - <script id="fragmentShader" type="x-shader/x-fragment"></script> not found in DOM.`;
    }
    const fragmentShaderSrc = (window as any).fragmentShader.innerText.trim();

    shader = new Shader(vertexShaderSrc, fragmentShaderSrc)

    const modelReader = new ModelReader();
    const modelData: IModelData = modelReader.read();
    cubeMesh = new Mesh(modelData, shader);

    controller = new InputHandler();

    bottomTex = gl.createTexture();
    topTex = gl.createTexture();
    sideTex = gl.createTexture();

    const [bottom, side, top]: [HTMLImageElement, HTMLImageElement, HTMLImageElement] = await Promise.all([
        getTextureImage("src/textures/bottom.jpg"),
        getTextureImage("src/textures/side.jpg"),
        getTextureImage("src/textures/top.jpg")
    ]);


    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.bindTexture(gl.TEXTURE_2D, topTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, top);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, bottomTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bottom);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, sideTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, side);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
}

function render(t: DOMHighResTimeStamp){

    t *= .001; //ms -> secs
    dt = t - lastFrame;
    lastFrame = t;

    controller.listenKeyboardEvents();


    // Mouse
    const keys: Record<string, boolean> = controller.keys;
    //FIXME: figure out this
    const cameraSpeed = 2.5 * dt * 10;
    if(keys.w){
        vec3.scaleAndAdd(cameraPos, cameraPos, cameraFront, cameraSpeed);
    }
    if(keys.s){
        vec3.scaleAndAdd(cameraPos, cameraPos, cameraFront, -cameraSpeed);
    }


    // Rendering
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    shader.use();

    const projectionM: mat4 = mat4.create();
    mat4.perspective(projectionM, (45 * Math.PI) / 180, canvas.clientWidth / canvas.clientHeight, .1, 100.0);
    shader.uniformMatrix4fv("u_projection", projectionM);

    const viewM: mat4 = mat4.create();
    const radius = 40;
    const camX: number = Math.sin(t) * radius;
    const camZ: number = Math.cos(t) * radius;
    //TODO: how to move camera move circle while can be controlled
    // mat4.lookAt(viewM, [camX, 0, camZ], [0, 0, 0,], [0, 1, 0]);
    mat4.lookAt(viewM, cameraPos, vec3.add(vec3.create(), cameraPos, cameraFront), cameraUp);
    shader.uniformMatrix4fv('u_view', viewM);


    //textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, bottomTex);
    shader.uniform1i("u_bottomSampler", 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, sideTex);
    shader.uniform1i("u_sideSampler", 1, "Uniform texture location not found");

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, topTex);
    shader.uniform1i('u_topSampler', 2, "Uniform texture location not found");


    //cube 1
    const cube1ModelM = mat4.create();
    mat4.translate(cube1ModelM, cube1ModelM, [0, 0, 0.0]);

    mat4.rotateX(cube1ModelM, cube1ModelM, cubeRotation * 0.7);
    mat4.rotateY(cube1ModelM, cube1ModelM, cubeRotation * 0.4);
    mat4.rotateZ(cube1ModelM, cube1ModelM, cubeRotation * 1.2);

    // cube1 lighting
    const cube1NormalM = mat4.create();
    mat4.invert(cube1NormalM, cube1ModelM);
    mat4.transpose(cube1NormalM, cube1NormalM);

    shader.uniformMatrix4fv("u_normal", cube1NormalM);
    shader.uniformMatrix4fv("u_model", cube1ModelM);
    cubeMesh.draw();


    //cube 2
    const cube2ModelM = mat4.create();
    mat4.translate(cube2ModelM, cube2ModelM, [-20, 0, -20.0]);
    mat4.rotateY(cube2ModelM, cube2ModelM, Math.PI / 2 * cubeRotation);


    //cube 2 lighting
    const cube2NormalM: mat4 = mat4.create();
    mat4.invert(cube2NormalM, cube2ModelM);
    mat4.transpose(cube2NormalM, cube2NormalM);

    shader.uniformMatrix4fv("u_normal", cube2NormalM);
    shader.uniformMatrix4fv('u_model', cube2ModelM);
    cubeMesh.draw();


    //cube 3
    const cube3ModelM = mat4.create();
    mat4.translate(cube3ModelM, cube3ModelM, [20, 0, -20.0]);
    mat4.rotateY(cube3ModelM, cube3ModelM, Math.PI / 4 * cubeRotation);
    mat4.rotateZ(cube3ModelM, cube3ModelM, Math.PI / 8 * cubeRotation);

    //cube 3 lighting
    const cube3Lighting: mat4 = mat4.create();
    mat4.invert(cube3Lighting, cube3ModelM);
    mat4.transpose(cube3Lighting, cube3Lighting);

    shader.uniformMatrix4fv("u_normal", cube3Lighting);
    shader.uniformMatrix4fv('u_model', cube3ModelM);
    cubeMesh.draw();


    cubeRotation += dt;
    requestAnimationFrame(render);
}

await prepareRendering();
requestAnimationFrame(render);


