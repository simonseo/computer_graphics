"use strict";
var gl; // global variable

var cBuffer, vColor;
var vBuffer, vPosition;
var uTime;

var direction = 1;
var speed = 5;

window.onload = function init() {
			// Set up WebGL
			var canvas = document.getElementById("gl-canvas");
			gl = WebGLUtils.setupWebGL( canvas );
			if(!gl){alert("WebGL setup failed!");}
			
			
			// Load shaders and initialize attribute buffers
			var program = initShaders( gl, "vertex-shader", "fragment-shader" );
			gl.useProgram( program );
			
			
			// Button
			var button = document.getElementById("Flip Button");
			button.onclick = function(){direction*= -1;};

			// Alternate form:
			//button.addEventListener("click", function(){direction*= -1;});
			
			//Slider
			var slider = document.getElementById("Speed Slider");
			slider.onchange = function(){ speed = event.srcElement.value;};

			//Mouse click on canvas
			canvas.addEventListener("click", function(event){
			   console.log( "You have clicked position: (" 
			           + event.offsetX + "," + event.offsetY + ")" );

			   var pos = getMousePosition(canvas, event);
			   console.log("NDC Coordinates:" + pos.x + "," + pos.y);
	
			});
	

			// Load data into a buffer
			var r = 0.5;
			var vertices = [r*Math.cos(Math.PI/2), r*Math.sin(Math.PI/2),
			                r*Math.cos(7*Math.PI/6), r*Math.sin(7*Math.PI/6),
			                r*Math.cos(-Math.PI/6), r*Math.sin(-Math.PI/6)]; 
			vBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


			var colors = [1,0,0,0,1,0,0,0,1]; // r,g,b values for three vertices
			// Question: why do we not need alpha values in the above array?
			cBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer); 
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


			// Attribute set up
			vPosition = gl.getAttribLocation(program, "vPosition");
			gl.enableVertexAttribArray(vPosition);

			vColor = gl.getAttribLocation(program, "vColor");
			gl.enableVertexAttribArray(vColor);
			
			uTime = gl.getUniformLocation(program,"Time");


			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
		
			
			gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
			gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
			

			requestAnimationFrame(render);
			
};

function render(now){
	        gl.uniform1f(uTime, direction*speed*now);

			// Clear canvas
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			
			//Draw 
			gl.drawArrays(gl.TRIANGLES,0,3); 

			requestAnimationFrame(render);
}

function getMousePosition(canvas, event){
    return {
          x: -1+2*event.offsetX/canvas.width,
          y: -1+2*(canvas.height- event.offsetY)/canvas.height
    };
}
