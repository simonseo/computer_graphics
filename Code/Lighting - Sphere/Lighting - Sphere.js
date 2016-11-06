"use strict";

// global variables
var gl, canvas, program;

var camera; 	// camera object
var trackball; 	// virtual trackball 

var sphere; 

var Locations;  // object containing location ids of shader variables 

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
	var Uniforms = ["M", "VP", "NT", "cameraPosition", 
			  "Ka", "Kd", "Ks", "shininess", 
			  "Ia", "Id", "Is", "lightPosition", "shading"];

	Locations = getLocations(Attributes, Uniforms); // defined in Utils.js

	// set up virtual trackball
	trackball = Trackball(canvas);

	// set up Camera
	camera = Camera(canvas); 			// defined in Camera.js
	var eye = vec3(0,0, 3);
	var at = vec3(0, 0 ,0);
	var up = vec3(0,1,0);
	camera.lookAt(eye,at,up);
	camera.setPerspective(90,1,0.1,10);

	sphere = Sphere(6);
	objInit(sphere);				// defined in Object.js
	//sphere.setModelMatrix(scalem(2,1.5,0.6));

	// set light source
	var Light = {
		position: vec3(-30,50,100),
		Ia: vec3(0.2, 0.2, 0.2),
		Id: vec3(1,1,1),
		Is: vec3(0.8,0.8,0.8)
	};

	gl.uniform3fv( Locations.lightPosition, flatten(Light.position) );
	gl.uniform3fv( Locations.Ia, flatten(Light.Ia) );
	gl.uniform3fv( Locations.Id, flatten(Light.Id) );
	gl.uniform3fv( Locations.Is, flatten(Light.Is) );

	// set material
	var Material = {	
		Ka: vec3(1.0, 1.0, 1.0),
		Kd: vec3(0.1, 0.2, 0.8),
		Ks: vec3(1.0, 1.0, 1.0),
		shininess: 500 
	};

	gl.uniform3fv(Locations.Ka, flatten(Material.Ka));
	gl.uniform3fv(Locations.Kd, flatten(Material.Kd));
	gl.uniform3fv(Locations.Ks, flatten(Material.Ks));
	gl.uniform1f(Locations.shininess, Material.shininess);

	var shading = 3.0; // flat: 1.0, Gouraud: 2.0, Phong: 3.0
	gl.uniform1f(Locations.shading, shading);


	requestAnimationFrame(render);

};

function render(now){
	
	requestAnimationFrame(render);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var TB = trackball.getMatrix();
	var TBN = trackball.getNormalTransformationMatrix(); 
	
	var M = mult(TB,sphere.getModelMatrix());
	gl.uniformMatrix4fv(Locations.M, gl.FALSE, flatten(M));

	var VP = camera.getMatrix(); 
	gl.uniformMatrix4fv(Locations.VP, gl.FALSE, flatten(VP));	

	var cameraPosition = camera.getFrame().e;
	gl.uniform3fv(Locations.cameraPosition, flatten(cameraPosition));

	var NT = mult(TBN,sphere.getNormalTransformationMatrix());
	gl.uniformMatrix3fv(Locations.NT, gl.FALSE, flatten(NT));

	sphere.draw();

}



//-------------------------- CREATE SPHERE ----------------------------------- 

function Sphere(n){
	// n is the number of times to 
	// subdivide the faces recursively.

	var S = { 	positions: [],
		 	  	normals: [], 
		 	};

	var s2 = Math.sqrt(2);
	var s6 = Math.sqrt(6);

	var va = vec3(0,0,1);
	var vb = vec3(0, 2*s2/3, -1/3);
	var vc = vec3(-s6/3, -s2/3, -1/3);
	var vd = vec3(s6/3, -s2/3, -1/3);

	tetrahedron(va, vb, vc, vd, n);


	function tetrahedron(a,b,c,d,n){
		divideTriangle(d,c,b,n);
		divideTriangle(a,b,c,n);
		divideTriangle(a,d,b,n);
		divideTriangle(a,c,d,n);
	}

	function divideTriangle(a,b,c,n){
		if(n>0){
			var ab = normalize(mix(a,b,0.5));
			var ac = normalize(mix(a,c,0.5));
			var bc = normalize(mix(b,c,0.5));

			n--;

			divideTriangle(a,ab,ac,n);
			divideTriangle(ab,b,bc,n);
			divideTriangle(bc,c,ac,n);
			divideTriangle(ab,bc,ac,n);
		}
		else{
			triangle(a,b,c);
		}
	}

	function triangle(a,b,c){
		var norm = normalize(cross(subtract(b,a),
		                     subtract(c,a)));
		S.positions.push(a,b,c);
		S.normals.push(norm, norm, norm);
		//S.normals.push(a,b,c);
	}


	return S;
}
