/**
 * Randomly Colored Rectangles (WebGL)
 * ⓒ Simon Seo, 2016
 */

(function(global) {
	"use strict";
	// Constants
	var MAX_RECTANGLES = 20; //maximum number of rectangles 

	// Global variables
	var gl;       //rendering context
	var vertices = [], vBuffer, vPosition; // coordinates of vertices being drawn
	var colors = [], cBuffer, vColor; //color of vertices
	var canvas = document.getElementById("gl-canvas");

	/**
	 * Initialize buffers
	 * @return {void}
	 */
	window.onload = function init() {
		// Set up WebGL
		gl = WebGLUtils.setupWebGL( canvas );
		if(!gl){alert("WebGL setup failed!");}

		// Clear canvas
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Load shaders and initialize attribute buffers
		var program = initShaders( gl, "vertex-shader", "fragment-shader" );
		gl.useProgram( program );

		// Position buffer initialization
		vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, MAX_RECTANGLES * 48, gl.STATIC_DRAW);
		vPosition = gl.getAttribLocation(program, "vPosition");

		// Color buffer initialization
		cBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, MAX_RECTANGLES * 96, gl.STATIC_DRAW);
		vColor = gl.getAttribLocation(program, "vColor");
	};


	/**
	 * For every other click, create a rectangle based on the two last clicks
	 */
	canvas.addEventListener("click", (function(){
		var first_point = true, num_rectangles = 0;
		return function(e){
			if(num_rectangles < MAX_RECTANGLES) {
				//capture mouse x and y coordinates
				var x = (e.offsetX / canvas.width) * 2 - 1;
				var y = 1 - (e.offsetY / canvas.width) * 2;
				log('new X: ', x, ' new Y: ', y);
				vertices.push(x, y);

				if (!first_point) {
					var x1 = Math.min(vertices[0], vertices[2]), x2 = Math.max(vertices[0], vertices[2]);
					var y1 = Math.min(vertices[1], vertices[3]), y2 = Math.max(vertices[1], vertices[3]);
					vertices = dedim(quad([x1, y1], [x2, y1], [x2, y2], [x1, y2]));
					log(vertices);

					//send data, reinitialize
					render(vertices);
					vertices = [];
					num_rectangles += 1;
				}

				first_point = !first_point;
				log("==============");
			}
			else {
				log("Reached maximum number of rectangles! Change MAX_RECTANGLES to draw more!");
			}
		};
	})());

	/**
	 * For every rectangle, render it new
	 * @return {void}
	 */
	var render = (function() {
		var num_rectangles = 1;
		return function(vertices){
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			//appends extra data starting from ((num_rectangles -1 ) * 48)th byte
			// 6 points * 2 coordinates * 4 bytes
			gl.bufferSubData(gl.ARRAY_BUFFER, (num_rectangles - 1) * 6 * 2 * 4, flatten(vertices));
			gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(vPosition);

			gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
			// 6 points * 4 channels * 4 bytes
			gl.bufferSubData(gl.ARRAY_BUFFER, (num_rectangles - 1) * 6 * 4 * 4, flatten(dedim(quad(randomColor()))));
			gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(vColor);

			var num_vertices = num_rectangles * 6;
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLES, 0, num_vertices);
			num_rectangles += 1;
		};
	})();


	/**
	 * Cretes a length 4 array of an opaque random color
	 * @return {array}
	 */
	function randomColor() {
		var colors = [];
		for (var i = 0; i < 3; i++) {
			colors.push(Math.random());
		}
		colors.push(1.0);
		return colors;
	}


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