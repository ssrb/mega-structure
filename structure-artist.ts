// Copyright (c) 2016, Sebastien Sydney Robert Bigot
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this
//    list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
// ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those
// of the authors and should not be interpreted as representing official policies,
// either expressed or implied, of the FreeBSD Project.

///<reference path="typings/tsd.d.ts"/>
var glmat = require('./bower_components/gl-matrix/dist/gl-matrix-min.js');
import ShapeInstance = require('./structure');

class StructureArtist {

    static CreateGeometry(structure: ShapeInstance[]): THREE.Geometry {

        var geometry = new THREE.Geometry();

		var triangles = [0, 1, 2, 1, 2, 3,
			4, 5, 6, 5, 6, 7,
			0, 1, 4, 1, 4, 5,
			2, 3, 6, 3, 6, 7,
			0, 2, 4, 2, 4, 6,
			1, 3, 5, 3, 5, 7];

        var vertices = [0, 0, 0,
        				0, 0, 1,
        				0, 1, 0,
        				0, 1, 1,
        				1, 0, 0,
        				1, 0, 1,
        				1, 1, 0,
        				1, 1, 1];

		// TODO: do all that in the web worker and on the GPU !
		for (var si = 0; si < structure.length; ++si) {
			for (var vi = 0; vi < 8; ++vi) {
				var vert = [0, 0, 0, 0];
				glmat.vec4.transformMat4(vert, [vertices[3 * vi], vertices[3 * vi + 1], vertices[3 * vi + 2], 1], structure[si].geospace);
                geometry.vertices.push(new THREE.Vector3(vert[0], vert[1], vert[2]));
			}
			var tris = [];
			for (var fi = 0; fi < 12; ++fi) {
                geometry.faces.push(
                    new THREE.Face3(triangles[3 * fi] + si * 8, triangles[3 * fi + 1] + si * 8, triangles[3 * fi + 2] + si * 8)
                );
			}
		}

        return geometry;
	}
}
export = StructureArtist;