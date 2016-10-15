"use strict";

// global variables
var gl, canvas, program;
var vBuffer, cBuffer;


window.onload = function init() {
			// Set up WebGL
			canvas = document.getElementById("gl-canvas");
			gl = WebGLUtils.setupWebGL( canvas );
			if(!gl){alert("WebGL setup failed!");}
			
			// set clear color 
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			
			//Enable depth test
			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL); // since WebGL uses left handed
			gl.clearDepth(1.0); 	 // coordinate system
			
			// Load shaders and initialize attribute buffers
			program = initShaders( gl, "vertex-shader", "fragment-shader" );
			gl.useProgram( program );

			// Load data into a buffer
			var s = 0.3;
			var a = vec3(-s,-s,-s);
			var b = vec3(s,-s,-s);
			var c = vec3(s,s,-s);
			var d = vec3(-s,s,-s);		
			var e = vec3(0,0,2*s);
			var vertices = [a,b,e,b,c,e,c,d,e,d,a,e,a,b,c,a,c,d];

			var R = vec3(1,0,0);
			var G = vec3(0,1,0);
			var B = vec3(0,0,1);
			var X = vec3(0.0,0.5,0.5); 
			var Y = vec3(0.5, 0, 0.5);
			var colors = [R,R,R,G,G,G,B,B,B,X,X,X,Y,Y,Y,Y,Y,Y];

			vBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);		

			cBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

						
			// Do shader plumbing
			var vPosition = gl.getAttribLocation(program, "vPosition");
			gl.enableVertexAttribArray(vPosition);

			var vColor = gl.getAttribLocation(program,"vColor");
			gl.enableVertexAttribArray(vColor);

			gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);
			gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER,cBuffer);
			gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);

			setupVirtualTrackball(); // set up virtual trackball

			requestAnimationFrame(render);

};

function render(now){
	requestAnimationFrame(render);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//draw pyramid
	gl.drawArrays(gl.TRIANGLES,0,18);
}

function setupVirtualTrackball(){

	var lastVector, tracking = false;

	var u_vtM = gl.getUniformLocation(program,"vtM");
	var vtM = mat4(); // initialize 
	gl.uniformMatrix4fv(u_vtM, gl.FALSE, flatten(vtM)); 

	var u_vtScale = gl.getUniformLocation(program,"vtScale");
	var vtScale = 1; //initialize scale
	gl.uniform1f(u_vtScale, vtScale);

	function getMouseDirectionVector(event){
	  var r = 2.0;
	  var x = -1+2*event.offsetX/canvas.width;
	  var y = -1+2*(canvas.height- event.offsetY)/canvas.height;
	  var z = Math.sqrt(r*r-x*x-y*y);
	  return normalize(vec3(x,y,z));
	}

	//set event handlers
	
	canvas.onmousedown = function mousedown(event){
	  lastVector = getMouseDirectionVector(event);
	  tracking = true;
	}

	canvas.onmouseup = function mouseup(){
		tracking = false;
	}

	canvas.onmousemove = function mousemove(event){ 
		if(tracking && event.buttons===1){
			var p1 = lastVector;
			// write your code here
		}
	}

	canvas.onwheel = function wheel(event){
		vtScale*=(1 - event.deltaY/500);
		gl.uniform1f(u_vtScale, vtScale);
		if(vtSscale > 5) vtScale = 5; 	 // max scale
		if(vtScale < 0.2) vtScale = 0.2; // min scale
	}

}


