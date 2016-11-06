"use strict";

// global variables
var gl, program, canvas;
var camera, trackball;
var Locations;
var scene;

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
			var Attributes = ["vPosition", "vNormal", "vColor"];
			var Uniforms = ["M", "VP", "NT", "TB", "TBNT", "cameraPosition"];
			Locations = getLocations(Attributes, Uniforms); // defined in Utils.js	
			// lighting details are hard-coded in the shaders

			// set up trackball
			trackball = Trackball(canvas);
							
			// set up Camera 
			camera = Camera(canvas);
			var eye = vec3(0,0.7, 0.7);
			var at = vec3(0, 0 ,0);
			var up = vec3(0,1,0);
			camera.lookAt(eye, at, up);
			camera.setPerspective(90,1,0.1,10);

			//set up scene
			scene = Scene();

			requestAnimationFrame(render);
};


function Scene(){

			var scene = {}; // Object to be returned

			var cubeModelMatrix, floorModelMatrix;

			var vertices = [];
			var colors = [];
			var normals = [];

			var R = vec3(1,0,0);
			var G = vec3(0,1,0);
			var B = vec3(0,0,1);
			var X = vec3(1,0.1,0);


			var dv = []; // stores all distinct vertices
			// Put cube vertices in dv
			var i,j;
			for(i=0; i< 8; ++i){
				var v = vec3();
				for(j = 0; j <3; ++j){
					v[j] = (i>>j) & 1;
				}
				dv.push(v);
			}
			dv.push( vec3(-1,0,-1), vec3(1,0,-1), vec3(-1,0,1),  vec3(1,0,1) );
             
			var quad = function (a,b,c,d, col){
				vertices.push(dv[a],dv[b],dv[c],dv[a],dv[c],dv[d]);
				colors.push(col,col,col,col,col,col);

				var u = subtract(dv[b], dv[a]);
				var v = subtract(dv[d], dv[a]);
				var n = normalize(cross(u,v));
				normals.push(n,n,n,n,n,n);

			}
			// quads for the cube
			quad(1,0,2,3,B);  quad(4,5,7,6,B); 
			quad(5,1,3,7,R); quad(0,4,6,2,R);
			quad(6,7,3,2,G); quad(0,1,5,4,G);
			
			//quad for the floor
			quad(10,11,9,8,X);

			var s = 0.2;
			cubeModelMatrix = mult(scalem(s,s,s), translate(-0.5,0,-0.5));
			//cubeModelMatrix = mult(translate(0,-0.3,0), cubeModelMatrix);

			// floor 
			var l = 0.6;
			//floorModelMatrix = mult(translate(0,-0.3,0), scalem(l,l,l));
			floorModelMatrix = scalem(l,l,l);

			
			// set up buffers
			var vBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
			

			var cBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);


			var nBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

						
			// Do shader plumbing
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			gl.vertexAttribPointer(Locations.vPosition, 3, gl.FLOAT, false, 0, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
			gl.vertexAttribPointer(Locations.vColor, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
			gl.vertexAttribPointer(Locations.vNormal, 3, gl.FLOAT, false, 0, 0);


			scene.draw = function(now){
				//draw cube
				var t = fmod(now/3000,2);
				var h;
				if(t < 1){
					h = 1-t*t;
				}
				else{
					h = 1 - (2-t)*(2-t);
				}

				var M, NT;
				M = mult(translate(0,h,0),cubeModelMatrix);
				NT = normalTransformationMatrix(M);
				console.log(NT);
				gl.uniformMatrix4fv(Locations.M, gl.FALSE, flatten(M));
				gl.uniformMatrix3fv(Locations.NT, gl.FALSE, flatten(NT));
				gl.drawArrays(gl.TRIANGLES, 0, 36);

				//draw floor
				M = floorModelMatrix;
				NT = normalTransformationMatrix(M);
				gl.uniformMatrix4fv(Locations.M, gl.FALSE, flatten(M));
				gl.uniformMatrix3fv(Locations.NT, gl.FALSE, flatten(NT));
				gl.drawArrays(gl.TRIANGLES, 36, 6);

			};

			return scene;

}

function render(now){

	requestAnimationFrame(render);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var TB = trackball.getMatrix();
	gl.uniformMatrix4fv(Locations.TB, gl.FALSE, flatten(TB));

	var TBNT = trackball.getNormalTransformationMatrix();
	gl.uniformMatrix3fv(Locations.TBNT, gl.FALSE, flatten(TBNT));

	var VP = camera.getMatrix();
	gl.uniformMatrix4fv(Locations.VP, gl.FALSE, flatten(VP));

	var cameraPosition = camera.getFrame().e;
	gl.uniform3fv(Locations.cameraPosition, flatten(cameraPosition));

	scene.draw(now);
}



