"use strict";
var gl; // global variable
var image;

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
	var s = 0.7;
	var vertices =  [-s,-s,  s,-s,  s,s,  -s,s];
	var texCoords = [ 0,0,   1,0,  1,1,    0,1];
	var indices =   [0,1,2,  0,2,3];

	var vbuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	var tbuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tbuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);
	var vTexCoord = gl.getAttribLocation(program, "vTexCoord");	
	gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vTexCoord);
	
	var ibuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuffer);	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(flatten(indices)), gl.STATIC_DRAW);
	

	var texture = gl.createTexture();
	var mySampler = gl.getUniformLocation(program, "mySampler");

	image = new Image();
	image.onload = function(){handler(texture);};
	image.src = "floor.gif";
	
	function handler(texture){		
		gl.activeTexture(gl.TEXTURE0); 			 // enable texture unit 0
 		gl.bindTexture(gl.TEXTURE_2D, texture);  // bind texture object to target
 		gl.uniform1i(mySampler, 0); 		 // connect sampler to texture unit 0

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // flip image's y axis
 		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
 		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

		gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_BYTE,0); 

	}

	
}; 



