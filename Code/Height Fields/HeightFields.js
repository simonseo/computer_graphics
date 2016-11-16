"use strict";

// global variables
var gl, canvas, program;

var camera; 	// camera object
var trackball; 	// virtual trackball 

var Locations;  // object containing location ids of shader variables 

var grid;

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

	// Get Locations of attributes and Locations
	var Attributes = [];
	var Uniforms = ["time", "TB", "TBN", "VP", "cameraPosition",  
			  "Ia", "Id", "Is", "lightPosition"];

	Locations = getLocations(Attributes, Uniforms); // defined in Utils.js

	// set up virtual trackball
	trackball = Trackball(canvas);

	// set up Camera
	camera = Camera(canvas); // Camera(...) is defined in Camera.js
	var eye = vec3(0,0.9,0.9);
	var at = vec3(0, 0 ,0);
	var up = vec3(0,1,0);
	camera.lookAt(eye,at,up);
	camera.setPerspective(90,1,0.1,10);

	grid = Grid(200);	
	// set material
	grid.material = {	
		Ka: vec3(1.0, 1.0, 1.0),
		Kd: vec3(0.25, 0.71, 0.98),
		Ks: vec3(1.0, 1.0, 1.0),
		shininess: 100 
	};
	objInit(grid);	// objInit(...) is defined in Object.js
	grid.setModelMatrix(rotateX(90));

	// set light source
	var Light = {
		position: vec3(0,5,-3),
		Ia: vec3(0.2, 0.2, 0.2),
		Id: vec3(0.8,0.8,0.8),
		Is: vec3(0.2,0.2,0.2)
	};

	gl.uniform3fv( Locations.lightPosition, flatten(Light.position) );
	gl.uniform3fv( Locations.Ia, flatten(Light.Ia) );
	gl.uniform3fv( Locations.Id, flatten(Light.Id) );
	gl.uniform3fv( Locations.Is, flatten(Light.Is) );

	requestAnimationFrame(render);

};

function render(now){
	
	requestAnimationFrame(render);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var time = now/1000;
	gl.uniform1f(Locations.time, time);
	
	var TB = trackballWorldMatrix(trackball,camera);
	gl.uniformMatrix4fv(Locations.TB, gl.FALSE, flatten(TB));

	var TBN = normalTransformationMatrix(TB);
	gl.uniformMatrix3fv(Locations.TBN, gl.FALSE, flatten(TBN));

	var VP = camera.getMatrix(); 
	gl.uniformMatrix4fv(Locations.VP, gl.FALSE, flatten(VP));	

	var cameraPosition = camera.getFrame().e;
	gl.uniform3fv(Locations.cameraPosition, flatten(cameraPosition));

	grid.draw();
}


function Grid(n){
	// n ( >=2 ) is the number of vertices in a row or column.
	// The function returns an n x n grid.

	var i,j, idx;

	var G = {
		positions: [],
		triangles: []
	};


	for(i=0; i<n; ++i){
		for(j=0; j<n; ++j){
			G.positions.push( [-1+2*i/(n-1), -1+2*j/(n-1), 0] );
		}
	}

	for(i=0; i<n-1; ++i){
		for(j=0; j<n-1; ++j){
			idx = n*i + j;
			G.triangles.push([idx, idx+n, idx+n+1], [idx, idx+n+1, idx+1]);
		}
	}

	return G;
}
