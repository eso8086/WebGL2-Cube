//FIXME: this is just a mock implementation

const cubeVertices = [
    // Front face
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
];

const cubeNormals = [
    // Front
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

    // Back
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

    // Top
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

    // Bottom
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

    // Right
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

    // Left
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
];

const cubeUV = [
    // Front
    0.0, 0.0,  1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Back
    1.0, 0.0, 1.0, 1.0, 0.0, 1.0,  0.0, 0.0,
    // Top
    0.0, 1.0,  0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    // Bottom
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    // Right
    1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
    // Left
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
];

const cubeIndices = [
    0, 1, 2, 2, 3, 0,       // Front face
    4, 5, 6, 6, 7, 4,       // Back face
    8, 9, 10, 10, 11, 8,    // Top face
    12, 13, 14, 14, 15, 12, // Bottom face
    16, 17, 18, 18, 19, 16, // Right face
    20, 21, 22, 22, 23, 20  // Left face
];

export interface IModelData {
    buffer: Float32Array,
    indices: Uint16Array
}

export default class ModelReader{
    public read(): IModelData  {
        const buffer = new Float32Array(cubeVertices.length + cubeNormals.length + cubeUV.length);
        const indices  = new Uint16Array(cubeIndices.length);
        buffer.fill(-100);
        // (vertex_pos, uv) combination should be provided. this means these properties count should be same in the data.
        // PF stands for "per face"
        const totalVertexPFCount: number = cubeVertices.length / 3;
        const totalUVPFCount: number = cubeUV.length / 2;

        // check data is valid.

        if(totalVertexPFCount !== totalUVPFCount){
            throw `ERROR - Model data is invalid. (pos, uv) per face combination should be provided.\nTotal Vertex Per Face: ${totalVertexPFCount}\nTotal UV Per Face: ${totalUVPFCount}`;
        }
        //after this point can assume all PF are equal to totalVertexPFCount


        const maxIndex: number = Math.max(...cubeIndices);
        // assuming indexing starts from 0
        if(maxIndex >= totalVertexPFCount){
            throw `ERROR - Invalid model index usage.\nMax Possible Index: ${totalVertexPFCount - 1}\nMax Model Index: ${maxIndex}`;
        }

        indices.set(cubeIndices);

        let vec3I = 0, vec2I = 0, offset = 0;
        while(vec3I < cubeVertices.length){
            buffer.set([
                cubeVertices[vec3I], cubeVertices[vec3I+1], cubeVertices[vec3I+2],
                cubeNormals[vec3I], cubeNormals[vec3I+1], cubeNormals[vec3I+2],
                cubeUV[vec2I], cubeUV[vec2I+1],
            ], offset);

            vec3I+=3;
            vec2I+=2;
            offset+=3+3+2;
        }

        return {buffer, indices};
    }

}