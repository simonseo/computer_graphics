"use strict";

// global variables
var gl, canvas, program, grid, cube, terrain, teapot, cubemap;

var camera; 		// camera object
var trackball; 	// virtual trackball 
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
	var Attributes = [];
	var Uniforms = ["VP", "VIP", "TB", "TBN", "cameraPosition", "cameraProjection", "Ia", "Id", "Is", "lightPosition", "cube", "terrain", "teapot"];

	Locations = getLocations(Attributes, Uniforms); // defined in Utils.js
 
	// set up virtual trackball
	trackball = Trackball(canvas);

	// set up Camera
	camera = Camera(); // Camera(...) is defined in Camera.js
	var eye = vec3(0,0,0);
	var at = vec3(0,0,-100);
	var up = vec3(0,1,0);
	camera.lookAt(eye,at,up);
	camera.setPerspective(90,1,0.1,10);


	// set light source
	var Light = {
		position: vec3(0.1,0,0),
		Ia: vec3(0.3, 0.3, 0.3),
		Id: vec3(1,1,1),
		Is: vec3(1,1,1)
	};

	gl.uniform3fv( Locations.lightPosition, flatten(Light.position) );
	gl.uniform3fv( Locations.Ia, flatten(Light.Ia) );
	gl.uniform3fv( Locations.Id, flatten(Light.Id) );
	gl.uniform3fv( Locations.Is, flatten(Light.Is) );

	// set up scene	
	cubemap = Cube();
	cubemap.diffuseMap = "cubemap.jpg";
	objInit(cubemap);
	cubemap.setModelMatrix(rotateX(90));

	// configure the cube map for the teapot
	var numVertices  = 36;
	var texSize = 4;
	var numChecks = 2;

	var flag = true;

	var red = new Uint8Array([255, 0, 0, 255]);
	var green = new Uint8Array([0, 255, 0, 255]);
	var blue = new Uint8Array([0, 0, 255, 255]);
	var cyan = new Uint8Array([0, 255, 255, 255]);
	var magenta = new Uint8Array([255, 0, 255, 255]);
	var yellow = new Uint8Array([255, 255, 0, 255]);

	var cubeMap = gl.createTexture();


	gl.activeTexture( gl.TEXTURE3 );
	gl.uniform1i(gl.getUniformLocation(program, "texMap"), 3);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);

  gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X , 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, red);
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X , 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, green);
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y , 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, blue);
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y , 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, cyan);
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z , 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, yellow);
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z , 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, magenta);

  gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MIN_FILTER,gl.NEAREST);

	// Grid code from previous assignment
	// n ( >=2 ) is the number of vertices in a row or column.
	// The function returns an n x n grid.
	function Grid(n){
		var i,j, idx;
		var G = {
			positions: [],
			triangles: [],
			texCoords: []
		};

		for(i=0; i<n; ++i){
			for(j=0; j<n; ++j){
				var rawHeight = gridHeights[n*i+j][2];
				G.positions.push( [-1+2*i/(n-1), -1+2*j/(n-1), rawHeight/2000 - 0.12] );
			}
		}

		for(i=0; i<n-1; ++i){
			for(j=0; j<n-1; ++j){
				idx = n*i + j;
				G.triangles.push([idx, idx+n, idx+n+1], [idx, idx+n+1, idx+1]);
			}
		}

		for(i=0; i<n; ++i){
			for(j=0; j<n; ++j){
				idx = n*i + j;
				G.texCoords.push( [i/(n-1)*n, j/(n-1)*n]);
			}
		}

		return G;
	}

	// set up the grid
	var n = 255;
	grid = Grid(n);
	grid.diffuseMap = "moss-diffuse.jpg";
	grid.normalMap = "moss-normal.jpg";
	grid.heightMap = "heightmap.jpg";
	objInit(grid);
	var m = mult(scalem(100,100,100),rotateX(90));
	m = mult(translate(0,0,0), m);
	grid.setModelMatrix(m);

	// set up the teapot
	teapot.diffuseMap = "cubemap.jpg";
	teapot.material = {
		Ka: vec3(0.6, 0.1, 0.5),
		Kd: vec3(0.7, 0.1, 0.6),
		Ks: vec3(0.8, 0.7, 0.8),
		shininess: 500
	};
	objInit(teapot);
	var m = mult(scalem(0.003,0.003,0.003),rotateX(0));
	m = mult(translate(0,-0.2,-1), m);
	teapot.setModelMatrix(m);

	requestAnimationFrame(render);
};

