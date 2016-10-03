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
import EisenScripts = require('./examples-generated');
import { ShapeInstance } from './structure';
import { Progress } from './progress';

var renderer : THREE.WebGLRenderer;

function toggleFullScreen() {
	var doc = <any>document;
	if (!doc.mozFullScreenElement && !doc.webkitFullscreenElement) {
		var canvas = <any>renderer.domElement;
		if (canvas.mozRequestFullScreen) {
			canvas.mozRequestFullScreen();
		} else {
			canvas.webkitRequestFullscreen((<any>Element).ALLOW_KEYBOARD_INPUT);
		}
	} else {
		if (doc.mozCancelFullScreen) {
			doc.mozCancelFullScreen();
		} else {
			doc.webkitExitFullscreen();
		}
	}
}

window.addEventListener('load', () => {
		
	document.addEventListener("keydown", e => {
		if (e.keyCode == 122) {
			e.preventDefault();
			toggleFullScreen();
		}
	}, false);

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.autoClear = false;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.domElement.addEventListener("dblclick", e => {
		toggleFullScreen();
	}, false);

	var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
	camera.position.z = 1.5;
	
	var view = document.getElementById("structure-view");	
	view.appendChild(renderer.domElement);

	var scene = new THREE.Scene();
	scene.add(camera);

	// Overlay test
	var progress = new Progress();
	var olaycam = new THREE.OrthographicCamera(-0.5 * camera.aspect, 0.5 * camera.aspect, -0.5, 0.5, 0.1, 10000);
	olaycam.position.z = 100;
	var olayscene = new THREE.Scene();
	olayscene.add(olaycam);

	var tt = new THREE.Texture(progress.canvas);
	var progressMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(1, 1), new THREE.MeshBasicMaterial( {
		map: tt,
		depthWrite: false,
		depthTest: false,
		transparent: true
	}));
	// Face the ortho camera
	progressMesh.rotateX(Math.PI);
	progressMesh.visible = false;
	olayscene.add(progressMesh);
	// End

	var material =
		new THREE.MeshPhongMaterial({
			vertexColors: THREE.FaceColors,
			side: THREE.DoubleSide,
			shading: THREE.FlatShading
		});

	var mesh = new THREE.Mesh(
			new THREE.BoxGeometry(0, 0, 0),
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
	
	var controls = new THREE.OrbitControls(camera, renderer.domElement);	
	controls.enableKeys = false;
	controls.target.set(0, 0, 0);

	var turntable = true;

	var lastTime = new Date().getTime();
	function animate() : void {

		var timeNow = new Date().getTime();
		
		if (turntable) {
			var dt = (timeNow - lastTime) / (60 * 1000);
			var dtheta = 2 * Math.PI * 1 * dt
			mesh.rotation.x += dtheta;
			mesh.rotation.y += dtheta;
		}
		
		renderer.clear(true, true, true);
		renderer.render(scene, camera);

		if (progressMesh.visible) {
			var s = renderer.getSize();
			progress.render(timeNow, s.height);
			tt.needsUpdate = true;
			renderer.clear(false, true, true);
			renderer.render(olayscene, olaycam);
		}

		requestAnimationFrame(animate);

		lastTime = timeNow;
	}

	var resizeTimer;
	function doResize() : void {
		clearTimeout(resizeTimer);
	  	resizeTimer = setTimeout(() => {
	  		var doc = <any>document;
			if (!doc.mozFullScreenElement && !doc.webkitFullscreenElement) {
			    var w = view.offsetWidth, h = window.innerHeight - document.getElementById("header").offsetHeight;
				w *= 0.95;
				h *= 0.95;
				renderer.setSize(w, h);
				$(".CodeMirror").height(h + "px");
			} else {
				renderer.setSize(window.innerWidth, window.innerHeight);
			}

			var s = renderer.getSize();
			camera.aspect = s.width / s.height;
			camera.updateProjectionMatrix();

			olaycam.left = -0.5 * camera.aspect;
			olaycam.right = 0.5 * camera.aspect;
			olaycam.updateProjectionMatrix();

	  	}, 100);
	};
	window.addEventListener('resize', doResize);

	var app: ng.IModule = angular.module('MegaStructure.App', ['ui.codemirror']);

	app.controller('CodemirrorCtrl', ['$scope', function($scope) {	
		$scope.examples = Object.keys(EisenScripts);
		$scope.example = 'frameinframe';
		$scope.exampleChanged = function() {
			$scope.cmModel = EisenScripts[$scope.example];
		}
		$scope.exampleChanged();

		$scope.cmOption = {
			lineNumbers: true,
			matchBrackets: true,
			mode: 'eisen-script',
			theme: 'twilight'
		};

		$scope.turntable = function() {
			turntable = !turntable;
		}

		$scope.resetViewport = function() {
			var bbox = mesh.geometry.boundingBox;
			var diag = new THREE.Vector3();
			diag.subVectors(bbox.max, bbox.min);
			
			camera.position.x = 0;
			camera.position.y = 0;
			camera.position.z = Math.max(diag.x, diag.y) / Math.tan(0.5 * camera.fov * Math.PI / 180);

			camera.rotation.x = 0;
			camera.rotation.y = 0;
			camera.rotation.z = 0;
					
			controls.target.set(0, 0, 0);
			controls.update();

			mesh.rotation.x = 0;
			mesh.rotation.y = 0;
		}

		$scope.synthetize = function() {+
			console.log('Synth request !');
			progress.nshapes = 0;
			tstamp = new Date().getTime();
			progressMesh.visible = true;
			myWorker.postMessage($scope.cmModel);
		}

		var tstamp = 0;

		var myWorker = new Worker("synthesizer-webworker.js");
		myWorker.onmessage = function(e) {
			var msg = e.data;
			switch (msg.type) {
				case 'progress':
					progress.nshapes = msg.nshapes;
					break;
				case 'done':
					renderer.setClearColor(new THREE.Color(msg.background));
					var geometry = new THREE.BufferGeometry();
					geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(msg.position), 3));
					geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(msg.color), 3 ));
					geometry.center();
					progressMesh.visible = false;
					mesh.geometry = geometry;
					$scope.resetViewport();
					console.log('Synth request processed in ' + (new Date().getTime() - tstamp) + 'ms');
					break;
			}
			$scope.$apply();
		}

		$scope.synthetize();
	}]);
		
	requestAnimationFrame(animate);
	doResize();
});
