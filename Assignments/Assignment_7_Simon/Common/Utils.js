function getLocations(Attributes, Uniforms){
  // assumes program is a global variable

  var L = {}; // object to be returned

  var i, name, loc;
  for(i=0;i<Attributes.length;++i){
    name = Attributes[i];
    loc = gl.getAttribLocation(program, name);
  gl.enableVertexAttribArray(loc);
  L[name] = loc;
  }

  for(i=0; i<Uniforms.length; ++i ){
    name = Uniforms[i];
    loc = gl.getUniformLocation(program, name);
    L[name] = loc;
  }

  return L;
}

function normalTransformationMatrix(m){
return inverse3(mat3( m[0][0], m[1][0], m[2][0],
            m[0][1], m[1][1], m[2][1],
            m[0][2], m[1][2], m[2][2] ));
}


function fmod(a,b) { 
  return a - Math.floor(a / b) * b;
}


