/**
 * Rotating Cube (WebGL)
 * ⓒ Simon Seo, 2016
 */

(function(global) {
	"use strict";
	var gl; // global variable
	var num_vertices;
	var vertices;
	var ux, uy, uz; //location of angle of rotation around x, y, z axis

	window.onload = function init() {
		// Set up WebGL
		var canvas = document.getElementById("gl-canvas");
		gl = WebGLUtils.setupWebGL( canvas );
		if(!gl){alert("WebGL setup failed!");}

		// Clear canvas
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// enable depth test
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clearDepth(1.0);

		// Load shaders and initialize attribute buffers
		var program = initShaders( gl, "vertex-shader", "fragment-shader" );
		gl.useProgram( program );

		// Define length, set position of vertices
		var s = 0.5;
		var a = vec4(s, s, s);
		var b = vec4(-s, s, s);
		var c = vec4(-s, -s, s);
		var d = vec4(s, -s, s);
		var e = vec4(s, s, -s);
		var f = vec4(-s, s, -s);
		var g = vec4(-s, -s, -s);
		var h = vec4(s, -s, -s);
		vertices = dedim([quad(a,b,c,d), quad(f,e,h,g), quad(b,a,e,f), quad(c,b,f,g), quad(d,c,g,h), quad(a,d,h,e)]);

		var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

		var vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);

		//Angle of rotation around each axis
		ux = gl.getUniformLocation(program, "x_theta");
		uy = gl.getUniformLocation(program, "y_theta");
		uz = gl.getUniformLocation(program, "z_theta");

		// Define colors, set color of vertices 
		var R = vec3(1.0, 0.0, 0.0);
		var G = vec3(0.0, 1.0, 0.0);
		var B = vec3(0.0, 0.0, 1.0);
		var C = vec3(0.0, 1.0, 1.0);
		var M = vec3(1.0, 0.0, 1.0);
		var Y = vec3(1.0, 1.0, 0.0);
		var colors = dedim([quad(R), quad(G), quad(B), quad(C), quad(M), quad(Y)]);

		var cBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

		var vColor = gl.getAttribLocation(program, "vColor");
		gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vColor);


		//Draw 
		num_vertices = vertices.length/4;
		requestAnimationFrame(render);

	};

	function render(now){
		requestAnimationFrame(render);

		//at every frame, update the rotation value according to th evalue on the slider
		gl.uniform1f(ux, radians(document.getElementById('x-slider').value));
		gl.uniform1f(uy, radians(document.getElementById('y-slider').value));
		gl.uniform1f(uz, radians(document.getElementById('z-slider').value));

		//
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLES, 0, num_vertices);
	}
})(this);