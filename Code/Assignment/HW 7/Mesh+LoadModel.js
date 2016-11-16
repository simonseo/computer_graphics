"use strict";

// global variables
var gl, canvas, program;

var camera; 	// camera object
var trackball; 	// virtual trackball 

var Locations;  // object containing location ids of shader variables 
var obj = Grid(33, 5.5); // defined in Object.js: creates a square grid mesh

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
	var Attributes = ["vPosition", "vNormal"];
	var Uniforms = ["M", "VP", "NT", "cameraPosition", "time",
			  "Ka", "Kd", "Ks", "shininess", 
			  "Ia", "Id", "Is", "lightPosition"];

	Locations = getLocations(Attributes, Uniforms); // defined in Utils.js

	// set up virtual trackball
	trackball = Trackball(canvas);

	// set up Camera
	camera = Camera(canvas); // Camera(...) is defined in Camera.js
	var eye = vec3(0,0, 5);
	var at = vec3(0, 0 ,0);
	var up = vec3(0,1,0);
	camera.lookAt(eye,at,up);
	camera.setPerspective(90,1,0.1,10);

	objInit(obj);	// objInit(...) is defined in Object.js

	// set light source
	var Light = {
		position: vec3(0,5,10),
		Ia: vec3(0.2, 0.2, 0.2),
		Id: vec3(0.5,0.5,0.5),
		Is: vec3(0.8,0.8,0.8)
	};

	gl.uniform3fv( Locations.lightPosition, flatten(Light.position) );
	gl.uniform3fv( Locations.Ia, flatten(Light.Ia) );
	gl.uniform3fv( Locations.Id, flatten(Light.Id) );
	gl.uniform3fv( Locations.Is, flatten(Light.Is) );

	// set material
	var Material = {	
		Ka: vec3(1.0, 1.0, 1.0),
		Kd: vec3(Math.random(), Math.random(), Math.random()),
		Ks: vec3(1.0, 1.0, 1.0),
		shininess: 4.54*Math.random() 
	};

	gl.uniform3fv(Locations.Ka, flatten(Material.Ka));
	gl.uniform3fv(Locations.Kd, flatten(Material.Kd));
	gl.uniform3fv(Locations.Ks, flatten(Material.Ks));
	gl.uniform1f(Locations.shininess, Material.shininess);

	requestAnimationFrame(render);

};

function render(now){
	
	requestAnimationFrame(render);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.uniform1f(Locations.time, 0.001*now);

	var TB = trackball.getMatrix();
	var TBN = trackball.getNormalTransformationMatrix(); 
	
	var M = mult(TB,obj.getModelMatrix());
	gl.uniformMatrix4fv(Locations.M, gl.FALSE, flatten(M));

	var VP = camera.getMatrix(); 
	gl.uniformMatrix4fv(Locations.VP, gl.FALSE, flatten(VP));	

	var cameraPosition = camera.getFrame().e;
	gl.uniform3fv(Locations.cameraPosition, flatten(cameraPosition));

	var NT = mult(TBN,obj.getNormalTransformationMatrix());
	gl.uniformMatrix3fv(Locations.NT, gl.FALSE, flatten(NT));

	obj.draw();
}

