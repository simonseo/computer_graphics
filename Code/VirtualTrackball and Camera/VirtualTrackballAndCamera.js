"use strict";

// global variables
var gl; 
var canvas;
var program;
var vBuffer, cBuffer, iBuffer;

var cubeModelMatrix, floorModelMatrix;
var camera; // camera object
var trackball; // virtual trackball 


var uMVP; // location of Model-View-Projection matrix

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
			var vertices = [];
			var colors = [];
			var indices = [];

			var R = vec3(1,0,0);
			var G = vec3(0,1,0);
			var B = vec3(0,0,1);

			// Cube vertices
			var i,j;
			for(i=0; i< 8; ++i){
				var v = vec3();
				for(j = 0; j <3; ++j){
					v[j] = (i>>j) & 1;
				}
				vertices.push(v);
				colors.push(B);
			}
             
			var quad = function (a,b,c,d){
				indices.push(a,b,c,a,c,d);
			}
			quad(1,0,2,3);  quad(4,5,7,6); 
			quad(5,1,3,7); quad(0,4,6,2);
			quad(6,7,3,2); quad(0,1,5,4);

			var s = 0.2;
			cubeModelMatrix = mult(scalem(s,s,s), translate(-0.5,0,-0.5));
			cubeModelMatrix = mult(translate(0,-0.3,0), cubeModelMatrix);

			// floor 
			var l = 0.6;
			vertices.push( vec3(-l,0,-l), vec3(l,0,-l), vec3(l,0,l), vec3(-l,0,l) );
			colors.push(R,R,R,R);
			quad(8,9,10,11);
			floorModelMatrix = translate(0,-0.3,0);


			// get location of MVP
			uMVP = gl.getUniformLocation(program,"MVP");


			vBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
			

			cBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);


			iBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

						
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


			// set up Camera
			camera = Camera(canvas); 
			var eye = vec3(0,0, 3);
			var at = vec3(0, 0 ,0);
			var up = vec3(0,1,0);
			camera.lookAt(eye,at,up);
			camera.setPerspective(90,1,0.1,10);
					
			requestAnimationFrame(render);

};

function render(now){

	var MVP;

	requestAnimationFrame(render);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


	//draw cube
	var t = fmod(now/1000,2);
	var h;
	if(t < 1){
		h = 1-t*t;
	}
	else{
		h = 1 - (2-t)*(2-t);
	}

	var tbMatrix = trackball.getMatrix();
	var cameraMatrix = camera.getMatrix();
	var M =  mult(cameraMatrix, tbMatrix); // combining camera and trackball matrices

	MVP = mult( M, mult(translate(0,h,0), cubeModelMatrix) );
	gl.uniformMatrix4fv(uMVP, gl.FALSE, flatten(MVP));
	
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE,0);

	//draw floor
	MVP = mult(M, floorModelMatrix);
	gl.uniformMatrix4fv(uMVP, gl.FALSE, flatten(MVP));
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 36);

}

function fmod(a,b) { 
	return a - Math.floor(a / b) * b;
}




