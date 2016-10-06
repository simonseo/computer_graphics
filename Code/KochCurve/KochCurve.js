"use strict";

// global variables
var gl; 
var vertices;

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
			var levels = 10;
			vertices = [-1,0]; // push leftmost vertex (-1,0) into the array
			koch(-1,0,1,0, levels);

			var vBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
			// Do shader plumbing
			var vPosition = gl.getAttribLocation(program, "vPosition");
			gl.enableVertexAttribArray(vPosition);
			gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
						
			//Draw 
			gl.drawArrays(gl.LINE_STRIP,0,vertices.length/2); 
};

function koch(x1, y1, x2, y2, l){
  if(l===0){
  	vertices.push(x2,y2);
  }
  else{
  	var x3 = (2*x1+x2)/3;
  	var y3 = (2*y1+y2)/3;
  	var x4 = (x1+x2)/2 + (y1-y2)*Math.sqrt(3)/6; 
  	var y4 = (y1+y2)/2 + (x2-x1)*Math.sqrt(3)/6;
   	var x5 = (x1+2*x2)/3;
  	var y5 = (y1+2*y2)/3;
   	koch(x1,y1,x3,y3,l-1);
	koch(x3,y3,x4,y4,l-1);
  	koch(x4,y4,x5,y5,l-1);
  	koch(x5,y5,x2,y2,l-1);
  }

}
