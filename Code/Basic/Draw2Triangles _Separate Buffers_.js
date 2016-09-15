"use strict";
var gl; // global variable

window.onload = function init() {
			// Set up WebGL
			var canvas = document.getElementById("gl-canvas");
			gl = WebGLUtils.setupWebGL( canvas );
			if(!gl){alert("WebGL setup failed!");}
			
			// Clear canvas
			gl.clearColor(0.0, 1.0, 0.0, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			
			// Load shaders and initialize attribute buffers
			var program = initShaders( gl, "vertex-shader", "fragment-shader" );
			gl.useProgram( program );
			
			// set up first buffer
			var vertices1 = [ 0.2, 0.4, 0.4, -0.7, 0.6, 0.9];
			var vBuffer1 = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer1);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices1), gl.STATIC_DRAW);
			
			//set up second buffer
			var vertices2 = [0.1, 0.6, -0.3, 0.9, -0.4, 0.5];
			var vBuffer2 = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2); 
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);

			// Do shader plumbing
			var vPosition = gl.getAttribLocation(program, "vPosition");
			gl.enableVertexAttribArray(vPosition);
			

			//Draw first triangle
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer1); //set appropriate buffer as current
			gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); // uses currently buffer
			gl.drawArrays(gl.TRIANGLES,0,3); 

			//Draw second triangle
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2); //set appropriate buffer as current
			gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); // uses currently buffer
			gl.drawArrays(gl.TRIANGLES,0,3); 
};
