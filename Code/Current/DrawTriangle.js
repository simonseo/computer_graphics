"use strict";
var gl; // global variable

window.onload = function init() {
			// Set up WebGL
			var canvas = document.getElementById("gl-canvas");
			gl = WebGLUtils.setupWebGL( canvas ); //gives access to drivers (GPU)
			if(!gl){alert("WebGL setup failed!");}
			
			// gl.viewport( 0, 0, 1.5*canvas.width, 1.5*canvas.height );

			// Clear canvas
			gl.clearColor(51/255,51/255,51/255, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			
			// Load shaders and initialize attribute buffers
			var program = initShaders( gl, "vertex-shader", "fragment-shader" );
			gl.useProgram( program );
			
			// Load data into a buffer
			var s = 0.4 / 2;
			var squareVertices = [ s, s, -s, s, -s, -s, -s, -s, s, -s, s, s, ]; 
			//clipping occurs on the right side because 1 is the limit
			var vBuffer = gl.createBuffer(); // to put data into separate buffers, create separate buffers multiple times
			console.log(gl.ARRAY_BUFFER);
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer); //binds vBuffer to gl.ARRAY_BUFFER
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertices), gl.STATIC_DRAW);
			
			// Do shader plumbing
			// This single shader is used for multiple drawings.
			var vPosition = gl.getAttribLocation(program, "vPosition"); //"vPosition" is a variable inside the GPU.
			console.log(vPosition);
			gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); //2 notes that this is a xy coordinate
			gl.enableVertexAttribArray(vPosition);// This single shader is used for multiple drawings.
			
			//Draw a triangle
			gl.drawArrays(gl.TRIANGLES,0,6);   // note that the last argument is 3, not 1
			                                   // this draws the vertices in the buffer. 
			


			//Draw a second shape
			var triangleVertices = [ -1, 1, -1, -0.5, -0.5, 1 ]; 
			vBuffer = gl.createBuffer(); 
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			console.log(gl.ARRAY_BUFFER);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
			
			var vPosition = gl.getAttribLocation(program, "vPosition");
			gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(vPosition);
			
			gl.drawArrays(gl.TRIANGLES,0,3);

};
