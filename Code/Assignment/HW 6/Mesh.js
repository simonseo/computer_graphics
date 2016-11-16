"use strict";
var gl; // global variable
var camera; // camera object
var trackball; // virtual trackball 
var uMVP; // location of Model-View-Projection matrix

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
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Set up buffers and attributes
	var s = 4.2; //side length
	var n = 15; //grid size


	//Create vertices
	var vertices = [];
	var count = 0;
	for (var i = 0; i < n+1; i++) {
		for (var j = 0; j < n+1; j++) {
			var x = -s/2+j*s/n;
			var y = s/2-i*s/n;
			var r = Math.sqrt(x*x + y*y);
			var z = Math.sin(100.0*r)/(5.0*r);
			// var z = x + y;
			vertices.push(vec3(x, y, z));
		}
	}
	console.log(vertices);

	//Create indices
	var indices = [];
	var quad = function (a,b,c,d){
		indices.push(a,c,b,a,d,c);
	}
	for (var i = 0; i < n; i++) { 
		for (var j = 0; j < n; j++) {
			var x = i + (n + 1) * j;
			quad(x, x+1, x+n+2, x+n+1);
		}
	}
	console.log(indices);


	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);	
	
	// set up index buffer
	var ibuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

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

		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
	}
}; 

