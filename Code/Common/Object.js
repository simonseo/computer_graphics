function objInit(Obj){
	// Assumes Obj contains a "positions" array.
	// If a "triangles" array is provided, index buffer is used. 
	// A "normals" array may be provided. If not, it is computed.
	// Note: the elements of these arrays are arrays of length 3.
	
	var usingIndexBuffer;
	var vBuffer, nBuffer, iBuffer;
	var modelMatrix = mat4();
	
	// setup vertex buffer 
	vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(Obj.positions), gl.STATIC_DRAW);

	if(Obj.triangles === undefined || Obj.triangles.length === 0){
		// not using index buffer, drawn using gl.drawArrays
		usingIndexBuffer = false;
	}
	else{
		// using index buffer, drawn using gl.drawElements
		// setup index buffer
		usingIndexBuffer = true;
		iBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 
					  new Uint16Array(flatten(Obj.triangles)),gl.STATIC_DRAW);
	}
	
	
	if(Obj.normals === undefined || Obj.normals.length === 0){
		// normals array not defined, compute normals
		Obj.normals = [];
		// ...	
	}
	
	// setup normals buffer
	nBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(Obj.normals), gl.STATIC_DRAW);
	
	
	// Attach functions to Obj
	 
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
		if(usingIndexBuffer){
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
			gl.drawElements(gl.TRIANGLES, 3*Obj.triangles.length, 
			                                 gl.UNSIGNED_SHORT, 0);
		}
		else{
			gl.drawArrays(gl.TRIANGLES, 0, Obj.positions.length);
		}
	}	

}



