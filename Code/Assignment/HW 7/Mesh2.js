"use strict";
var gl; // global variable
var camera; // camera object
var trackball; // virtual trackball 
var uMVP; // location of Model-View-Projection matrix
var program;
window.onload = function init(){
	//Set  up WebGL
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) {alert( "WebGL isn't available" );}
    
    // Set viewport and clear canvas
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.clear(gl.COLOR_BUFFER_BIT);

	//Enable depth test
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL); // since WebGL uses left handed
	gl.clearDepth(1.0); 	 // coordinate system
			
    // Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Set up buffers and attributes
	var s = 4.2; //side length
	var n = 15; //grid size
	var obj = Grid(n, s);
	objInit(obj);

	// set up virtual trackball
	trackball = Trackball(canvas);


	// set up Camera
	camera = Camera(canvas); 
	var eye = vec3(0, 0, 2);
	var at = vec3(0, 0, 0);
	var up = vec3(0, 1, 0);
	camera.lookAt(eye,at,up);
	camera.setPerspective(90, 1, 0.1, 10);

	//Draw
	uMVP = gl.getUniformLocation(program,"MVP");
	var t = gl.getUniformLocation(program, 't');
	requestAnimationFrame(render);

	function render(now){
		requestAnimationFrame(render);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.uniform1f(t, 0.001*now);

		var tbMatrix = trackball.getMatrix();
		var cameraMatrix = camera.getMatrix();
		var MVP =  mult(cameraMatrix, tbMatrix); // combining camera and trackball matrices

		gl.uniformMatrix4fv(uMVP, gl.FALSE, flatten(MVP));

		obj.draw();
		// gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
	}
}; 

