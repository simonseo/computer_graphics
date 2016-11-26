function objInit(Obj){
	/* Assumes Obj contains a "positions" array.
	   Note: the elements of these arrays are arrays of length 3. */

	var vBuffer, nBuffer, iBuffer;
	var modelMatrix = mat4();

	var trianglesPresent = 
		(Obj.triangles !== undefined) && (Obj.triangles.length > 0);

	var normalsPresent = 
		(Obj.normals!==undefined) && (Obj.normals.length > 0);

	if(!trianglesPresent){ 
		/* Obj.triangles = [[0,1,2], [3,4,5], ...] */
		Obj.triangles = [];
		for(var i = 0; i<Obj.positions.length/3; ++i){
			Obj.triangles[i] = [3*i, 3*i+1, 3*i+2];
		}
	}

	if(!normalsPresent){
		computeNormals();
	}

	setupBuffers();


	/*----- Attach functions to Obj -----*/

	Obj.setModelMatrix = function(M){ modelMatrix = M; }

	Obj.getModelMatrix = function(M){ return modelMatrix; }

	Obj.getNormalTransformationMatrix = function (){
		var m = modelMatrix;
		// take the 3x3 part of m, transpose it and take inverse 
		return inverse3 ( mat3(m[0][0], m[1][0], m[2][0],
							   m[0][1], m[1][1], m[2][1],
							   m[0][2], m[1][2], m[2][2] ) );
	}

	Obj.draw = function(){
		// Set attribute pointers
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.vertexAttribPointer( gl.getAttribLocation(program,"vPosition"), 
								3, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
		gl.vertexAttribPointer( gl.getAttribLocation(program,"vNormal"), 
								3, gl.FLOAT, false, 0, 0);

		// Draw
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
		gl.drawElements(gl.TRIANGLES, 3*Obj.triangles.length, 
										 gl.UNSIGNED_SHORT, 0);
	}

	return Obj;

	/*----- Helper functions defined below -----*/

	function setupBuffers(){
		// setup vertex buffer 
		vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(Obj.positions), gl.STATIC_DRAW);
		
		// setup normals buffer
		nBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(Obj.normals), gl.STATIC_DRAW);

		// setup index buffer
		iBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 
						  new Uint16Array(flatten(Obj.triangles)),gl.STATIC_DRAW);
	}

	function computeNormals(){
		/* Go over each triangle and compute the normals.
		   The normal at a vertex is the weighted sum of the 
		   normals of adjacent triangles. The weight of a 
		   triangle is proportional to its area. */

		// Initialize Obj.normals as an array of zero vectors.
		Obj.normals = [];
		for (var i = Obj.positions.length - 1; i >= 0; i--) {
			Obj.normals.push(vec3());
		}

		for (var i = Obj.triangles.length - 1, triangle = [], weight = 0; i >= 0; i--) {
			// for each triangle, calculate the weight = area
			triangle_idx = Obj.triangles[i];
			weight = cross( subtract(Obj.positions[triangle_idx[0]], Obj.positions[triangle_idx[2]]),
							subtract(Obj.positions[triangle_idx[1]], Obj.positions[triangle_idx[0]]) );

			// Add the weight to a vector in Obj.normals if that vector corresponds to any vertex in the triangle
			for (var j = Obj.positions.length - 1; j >= 0; j--) {
				if (j == triangle_idx[0] ||
					j == triangle_idx[1] ||
					j == triangle_idx[2]) {
					Obj.normals[j] = add(Obj.normals[j], weight);
				}
			}
		}

		for (var i = Obj.normals.length - 1; i >= 0; i--) {
			Obj.normals[i] = normalize(Obj.normals[i]);
		}
		console.log(Obj);
		return;
	}
}

/**
 * Grid(int n, float s) return object Obj
 * 
 * Creates a flat n x n grid with side length s as an object Obj with positions and triangles attributes.
 * It can be used by other functions in Object.js
 * 
 * @param {int} n number of subdivisions; how detailed the mesh is
 * @param {float} s side length of grid
 */
function Grid(n, s){
	var Obj = {
		positions : [],
		triangles : [],
	};

	(function createPositions(){
		for (var i = 0; i < n+1; i++) {
			for (var j = 0; j < n+1; j++) {
				var x = -s/2+j*s/n;
				var y = s/2-i*s/n;
				var z = 0;
				Obj.positions.push(vec3(x, y, z));
			}
		}
	})();

	(function createTriangles(){
		for (var i = 0; i < n; i++) { 
			for (var j = 0; j < n; j++) {
				var x = i + (n + 1) * j;
				quad(x, x+1, x+n+2, x+n+1);
			}
		}

		function quad(a,b,c,d){
			Obj.triangles.push([a,c,b], [a,d,c]);
		}
	})();

	return Obj;
}



