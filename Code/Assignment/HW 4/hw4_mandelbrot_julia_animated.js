(function(global) {
	"use strict";
	var gl;
	var canvas = document.getElementById("gl-canvas");
	var ut, ud;       //parameters used for animating
	var SPEED = 24;   // speed of animation (fps)
	var DURATION = 10; //duration of animation (s)

	window.onload = function init() {
		// Set up WebGL
		gl = WebGLUtils.setupWebGL( canvas );
		if(!gl){alert("WebGL setup failed!");}
		gl.viewport(viewport[0],viewport[1],viewport[2],viewport[3]);

		// Clear canvas
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Load shaders and initialize attribute buffers
		var program = initShaders( gl, "vertex-shader", "fragment-shader" );
		gl.useProgram( program );

		// Data of the day - simply a square
		var s = 1.0;
		var a = vec2(-s,-s);
		var b = vec2(s, -s);
		var c = vec2(s,s);
		var d = vec2(-s,s);

		var vertices = [a,b,c,d];
		var indices = [0,1,2,0,2,3];

		// Loading data into buffer and shader plumbing
		var vbuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

		var vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);

		// set up index buffer
		var ibuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

		//Draw
		ut = gl.getUniformLocation(program, "t");
		ud = gl.getUniformLocation(program, "d");
		requestAnimFrame(render);
	};

	function render(now) {
		requestAnimFrame(render);
		var t = now/1000 * SPEED;
		var d = SPEED * DURATION;
		gl.uniform1f(ut, t);
		gl.uniform1f(ud, d);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
	}

	//global variables for moving/zooming canvas
	var isDragging = false;
	var viewport = [0,0,canvas.width,canvas.height];
	var mousePosition = [0,0];


	/**
	 * Click+drag on the canvas moves the canvas
	 * @return {void}
	 */
	canvas.addEventListener('mousedown', function (e) {
		isDragging = true;
		mousePosition[0] = e.offsetX;
		mousePosition[1] = e.offsetY;
	}, false);
	canvas.addEventListener('mousemove', function (e) {
		if (isDragging) {
			//move x and y, don't change width and height
			viewport[0] += e.offsetX - mousePosition[0];
			viewport[1] -= e.offsetY - mousePosition[1];
			mousePosition[0] = e.offsetX;
			mousePosition[1] = e.offsetY;

			//update viewport and draw again
			gl.viewport(viewport[0],viewport[1],viewport[2],viewport[3]);
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
		}
	}, false);
	document.addEventListener('mouseup', function (e) {
		isDragging = false;
	}, false);



	/**
	 * On mousewheel event, zoom in/out centered on cursor location
	 * @return {void}
	 */
	canvas.addEventListener('mousewheel', function (e) {
		var zoom = 1 - Math.round(e.deltaY) / 500;
		viewport[0] += (e.offsetX - viewport[0]) * (1 - zoom);
		viewport[1] += (canvas.height - e.offsetY - viewport[1]) * (1 - zoom);
		viewport[2] *= zoom;
		viewport[3] *= zoom;
		gl.viewport(viewport[0],viewport[1],viewport[2],viewport[3]);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
	}, false);



	/**
	 * function to show logs within the browser window
	 * @return {void}
	 */
	function log(){
		var target = document.getElementsByClassName('console')[0].innerHTML;
		var s = '';
		for (var st of arguments) {
			s += st;
		}
		document.getElementsByClassName('console')[0].innerHTML = s + '<br>' + target;
	}
})(this);