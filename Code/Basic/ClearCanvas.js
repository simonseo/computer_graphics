window.onload = function init() {
			var canvas = document.getElementById("gl-canvas");
			var gl = WebGLUtils.setupWebGL( canvas );
			if(!gl){alert("WebGL setup failed!");}
			
			gl.clearColor(0.0, 0.0, 1.0, 1);
			gl.clear(gl.COLOR_BUFFER_BIT);
}
