"use strict";
var gl; // global variable
var image, program, trackball;
var camera;   // camera object
var Locations;  // object containing location ids of shader variables 

window.onload = function init(){
  //Set  up WebGL
  var canvas = document.getElementById( "gl-canvas" );
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) {alert( "WebGL isn't available" );}
  
  // Set viewport and clear canvas
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Load shaders and initialize attribute buffers
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  // Get Locations of attributes and Locations
  var Attributes = [];
  var Uniforms = ["VP", "TB", "TBN", "cameraPosition"];

  Locations = getLocations(Attributes, Uniforms); // defined in Utils.js
 

  // set up Camera
  camera = Camera(); // Camera(...) is defined in Camera.js
  var eye = vec3(0,0,2);
  var at = vec3(0, 0 ,0);
  var up = vec3(0,1,0);
  camera.lookAt(eye,at,up);
  camera.setPerspective(90,1,0.1,10);

  // set up virtual trackball
  trackball = Trackball(canvas);
  
  // Set up buffers and attributes

  // var s = 0.4;

  // // Cube vertices in counter-clockwise order.
  // // Front face starting with a = bottom left
  // var a = vec3(-s,-s, s);
  // var b = vec3( s,-s, s);
  // var c = vec3( s, s, s);
  // var d = vec3(-s, s, s);

  // // Back face starting with e = bottom left
  // var e = vec3(-s,-s,-s);
  // var f = vec3( s,-s,-s);
  // var g = vec3( s, s,-s);
  // var h = vec3(-s, s,-s);

  // var vertices = [];
  // vertices = vertices.concat(
  //   square(a,b,c,d),  //front
  //   square(e,f,g,h),  //end

  //   square(d,c,g,h),  //top
  //   square(a,b,f,e),  //bottom

  //   square(a,d,h,e),  //left
  //   square(b,c,g,f)   //right                  
  // );

  var s = 0.7;
  var vertices =  [-s,-s,-s,
                    s,-s,-s,
                    s, s,-s,
                   -s, s,-s,
                   -s,-s, s,
                    s,-s, s,
                    s, s, s,
                   -s, s, s,];
  var texCoords = [ 0.25, 0.33,  0.50, 0.33,  0.50, 0.66,  0.25, 0.66,
                    1.00, 0.33,  0.75, 0.33,  0.75, 0.66,  1.00, 0.66,
                    0.25, 1.00,  0.50, 1.00,  0.50, 0.66,  0.25, 0.66,
                    0.25, 0.00,  0.50, 0.00,  0.50, 0.33,  0.25, 0.66,
                    0.75, 0.33,  0.50, 0.33,  0.50, 0.66,  0.75, 0.66,
                    0.25, 0.33,  0.00, 0.33,  0.00, 0.66,  0.25, 0.66];
  var indices =   [0,2,3,  0,2,1, // back
                   4,6,5,  4,6,7, // front
                   7,2,6,  7,2,3, // top
                   4,1,5,  4,1,0, // bottom
                   5,2,1,  5,2,6, // right
                   0,7,4,  0,7,3];// left

  var vbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var tbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);
  var vTexCoord = gl.getAttribLocation(program, "vTexCoord"); 
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTexCoord);
  
  var ibuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuffer);  
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(flatten(indices)), gl.STATIC_DRAW);
  

  var texture = gl.createTexture();
  var mySampler = gl.getUniformLocation(program, "mySampler");

  image = new Image();
  image.onload = function(){handler(texture);};
  image.src = "cubemap.jpg";
  
  function handler(texture){    
    gl.activeTexture(gl.TEXTURE0);       // enable texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);  // bind texture object to target
    gl.uniform1i(mySampler, 0);      // connect sampler to texture unit 0

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // flip image's y axis
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  }

  requestAnimationFrame(render);
};

function render(now){
  
  requestAnimationFrame(render);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var TB = trackballWorldMatrix(trackball, camera);
  gl.uniformMatrix4fv(Locations.TB, gl.FALSE, flatten(TB));

  var TBN = normalTransformationMatrix(TB); 
  gl.uniformMatrix3fv(Locations.TBN, gl.FALSE, flatten(TBN));
    
  var VP = camera.getMatrix(); 
  gl.uniformMatrix4fv(Locations.VP, gl.FALSE, flatten(VP)); 

  var cameraPosition = camera.getFrame().e;
  gl.uniform3fv(Locations.cameraPosition, flatten(cameraPosition));

  gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_BYTE,0); 
}


