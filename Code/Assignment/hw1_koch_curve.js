(function(global) {
	'use strict';
	var sin = Math.sin, cos = Math.cos, PI = Math.PI;

	//given an array of 2D points (starting from 2 points, 4 values), create a koch curve.
	function recursiveKoch(array, step) {
		return !step ? array : (function(){
			var x0, y0, x1, y1;
			var len = array.length;
			var output_arr = [];
			//loop through all line segments
			for (var idx = 0; idx < len-2; idx++) {
				//for each point
				if (idx % 2 == 0 ) {
					x0 = array[idx], y0 = array[idx+1], x1 = array[idx+2], y1 = array[idx+3];
					var p1 = {x : (2*x0 + x1)/3, y : (2*y0+y1)/3};
					var p2 = _rotate(-2*PI/3, x0, y0, p1.x, p1.y);
					var p3 = {x: (x0 + 2*x1)/3, y : (y0+2*y1)/3};
					output_arr.push(x0, y0, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, x1, y1);
				}
			}
			return recursiveKoch(output_arr, step-1);
			})();
	}

	//returns the point (x1, y1) theta radians rotated around the point (x0, y0)
	//if x0 and y0 are not specified, rotate around origin
	function _rotate(theta, x1, y1, x0, y0) {
		x0 = !!x0 ? x0 : 0;
		y0 = !!y0 ? y0 : 0;
		x1 -= x0;
		y1 -= y0;
		return {x: x1*cos(theta) - y1*sin(theta) + x0, y: x1*sin(theta) + y1*cos(theta) + y0};
	}

	window.onload = function() {
		var gl; 
		var vertices, vBuffer;

		var canvas = document.getElementById('gl-canvas');
		gl = WebGLUtils.setupWebGL( canvas );

		// Clear canvas
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		var program = initShaders( gl, "vertex-shader", "fragment-shader");
		gl.useProgram( program );

		//calculate vertices to draw
		//should be moved to shader
		vertices = [-1,-0.5, 1,0.5];
		var step = 6;
		vertices = recursiveKoch(vertices, step);

		vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		var vPosition = gl.getAttribLocation(program, 'vPosition');
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);

		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.LINE_STRIP,0,vertices.length/2); 
	};

})(this);