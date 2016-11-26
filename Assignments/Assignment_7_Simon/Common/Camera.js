function Camera(canvas){

	var Mcam = mat4(); // camera matrix 
	var P = mat4();    // projection matrix
	
	var camFrame = { // camera frame
			e: vec3(0,0,0), // camera location
			u: vec3(1,0,0), // unit vector to "right"
			v: vec3(0,1,0), // unit vector in "up" direction
			w: vec3(0,0,1)  // unit vector opposite "gaze" direction
	};			
	
	var Cam = { /* object to be returned */
			lookAt: function (eye, at, up) {
				var w = normalize(subtract(eye,at));
				var u = cross(up, w);
				var v = cross(w,u);
				camFrame = {e: eye, u: u, v: v, w: w};
				Mcam = cameraMatrix(eye, u, v, w); 
			},

			setPerspective: function(fovy, aspect, near, far){
				P = perspectiveMatrix(fovy, aspect, near, far );
			},

			setOrthographic: function (r,l,t,b,n,f){
				P = orthoProjMatrix(r,l,t,b,n,f);
			},
			
			getCameraTransformationMatrix(){
				return Mcam;
			},
			
			getProjectionMatrix(){
				return P;
			},

			getMatrix: function(){
				// combines camera transformation and projection
				return mult(P,Mcam);
			},
			
			getFrame: function (){
				// returns camera frame (e, u, v, w)
				return camFrame;
			}

	};

	function cameraMatrix(eye,u,v,w){
		return mat4( vec4(u, -dot(u,eye)),
				vec4(v, -dot(v,eye)),
				vec4(w, -dot(w,eye)),
				vec4(0,0,0,1) );
	}

	function orthoProjMatrix(r,l,t,b,n,f){ // n and f should be -ve
		return mat4(2/(r-l), 0, 0, -(r+l)/(r-l),
					0, 2/(t-b), 0, -(t+b)/(t-b),
					0, 0, 2/(n-f), -(n+f)/(n-f),
					0, 0, 0, 1);
	}

	function perspProjectionMatrix(r,l,t,b,n,f){ // n and f should be -ve
		return mat4(-2*n/(r-l), 0, (r+l)/(r-l), 0,
					0, -2*n/(t-b),(t+b)/(t-b), 0,
					0, 0, -(n+f)/(n-f), 2*f*n/(n-f),
					0, 0, -1, 0 );
	}

	function perspectiveMatrix(fovy, aspect, near, far ){ // near and far are +ve
		var t = near*Math.tan(radians(fovy/2));
		var r = t*aspect;
		return perspProjectionMatrix(r,-r, t,-t, -near, -far);
	}



	/**
	 * Camera Control
	 * Up / Down arrows: tilt camera up and down (rotation about x-axis of camera coordinate frame)
	 * Left / Right arrows: tilt camera left and right (rotation about y-axis of camera coordinate frame)
	 * Ctrl + arrows: translate camera origin in given direction (x and y axis)
	 * a / z: move camera origin in negative / positive z-axis
	 * theta is amount of rotation
	 * delta is amount of translation
	 */
	var theta = 0.1, delta = 0.1;
	var ctrl = false;

	canvas.addEventListener("keydown", function controlCamera(evt) {
		var e = camFrame.e,
		u = camFrame.u,
		v = camFrame.v,
		w = camFrame.w;

		switch(evt.keyCode) {
			case 17: //ctrl
				ctrl = true;
				console.log("CTRL");
				break;
			case 38: //up
			// up: 'eye' is same, but 'at' moves in v direction.
			// ctrl+up: both 'eye' and 'at' move in v direction.
			// 'up' does not have to change since camera tilt is small.
				Cam.lookAt(
					ctrl ? add(e, scale(delta, v)) : e, 
					add(subtract(e, w), scale(ctrl ? delta : theta, v)),
					v);
				break;
			case 40: //down
				Cam.lookAt(
					ctrl ? add(e, scale(-delta, v)) : e, 
					add(subtract(e, w), scale(ctrl ? -delta : -theta, v)),
					v);
				break;
			case 37: //left
				Cam.lookAt(
					ctrl ? add(e, scale(-delta, u)) : e, 
					add(subtract(e, w), scale(ctrl ? -delta : -theta, u)),
					v);
				break;
			case 39: //right
				Cam.lookAt(
					ctrl ? add(e, scale(delta, u)) : e, 
					add(subtract(e, w), scale(ctrl ? delta : theta, u)),
					v);
				break;
			case 65: //a
				Cam.lookAt(
					subtract(e, scale(delta, w)), 
					subtract(e, w),
					v);
				break;
			case 90: //z
				Cam.lookAt(
					subtract(e, scale(-delta, w)), 
					subtract(e, w),
					v);
				break;
		}
	}, true);

	canvas.addEventListener("keyup", function (evt){
		switch(evt.keyCode) {
			case 17: //release ctrl key
				ctrl = false;
		}
	}, true);

	return Cam;
}