function render(now){
	requestAnimationFrame(render);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var TB = trackballWorldMatrix(trackball, camera);
	gl.uniformMatrix4fv(Locations.TB, gl.FALSE, flatten(TB));

	var TBN = normalTransformationMatrix(TB); 
	gl.uniformMatrix3fv(Locations.TBN, gl.FALSE, flatten(TBN));
	
	var VP = camera.getMatrix(); 
	gl.uniformMatrix4fv(Locations.VP, gl.FALSE, flatten(VP));	

	var VIP = inverse(VP);
	gl.uniformMatrix4fv(Locations.VIP, gl.FALSE, flatten(VIP));	

	var cameraProjection = camera.getProjectionMatrix();
	gl.uniformMatrix4fv(Locations.cameraProjection, gl.FALSE, flatten(cameraProjection));

	var cameraPosition = camera.getFrame().e;
	gl.uniform3fv(Locations.cameraPosition, flatten(cameraPosition));

	cubemap.setModelMatrix(mult(translate(cameraPosition), rotateX(90)));
	gl.uniform1f(Locations.cube, 1.0);
	cubemap.draw();
	gl.uniform1f(Locations.cube, 0.0);

	gl.uniform1f(Locations.terrain, 1.0);
	gl.depthMask(false);
	grid.draw();
	gl.uniform1f(Locations.terrain, 0.0);
	gl.depthMask(true);

	var normalMatrix = teapot.getModelMatrix();

	gl.uniform1f(Locations.teapot, 1.0);
	// if the depth mask is disabled, the teapot becomes transparent as the depth buffer is overwritten
	// gl.depthMask(false);
	teapot.draw();
	gl.uniform1f(Locations.teapot, 0.0);
}

//-------------------------- CREATE SPHERE ----------------------------------- 
// create sphere with texture coordinates
function Sphere(){

	var S = {
		positions: [],
		normals: [],
		texCoords: [],
		triangles: [],
		material: {
			Ka: vec3(0.1, 0.1, 0.1),
			Kd: vec3(0.7, 0.1, 0.6),
			Ks: vec3(0.1, 0.1, 0.1),
			shininess: 1
		}
	};

	var N = 100; // # latitudes (excluding poles) = N, # longitudes = 2*N+3
	var i, j;

	S.normals = S.positions; // for unit sphere with center (0,0,0), normal = position

	S.positions[0] = (vec3(0,0,1)); // north pole
	S.positions[(2*N+3)*N +1] = vec3(0,0,-1); // south pole
	
	// fill positions array
	for(i=0; i< N; ++i){ 
		for(j=0; j< 2*N+3; ++j){
			S.positions[index(i,j)] = pos(i,j);
		}
	}

	// fill triangles array
	for(j = 0; j< 2*N+2; ++j) {
		// north pole triangle fan
		S.triangles.push( vec3(0, index(0,j), index(0,j+1)) ); 
		// south pole tri fan
		S.triangles.push( vec3( index(N-1,j), (2*N+3)*N+1, index(N-1,j+1)) ); 
	}
	
	// the rest of the quads
	for(i = 0; i<N-1; ++i){ 
		for(j=0; j< 2*N+2; ++j){
			S.triangles.push( vec3(index(i,j), index(i+1,j), index(i+1,j+1)) );
			S.triangles.push( vec3(index(i,j), index(i+1, j+1), index(i,j+1)) );	
		}
	}
	
	// fill texCooords array
	for(i = 0; i < S.positions.length; ++i){ 	
		S.texCoords.push(textureCoords(S.positions[i])); 
	}

	function index(i,j){
		return i*(2*N+3) + j + 1;
	}

	function pos(i, j){
		var theta = (i+1)*Math.PI/(N+1);
		var phi = j*Math.PI/(N+1);
		return vec3(Math.sin(theta)*Math.cos(phi), 
					Math.sin(theta)*Math.sin(phi), 
					Math.cos(theta));
	}
	
	function textureCoords(pos){
		var x = pos[0];
		var y = pos[1];
		var z = pos[2];
		var theta = Math.atan2(Math.sqrt(x*x+y*y), z);
		var phi = Math.atan2(y,x);
		if(phi<0){phi += 2*Math.PI; }
		var t = vec2(phi/(2*Math.PI), 1 - theta/Math.PI);
		return t;
	}
	
	return S;
}

