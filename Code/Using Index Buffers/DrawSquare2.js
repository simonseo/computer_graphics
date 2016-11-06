"use strict";
var gl; // global variable

window.onload = function init(){
	//Set  up WebGL
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) {alert( "WebGL isn't available" );}
    
    // Set viewport and clear canvas
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
	// Set up buffers and attributes
	var s = 1.9; //side length
	var n = 2; //grid size


	//Create vertices
	var vertices = [];
	for (var i = 0; i < n+1; i++) {
		for (var j = 0; j < n+1; j++) {
			vertices.push(vec2(-s/2+j*s/n, s/2-i*s/n));
		}
	}
	console.log(vertices);

	//Create indices
	var indices = [];
	var quad = function (a,b,c,d){
		indices.push(a,b,c,a,c,d);
	}
	for (i = 0; i < n; i++) { 
		for (j = 0; j < n; j++) {
			var x = i + (n + 1) * j
			quad(x, x+1, x+n+2, x+n+1);
		}
	}
	console.log(indices);

	var R = vec3(1,0,0);
	var G= vec3(0,1,0);
	var B = vec3(0,0,1);
	var X = vec3(1,1,1);

	// var vertices = [a,b,c,d];
	var colors = [R,G,B,X];
	// var indices = [0,1,2,0,2,3];

	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);	

	// var cbuffer = gl.createBuffer();
	// gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer);
	// gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

	// var vColor = gl.getAttribLocation(program, "vColor");
	// gl.vertexAttribPointer(vColor,3, gl.FLOAT, false, 0, 0);
	// gl.enableVertexAttribArray(vColor);
	
	// set up index buffer
	var ibuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

	//Draw
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}; 


