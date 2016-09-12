"use strict";

// global variables
var gl; 
var vertices, vBuffer;
var colors, cBuffer;
var ut;

window.onload = function init() {
			// Set up WebGL
			var canvas = document.getElementById("gl-canvas");
			gl = WebGLUtils.setupWebGL( canvas );
			if(!gl){alert("WebGL setup failed!");}
			
			// Clear canvas
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			
			// Load shaders and initialize attribute buffers
			var program = initShaders( gl, "vertex-shader", "fragment-shader" );
			gl.useProgram( program );
			
			// Load data into a buffer
			vertices = [];
			var r =0.7;
			for(var t = 0; t <  2*Math.PI; t+=2*Math.PI/3){
				vertices.push(r*Math.cos(t), r*Math.sin(t));
			}

			vBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
			colors = [1,0,0, 0,1,0, 0,0,1];
			cBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

			// Do shader plumbing
			var vPosition = gl.getAttribLocation(program, "vPosition");
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			console.log(vPosition);
			gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(vPosition);

			var vColor = gl.getAttribLocation(program, "vColor");
			gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer); 
			console.log(vColor);
			console.dir(vColor);
			gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(vColor);

			// Note that the function vertexAttribPointer needs to know
			// the buffer from which the data for the variable (referred to
			// by the first argument) comes from. We therefore need to 
			// have the appropriate buffer bound as the current buffer.

			ut = gl.getUniformLocation(program, "t");
			
			requestAnimationFrame(render);
			
};

function render(now){
			requestAnimationFrame(render);
			
			var t = -0.5*now*0.001;
			gl.uniform1f(ut,t);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLES,0,3); 
}