//-------------------------- CREATE SQUARE ----------------------------------- 

function Square(){
// create sphere with texture coordinates
	var a = vec3(-1,-1,0);
	var b = vec3(1,-1,0);
	var c = vec3(1,1,0);
	var d = vec3(-1,1,0);
	var n = vec3(0,0,1);
	var ta = vec2(0,0);
	var tb = vec2(1,0);
	var tc = vec2(1,1);
	var td = vec2(0,1);

	var S = {
		positions: [a,b,c,d],
  	normals:   [n,n,n,n], 
  	texCoords: [ta,tb,tc,td],
  	triangles: [[0,1,2],[0,2,3]],
  	material: {	
			Ka: vec3(0.2, 0.2, 0.2),
			Kd: vec3(0.0, 1.0, 0.5),
			Ks: vec3(0.0, 0.0, 0.0),
			shininess: 10
  	}
	};

	return S;
}


//-------------------------- CREATE CUBE ----------------------------------- 

function Cube(){
// create sphere with texture coordinates
	var l = 5;
	var a = vec3(-l,-l,-l);
	var b = vec3( l,-l,-l);
	var c = vec3( l, l,-l);
	var d = vec3(-l, l,-l);
	var e = vec3(-l,-l, l);
	var f = vec3( l,-l, l);
	var g = vec3( l, l, l);
	var h = vec3(-l, l, l);

	var n_top = vec3(0,-1,0);
	var n_bottom = vec3(0,1,0);
	var n_left = vec3(1,0,0);
	var n_right = vec3(-1,0,0);
	var n_front = vec3(0,0,-1);
	var n_back = vec3(0,0,1);
	
	var ta = vec2(0,0);
	var tb = vec2(1,0);
	var tc = vec2(1,1);
	var td = vec2(0,1);

	var S = {
		positions: [a,a,a,b,b,b,c,c,c,d,d,d,e,e,e,f,f,f,g,g,g,h,h,h],
  	texCoords: [
  		vec2(0.25, 0.00),  vec2(0.00, 0.33),  vec2(1.00, 0.33),  vec2(0.50, 0.00),
			vec2(0.75, 0.33),  vec2(0.75, 0.33),  vec2(0.50, 0.33),  vec2(0.50, 0.33),
			vec2(0.50, 0.33),  vec2(0.25, 0.33),  vec2(0.25, 0.33),  vec2(0.25, 0.33),
			vec2(0.25, 1.00),  vec2(0.00, 0.66),  vec2(1.00, 0.66),  vec2(0.50, 1.00),
			vec2(0.75, 0.66),  vec2(0.75, 0.66),  vec2(0.50, 0.66),  vec2(0.50, 0.66),
			vec2(0.50, 0.66),  vec2(0.25, 0.66),  vec2(0.25, 0.66),  vec2(0.25, 0.66)
		], 
  	triangles: [
  		[ 0, 3, 6], [ 0, 6, 9],	// bottom
			[18,15,12], [12,21,18],	// top
			[13, 1,10], [13,10,22],	// left
			[ 4,16,19], [ 4,19, 7],	// right
			[11, 8,20], [11,20,23], // back
			[14,17, 5], [14, 5, 2]	// front
		],
  	material: {	
			Ka: vec3(0.9, 0.6, 0.7),
			Kd: vec3(0.7, 1.0, 0.5),
			Ks: vec3(0.9, 0.9, 0.9),
  		shininess: 10
  	}
	};
	return S;
}

