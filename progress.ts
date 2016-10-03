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

export class Progress extends THREE.Mesh {

	public constructor() {

		var canvas = document.createElement('canvas');
		var texture = new THREE.Texture(canvas);

		super(new THREE.PlaneBufferGeometry(1, 1), new THREE.MeshBasicMaterial( {
			map: texture,
			depthWrite: false,
			depthTest: false,
			transparent: true
		}));

		this.texture = texture;
		this.texture.needsUpdate = true;

		this.canvas = canvas;

		this.rotateX(Math.PI);
		this.visible = false;

		this.nshapes = 0;
		this.nprocessed = 0;
	}

	public init() {
		this.nshapes = 0;
		this.nprocessed = 0;
	}

	public update(msg: any) {
		this.nshapes = msg.nshapes;
		this.nprocessed = msg.nprocessed;
	}

	public setPixelSize(size: number) {
		this.canvas.width = this.canvas.height = size;
	}

	public animate(tick : number) {

		var context = this.canvas.getContext('2d');
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		context.font = "48px serif";
		context.textAlign = "center";
		context.fillStyle = 'white';
		context.strokeStyle = 'black';
		context.fillText(this.nshapes + " shapes", this.canvas.width / 2, this.canvas.height / 2);
		context.strokeText(this.nshapes + " shapes", this.canvas.width / 2, this.canvas.height / 2);

		context.fillStyle = 'white';
		context.strokeStyle = 'white';

		context.beginPath();
		context.moveTo(this.canvas.width / 2 - 100, this.canvas.height / 2 + 100);
		context.lineTo(this.canvas.width / 2 - 100, this.canvas.height / 2 + 120);
		context.lineTo(this.canvas.width / 2 + 100, this.canvas.height / 2 + 120);
		context.lineTo(this.canvas.width / 2 + 100, this.canvas.height / 2 + 100);
		context.lineTo(this.canvas.width / 2 - 100, this.canvas.height / 2 + 100);
		context.closePath();

		context.stroke();

		var proccessedRatio = this.nprocessed / this.nshapes;

		context.beginPath();
		context.moveTo(this.canvas.width / 2 - 100, this.canvas.height / 2 + 100);
		context.lineTo(this.canvas.width / 2 - 100, this.canvas.height / 2 + 120);
		context.lineTo(this.canvas.width / 2 - 100 + 200 * proccessedRatio, this.canvas.height / 2 + 120);
		context.lineTo(this.canvas.width / 2 - 100 + 200 * proccessedRatio, this.canvas.height / 2 + 100);
		context.lineTo(this.canvas.width / 2 - 100, this.canvas.height / 2 + 100);
		context.closePath();

		context.fill();

		this.texture.needsUpdate = true;
	}

	canvas : HTMLCanvasElement;
	texture : THREE.Texture;
	nshapes: number;
	nprocessed: number;
	lastTick : number;
};