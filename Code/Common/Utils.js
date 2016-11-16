function getLocations(Attributes, Uniforms){
  // assumes program is a global variable

  var L = {}; // object to be returned

  var i, name, loc;
  for(i=0;i<Attributes.length;++i){
    name = Attributes[i];
    loc = gl.getAttribLocation(program, name);
  L[name] = loc;
  }

  for(i=0; i<Uniforms.length; ++i ){
    name = Uniforms[i];
    loc = gl.getUniformLocation(program, name);
    L[name] = loc;
  }

  L.enableAttributes = function(){
    for(var i=0;i<Attributes.length;++i){
      gl.enableVertexAttribArray(L[Attributes[i]]);
    }
  }

  L.disableAttributes = function(){
    for(var i=0;i<Attributes.length;++i){
      gl.disableVertexAttribArray(L[Attributes[i]]);
    }
  }

  return L;
}

function normalTransformationMatrix(m){
return inverse3(mat3( m[0][0], m[1][0], m[2][0],
            m[0][1], m[1][1], m[2][1],
            m[0][2], m[1][2], m[2][2] ));
}


function trackballWorldMatrix(trackball, camera){
  var TB = trackball.getMatrix();
  var Mcam = camera.getCameraTransformationMatrix();
  var T = translate(-Mcam[0][3], -Mcam[1][3], -Mcam[2][3]);
  var M = mult(T,Mcam);
  var I = transpose(M);
  TB = mult(I, mult(TB,M));
  return TB;
}

function fmod(a,b) { 
  return a - Math.floor(a / b) * b;
}


