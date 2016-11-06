"use strict";

// global variables
var gl, canvas; 

var win = {
	origin: vec2(0.0,0.0),
	s: 1.5
};

var u_origin, u_s;

window.onload = function init(){
	//Set  up WebGL
    canvas = document.getElementById( "gl-canvas" );
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
	var s = 1.0;
	var a = vec2(-s,-s);
	var b = vec2(s, -s);
	var c = vec2(s,s);
	var d = vec2(-s,s);

	var vertices = [a,b,c,d];
	var indices = [0,1,2,0,2,3];

	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);	

	// set up index buffer
	var ibuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

	setupMouseInteration();

	u_origin = gl.getUniformLocation(program, "origin");
	gl.uniform2fv(u_origin, win.origin);

	u_s = gl.getUniformLocation(program, "s");
	gl.uniform1f(u_s, win.s);

	requestAnimationFrame(render);

};

function render(){
	//Draw
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0); 

	requestAnimationFrame(render);
}

function setupMouseInteration(){
	var tracking = false;
	var oldPos;
		
	canvas.onmousedown = function(event){
		tracking = true;
		oldPos = getMousePos(event);
	};

	canvas.onmouseup = function(event){
		tracking = false;
	};

	canvas.onmousemove = function(event){
		if(tracking){
			var newPos = getMousePos(event);
			win.origin = add(win.origin, scale(win.s,subtract(oldPos, newPos)));
			gl.uniform2fv(u_origin, win.origin);
			oldPos = newPos;
		}

	};

	canvas.onwheel = function(event){
		win.s*=(1 - event.deltaY/600);
		gl.uniform1f(u_s, win.s);
	};

	function getMousePos(event){
		return vec2(-1+2*event.offsetX/canvas.width,
					-1+2*(canvas.height- event.offsetY)/canvas.height);	
	}

}

