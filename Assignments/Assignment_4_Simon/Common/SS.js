/**
 * Helper functions for WebGL
 * ⓒ Simon Seo, 2016
 */

// Takes a quadrilateral and returns it as two triangles
function quad(a,b,c,d) {
	if (arguments.length == 1) {
		return clone([a,a,a,a,a,a]);
	}
	else {
		return clone([a,b,c,a,c,d]);
	}
}

// Dedimensionize a given array
function dedim(arr) {
	var result = [];
	_dedim(arr, result);
	return result;
}
function _dedim(arr, result) {
	if (dataTypeOf(arr) == 'array') {
		var len = arr.length;
		for (var i = 0; i < len; i++) {
			_dedim(arr[i], result);
		}
	}
	else {
		result.push(arr);
	}
}

// Function that outputs a more specific data type
function dataTypeOf(data) {
	return Object.prototype.toString.call(data).slice(8,-1).toLowerCase();
}

// clones an object
function clone(obj){
	return JSON.parse(JSON.stringify(obj));
}