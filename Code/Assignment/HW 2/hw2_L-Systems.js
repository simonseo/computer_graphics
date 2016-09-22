(function(global) {
	"use strict";
	var gl; // global variable
	var cos = Math.cos, sin = Math.sin, PI = Math.PI;

	window.onload = function init() {
		// Set up WebGL
		var canvas = document.getElementById("gl-canvas");
		gl = WebGLUtils.setupWebGL( canvas );
		if(!gl){alert("WebGL setup failed!");}

		// Clear canvas
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Load shaders and initialize attribute buffers
		var program = initShaders( gl, "vertex-shader", "fragment-shader" );
		gl.useProgram( program );

		// Settings for Turtle
		var initial_config = {
			x: 0,
			y:0,
			theta: 0
		};
		var alpha = PI/8;
		var axiom = "F";
		var production_rules = {
			// F: "+X-Y-X+", X: "f---F---f", Y: "F"
			// F: "F-F++F-F"             //axiom:F, alpha = pi/3
			// F: "F[+F]F[-F]F"          //axiom:F, alpha = pi/8
			// F: "FF+F+F+FF+F+F-F"      //axiom:F, alpha = pi/2
			// F: "F+F-F-FF+F+F-F"       //axiom:F, alpha = pi/2
			F: "FF+[+F-F-F]-[-F+F+F]" //axiom:F, alpha = pi/8
			// F: "FF", X:"F[+X]F[-X]+X" //axiom:X, alpha = pi/9
		};
		var num_productions = 4;

		// Create Turtle
		var v = turtle(initial_config, alpha, axiom, production_rules, num_productions);

		// Load data into a buffer
		var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
		
		// Do shader plumbing
		var vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);
		
		//Draw 
		var num_vertices = v.length/2;
		gl.drawArrays(gl.LINES, 0, num_vertices);
	};

	//return array of (x,y) vertices
	function turtle(initial_config, alpha, axiom, production_rules, num_productions){
		/**
		 * STEP 1. Replace axiom with production rules
		 */
		axiom = axiom.split('');
		var axiom_len, new_axiom;
		for (var production = 0; production < num_productions; production++) {
			axiom_len = axiom.length;
			new_axiom = [];
			for (var i = 0, char; i < axiom_len; i++) {
				char = axiom[i];
				if (production_rules.hasOwnProperty(char)) {
					new_axiom.push(production_rules[char].split(''));
					new_axiom = dedim(new_axiom);
				}
				else {
					new_axiom.push(char);
				}
			}
			axiom = new_axiom;
		}
		global.axiom = axiom.join('');

		/**
		 * STEP 2. Read through axiom, insert vertices
		 */
		var config = clone(initial_config), config_save = [], result = [];
		for (var rule of axiom) {
			switch(rule) {
				case 'f':
					config.x += cos(config.theta);
					config.y += sin(config.theta);
					break;
				case 'F':
					result.push(config.x, config.y);
					config.x += cos(config.theta);
					config.y += sin(config.theta);
					result.push(config.x, config.y);
					break;
				case '+':
					config.theta += alpha;
					break;
				case '-':
					config.theta -= alpha;
					break;
				case '[':
					config_save.push(clone(config));
					break;
				case ']':
					config = config_save.pop();
					break;
				default: break; 
			}
		}
		normalize(result);
		return result;
	}

	function clone(obj){
		return JSON.parse(JSON.stringify(obj));
	}
	function normalize(v){
		var x = [], y =[], i;
		for(i=0; i<v.length; i+=2) x.push(v[i]);
		for(i=1; i<v.length; i+=2) y.push(v[i]);
		var xmin = Math.min.apply(null,x);
		var xmax = Math.max.apply(null,x);
		var ymin = Math.min.apply(null,y);
		var ymax = Math.max.apply(null,y);
		var xmid = (xmin+xmax)/2;
		var ymid = (ymin+ymax)/2;
		var xrange = xmax - xmin;
		var yrange = ymax - ymin;
		var s = 1.9/Math.max(xrange, yrange);
		for(i=0; i<v.length; i+=2) v[i] = s*(v[i] - xmid);
		for(i=1; i<v.length; i+=2) v[i] = s*(v[i] - ymid);
	}
})(this);