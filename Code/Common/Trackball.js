function Trackball(canvas){ 
	
	var trackball = { /* object to be returned */

		getMatrix: function() { return tbMatrix; },

		getNormalTransformationMatrix: function() {
			// since the trackball matrix just does rotation
			// we return the linear part of tbMatrix.
			m = tbMatrix;
			return mat3( m[0][0], m[0][1], m[0][2],
						 m[1][0], m[1][1], m[1][2],
						 m[2][0], m[2][1], m[2][2] );
		}
		
	}; 

	var lastVector, tracking = false;
	var tbMatrix = mat4(); // initialize virtual trackball matrix

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
			var p2 = getMouseDirectionVector(event);
			lastVector = p2;
			var n = cross(p1,p2);
			if(length(n)!=0){
				var theta = 5*Math.asin(length(n))*180/Math.PI;
				tbMatrix = mult(rotate(theta, n), tbMatrix);
			}
		}
	}

	canvas.onwheel = function wheel(event){
		var s=(1 - event.deltaY/500);
		tbMatrix = mult(scalem(s,s,s), tbMatrix);
	}
	
	return trackball;
}
