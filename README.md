# WebGL Cube

## Overview
This is a simple WebGL2 3D cube implementation with the following features for studying Graphics Programming:
- Vertex passing to GPU via "Element buffer"
- Shader program
- Perspective projection
- Phong shading

## Building

The project uses "Esbuild" and has two Node scripts for the development environment:
1. **build.mts**
2. **serve.mts**

### build.mts
Provides bundling and file watcher functionality

### serve.mts
Provides local development server functionality

## How to Run

There are various npm scripts configured in *package.json*:
1. ```npm run build``` - bundles the project
2. ```npm run build-watch``` - starts file watcher and bundles project whenever any file changes
3. ```npm run serve``` - starts development server in root directory

For development, first run **build-watch** then **serve** ( <span style="color: red">ORDER MATTERS!</span> )