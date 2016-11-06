"use strict";

// global variables
var gl, canvas, program;
var vBuffer, cBuffer;

var trackball;

var uM; // location of modelling matrix 

window.onload = function init() {
			// Set up WebGL
			canvas = document.getElementById("gl-canvas");
			gl = WebGLUtils.setupWebGL( canvas );
			if(!gl){alert("WebGL setup failed!");}
			
			// set clear color 
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			
			//Enable depth test
			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL); // since WebGL uses left handed
			gl.clearDepth(1.0); 	 // coordinate system
			
			// Load shaders and initialize attribute buffers
			program = initShaders( gl, "vertex-shader", "fragment-shader" );
			gl.useProgram( program );

			// Load data into a buffer
			var s = 0.3;
			var a = vec3(-s,-s,-s);
			var b = vec3(s,-s,-s);
			var c = vec3(s,s,-s);
			var d = vec3(-s,s,-s);		
			var e = vec3(0,0,2*s);
			var vertices = [a,b,e,b,c,e,c,d,e,d,a,e,a,b,c,a,c,d];

			var R = vec3(1,0,0);
			var G = vec3(0,1,0);
			var B = vec3(0,0,1);
			var X = vec3(0.0,0.5,0.5); 
			var Y = vec3(0.5, 0, 0.5);
			var colors = [R,R,R,G,G,G,B,B,B,X,X,X,Y,Y,Y,Y,Y,Y];

			vBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);		

			cBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
						
			// Do shader plumbing
			var vPosition = gl.getAttribLocation(program, "vPosition");
			gl.enableVertexAttribArray(vPosition);

			var vColor = gl.getAttribLocation(program,"vColor");
			gl.enableVertexAttribArray(vColor);

			gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);
			gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER,cBuffer);
			gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);

			// set up virtual trackball
			trackball = Trackball(canvas); 
			
			//get location of modelling matrix
			uM = gl.getUniformLocation(program, "M");

			requestAnimationFrame(render);

};

function render(now){
	requestAnimationFrame(render);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	//set modelling matrix 
	var M = trackball.getMatrix();
	gl.uniformMatrix4fv(uM, gl.FALSE, flatten(M));

	//draw pyramid
	gl.drawArrays(gl.TRIANGLES,0,18);
}

