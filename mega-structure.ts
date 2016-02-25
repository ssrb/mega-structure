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
var tinycolor = require('./bower_components/tinycolor/tinycolor.js');

import EisenScripts = require('./examples-generated');
import ShapeInstance = require('./structure');

function CreateGeometry(structure: ShapeInstance[]): THREE.Geometry {

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
			glmat.vec4.transformMat4(vert, [vertices[3 * vi] - 0.5, vertices[3 * vi + 1] - 0.5, vertices[3 * vi + 2] - 0.5, 1], structure[si].geospace);
			geometry.vertices.push(new THREE.Vector3(vert[0], vert[1], vert[2]));
		}
		var tris = [];
		for (var fi = 0; fi < 12; ++fi) {
			var face = new THREE.Face3(triangles[3 * fi] + si * 8, triangles[3 * fi + 1] + si * 8, triangles[3 * fi + 2] + si * 8);
			var rgb = tinycolor(structure[si].colorspace).toRgb();
			face.color = new THREE.Color(rgb.r / 255, rgb.g / 255, rgb.b / 255);
			geometry.faces.push(
				face
			);
		}
	}

	return geometry;
}

var mesh: THREE.Mesh;

var app: ng.IModule = angular.module('MegaStructure.App', ['ui.codemirror']);

app.controller('CodemirrorCtrl', ['$scope', function($scope) {	
	$scope.examples = Object.keys(EisenScripts);
	$scope.example = 'mondrian';
	$scope.exampleChanged = function() {
		$scope.cmModel = EisenScripts[$scope.example];
	}
	$scope.exampleChanged();

	$scope.cmOption = {
		lineNumbers: true,
		mode: 'eisen-script',
		theme: 'twilight'
	};

	$scope.synthetize = function() {
		var myWorker = new Worker("synthesizer-webworker.js");
		myWorker.onmessage = function(e) {
			$scope.structure = e.data;
			mesh.geometry = CreateGeometry(e.data);
			myWorker.terminate();
		}
		myWorker.postMessage($scope.cmModel);
	}

	$scope.synthetize();

}]);

window.onload = () => {

	var view = document.getElementById("structure-view");

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);

	var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 50);
	camera.position.z = 3

	function doResize(): void {
		var w = view.offsetWidth, h = window.innerHeight - document.getElementById("header").offsetHeight;
		w *= 0.95;
		h *= 0.95;
		renderer.setSize(w, h);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	}
	doResize();
	window.addEventListener('resize', doResize);

	view.appendChild(renderer.domElement);

	var scene = new THREE.Scene();

	scene.add(camera);

	var material =
		new THREE.MeshPhongMaterial({
			vertexColors: THREE.FaceColors,
			side: THREE.DoubleSide,
			shading: THREE.FlatShading
		});

	mesh = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			material
		);

	scene.add(mesh);

	var ambientLight = new THREE.AmbientLight(0x000000);
	scene.add(ambientLight);

	var lights = [];
	lights[0] = new THREE.PointLight(0xffffff, 1, 0);
	lights[1] = new THREE.PointLight(0xffffff, 1, 0);
	lights[2] = new THREE.PointLight(0xffffff, 1, 0);

	lights[0].position.set(0, 200, 0);
	lights[1].position.set(100, 200, 100);
	lights[2].position.set(-100, -200, -100);

	scene.add(lights[0]);
	scene.add(lights[1]);
	scene.add(lights[2]);
	
	var controls = new THREE.OrbitControls(camera, view);
	controls.target.set(0, 0, 0);
	controls.update();

	var lastTime = new Date().getTime();
	var theta = 0;
	function animate() {

		var timeNow = new Date().getTime();

		// "Turntable"
		var dt = (timeNow - lastTime) / (60 * 1000);
		theta += 2 * Math.PI * 1 * dt
		
		//mesh.translateOnAxis(mesh.geometry.center(), mesh.geometry.center().length());

		mesh.rotation.x = theta;
		mesh.rotation.y = theta;

		renderer.render(scene, camera);

		requestAnimationFrame(animate);

		lastTime = timeNow;
	}

	animate();
}
