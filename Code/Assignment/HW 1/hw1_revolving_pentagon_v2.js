// ⓒ Simon Seo, 2016

(function(global) {
	'use strict';
	var gl;
	var vertices_a, vBuffer_a;
	var vertices_b, vBuffer_b;
	var ut, uorbit; //time
	var vPosition;
	var r_orbit, ur_orbit;

	window.onload = function() {

		// Set up WebGL
		var canvas = document.getElementById("gl-canvas");
		gl = WebGLUtils.setupWebGL(canvas);
		if (!gl) { alert("WebGL setup failed!"); }

		// Clear canvas
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Load shaders and initialize attribute buffers
		var program = initShaders(gl, "vertex-shader", "fragment-shader");
		gl.useProgram(program);




		// Load data into a buffer_a
		vertices_a = [];
		var r_a = 0.3;
		for (var t = 0; t < 2 * Math.PI; t += 2 * Math.PI / 5) {
			vertices_a.push(r_a * Math.cos(t), r_a * Math.sin(t));
		}

		vBuffer_a = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer_a);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices_a), gl.STATIC_DRAW);



		// Load data into a buffer_b
		vertices_b = [];
		var r_b = 0.2;
		r_orbit = 0.5;
		for (var t = 0; t < 2 * Math.PI; t += 2 * Math.PI / 5) {
			vertices_b.push(r_b * Math.cos(t) + r_orbit, r_b * Math.sin(t));
		}
		ur_orbit = gl.getUniformLocation(program, "r");
		gl.uniform1f(ur_orbit, r_orbit);


		vBuffer_b = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer_b);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices_b), gl.STATIC_DRAW);


		// Do shader plumbing
		vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);



		uorbit = gl.getUniformLocation(program, "orbit");
		ut = gl.getUniformLocation(program, "t");
		requestAnimationFrame(render);

	};

	function render(now) {
		requestAnimationFrame(render);

		var t = -0.5 * now * 0.001;
		gl.uniform1f(ut, t);
		gl.clear(gl.COLOR_BUFFER_BIT);

		//first pentagon - stay still
		gl.uniform1f(uorbit, 0.0);
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer_a); //set appropriate buffer as current
		gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); // uses currently buffer
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);

		//second pentagon - orbiting
		gl.uniform1f(uorbit, 1.0);
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer_b); //set appropriate buffer as current
		gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); // uses currently buffer
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);
	}
})(this);
