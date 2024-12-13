# WebGL Cube

## Overview
This is a simple WebGL2 3D cube implementation with the following features:
- VBO, EBO, VAO.
- Shader Program
- Projection(Perspective)
- Phong shading

Project link: https://eso8086.github.io/WebGL2-Cube

## How to Run

Project uses Esbuild for bundling application. By default minification is turned off. This is because for better development experience and debugging.
```serve.mts``` file is esbuild script file to configure build process. for more development options checkout npm scripts.

#### Steps to follow:
first run ```npm run build-serve``` to compile esbuild script<br/>
then run
```npm run serve```

![scene.png](scene.png)
