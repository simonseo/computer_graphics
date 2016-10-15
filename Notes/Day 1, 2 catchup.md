######Computer Graphics

#Day 1
##Intro
###General
- TA: Nabil Rahiman `nr83@nyu.edu` 
- Though not part of this course, I encourage you to learn about Blender and Three.js
- Lectures: Monday, Wednesdays 2:40 - 3:55 pm
- Prof Office hours: Tuesdays 3:00 - 4:00 pm (A2-187)
- TA Pffice horus: Sundays 12:00 - 12:40 pm (A2-187)


###Books
	1. Interactive Computer Graphics (Horses)
	1. Fundamentals of Computer Graphics (Tiger)

###Grading
	- 40% Assignments (weekly, theory and coding)
	- 30% Midterm (Oct. 17)
	- 30% Finals


###Topics
1. Math
	- Linear Algebra
	- 3D Transformations
	- Projections
1. Programming
	- WebGL API
	- JavaScript
	- HTML
	- GLSL ES
1. Graphics techniques
	- Lighting
	- Texturing
	- Meshing
	- Ray Tracing
	- Animation
Chpaters 1-6 in Interactive CG (Horses)

##Basic elements of CG
- Modelling: shape (geometry) - only the exterior
	- description using gemoetric primitives (AutoCAD style)
	- description using a mesh (Animated figures in games)
- Rendering: displaying a scene from a particular point of view
	- (shading, illumination, color, texture)
	- Issues: transformation, clipping, color, shadws, texture
- Animation: movement, evulution of an image over time (dynamics)
	- movements of objects, camera and change of lighting
	- Techniques: keyframing, procedural, physics-based, motion-capture

##WebGL: 3D Graphics inside web browsers
Popular technologies for 3D Graphics:

- Direct3D (Microsoft's proprietary API - mainly on Windows)
- OpenGL (by Silicon Graphics inc. in 1992. open, royalty free, used on all major platforms and applications like Maya, Blender, Photoshop, etc.)
- OpenGL ES - derivative of OpenGL for **e**mbedded **s**ystems like smartphones, tablets, gaming consoles, etc.
- WebGL
	- 1.0 is based on OpenGL ES 2.0
	- 2.0 based on OpenGl ES 3.0 released recently. Key improvement is **programmable shader functions**
	- Shader functions enable sophisticated visual effects
	- Shaders written in **GLSL** (Open*GL* *S*hading *L*anguage)
	- WebGL uses GLSL ES

##Example
###Common files
- `webgl-utils.js` standard utilities from google to set up a webgl context
- `MV.js` our matrix/vector package. Documentation on website
- `initShaders.js` functions to initialize shaders in the html file
- `initShaders2.js` functions to initialize shaders that are in separate files

###ccode
- `webgl-utils.js` - holds functions we need?
- `.clearColor(R, G, B, A)`
- `.clear(gl.COLRO_BUFFER_BIT)` - "WebGL, use the color buffer."

#Day 2
##Graphics system
- GPU is a specialized electronic circuit to speed up the computation required for graphics
- CPU and GPU are separate entities and have separate memories.
- GPU Specializes in running multiple copies of the same, usually small, programs that operate on different data.
- The main bottleneck is the communication between CPU and GPU.

##WebGL Graphics Model
1. All 3D Graphics must be done within a cube of the left handed coordinate system. (x and y is the computer screen, positive z is into the screen. w exists so that transformation of 3D is easier.)
	- anything going out is clipped.
	- Whatever is drawn into the view volum is projected to the 2D screen by dropping the z-coordinate.
1. A typical model of an object consists of a surface of interconnected triangles. When the model is transformed, we just send the matrix from the CPU to the GPU, not all the new vertices. the GPU will redo the computations.
	- "Do whatever you want in the **vertex shader** and I will run it once for each vertex - **WebGL"
1. A system of vertices are transformed to fragments(pixels) by the **rasterizer**. Each pixel can have different colors. the GPU runs a **fragment shader** on each fragment to compute its final color
	- "Do whatever you want in the **fragment shader** and I will run it once for each pixel - **WebGL"

###Life in the graphics pipleine:
1. We have raw vertices and primitves (theoretical triangle)
1. the triangle is computed by the vertex shader (programmable) and put into our view volume (3D).
1. overflown bits are clipped and lines rasterized. (inprogrammable)
1. the Fragment shader colors each pixel
1. Output merging: flattens each pixel and shows us 2D array of color-values?

###WebGL Example
WebGL functions transfer data and programs(shader) to the GPU

vertex shader:

```js
void main() {
	//gl_Posiition has four coordinates: x, y, z, w - we will see later why 4D. for now, w = 1. for 2D, z = 1
	gl_PointSize = 10.0;
	gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
}
```




##QnA & To do
- ?Shading and vertex/fragment shader == processor?
- ?Procedural animation technique
- ?Graphics pipeline or Rendering pipeline
	> graphics pipeline or rendering pipeline refers to the sequence of steps used to create a 2D raster representation of a 3D scene.
	>
	> \- *Wikipedia*

- ?VRAM, Frame buffer, 
- ? `attribute vec4 vPosition`
- ? `precision mediump float;`
- Read WebGL API
	`.viewport(x,y,x,y)` set viewport
	`.clearColor(R, G, B, A)` clear the canvas with designated color
	`.clear(gl.COLOR_BUFFER_BIT)`
	`.createBuffer()` : create a buffer
	`.bindBuffer(gl.ARRAY_BUFFER, vBuffer)` : make it current
	`.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)` : transferring data. WebGL requires premitive arrays. JS array is an object.
	`.vec4(num, num, num, num)`
	`WebGLUtils.setupWebGL(canvas);` : get rendering context for WebGL
	`initShaders(gl, "vertex-shader", "fragment-shdaer")` : initialize shaders (per-vertex operation, per-fragment operation)
	`.useProgram(program)`
	`.drawArray(g1.POINTS, start, end)` : draw
	`.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);`
	`gl_Position`
	`gl_PointSize`
	`gl_FragColor`
- Skim Chapter 1 of Angel and Shreiner
- Skim Chapter 1 and 2 of Interactive CG

