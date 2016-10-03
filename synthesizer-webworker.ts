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

///<reference path="typings/index.d.ts"/>
var THREE = require('./bower_components/three.js/three.min.js');
var glmat = require('./bower_components/gl-matrix/dist/gl-matrix-min.js');
var tinycolor = require('./bower_components/tinycolor/tinycolor.js');

import { Synthesizer } from './synthesizer';
import { ShapeInstance } from './structure';

interface GeoGenProgressFunc {
	(ngenerated: number, done: boolean): void;
}

// Optimize: 2 pass: 1) compute ArrayBuffer size 2) populate without any alloc in critical loop, do not use THREE
function GenerateGeometry(structure: ShapeInstance[], progress: GeoGenProgressFunc) : THREE.BufferGeometry {

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

	for (var vi = 0; vi < vertices.length; ++vi) {
		vertices[vi] -= 0.5;
	}

	var vert = [0, 0, 0, 0];

	for (var si = 0; si < structure.length; ++si) {
		var s = si * 8;
		var rgb = tinycolor(structure[si].colorspace).toRgb();
		var color = new THREE.Color(rgb.r / 255, rgb.g / 255, rgb.b / 255);
		switch (structure[si].shape) {
			case "box":
				for (var vi = 0; vi < vertices.length; vi += 3) {
					glmat.vec4.transformMat4(vert, [vertices[vi], vertices[vi + 1], vertices[vi + 2], 1], structure[si].geospace);
					geometry.vertices.push(new THREE.Vector3(vert[0], vert[1], vert[2]));
				}
				for (var fi = 0; fi < triangles.length; fi += 3) {
					var face = new THREE.Face3(triangles[fi] + s, triangles[fi + 1] + s, triangles[fi + 2] + s);
					face.color = color;
					geometry.faces.push(
						face
					);
				}
				break;
			case "sphere":
				break;
		};
		progress(1 + si, false);
	}

	progress(structure.length, true);

	var bgeometry = new THREE.BufferGeometry();
	bgeometry.fromGeometry(geometry);
	return bgeometry;
}

onmessage = function(e) {

	var worker = this;

	var synth = new Synthesizer(e.data, (() => {
			var nshapesLast = 0;
			return (shapes : ShapeInstance[], done : boolean) => {
				if (shapes.length - nshapesLast >= 100 || done) {
					this.postMessage({ type: 'progress', nshapes:shapes.length, nprocessed:0});
					nshapesLast = shapes.length;
				}
			};
		}) ()
	);

	console.log('Synthesizing !');
	var tstamp = new Date().getTime();
	var structure = synth.synthesize();
	console.log('Synthesized in ' + (new Date().getTime() - tstamp) + 'ms');

	console.log('Detailing geometry !');
	tstamp = new Date().getTime();
	var bgeo = GenerateGeometry(structure, (() => {
			var nshapesLast = 0;
			return (nshapes : number, done : boolean) => {
				if (nshapes - nshapesLast >= 100 || done) {
					this.postMessage({ type: 'progress', nshapes:structure.length, nprocessed:nshapes});
					nshapesLast = nshapes;
				}
			};
		}) ()
	);

	console.log('Detailed in ' + (new Date().getTime() - tstamp) + 'ms');

	console.log('Posting structure !');
	tstamp = new Date().getTime();
	var position =  (<any>bgeo.getAttribute ('position')).array.buffer;
	var color =  (<any>bgeo.getAttribute ('color')).array.buffer;
	worker.postMessage({
		type: 'done',
		background:synth.background,
		position: position,
		color: color
	}, [position, color]);
	console.log('Posted in ' + (new Date().getTime() - tstamp) + 'ms');
}

