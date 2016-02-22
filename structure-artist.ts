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

///<reference path="typings/browserify/browserify.d.ts"/>
///<reference path="typings/gl-matrix/gl-matrix.d.ts"/>
var glmat = require('./bower_components/gl-matrix/dist/gl-matrix-min.js');
import ShapeInstance = require('./structure');

class StructureArtist {

	public constructor(gl: WebGLRenderingContext, structure: ShapeInstance[]) {
		this.gl = gl;
		this.structure = structure;
		this.init();

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


		this.allvertices = [];
		this.alltriangles = [];

		// TODO: do all that in the web worker and on the GPU !
		for (var si = 0; si < structure.length; ++si) {
			for (var vi = 0; vi < 8; ++vi) {
				var vert = [0, 0, 0, 0];
				glmat.vec4.transformMat4(vert, [vertices[3 * vi], vertices[3 * vi + 1], vertices[3 * vi + 2], 1], structure[si].geospace);
				this.allvertices.push(vert[0], vert[1], vert[2]);
			}
			var tris = [];
			for (var fi = 0; fi < 12 * 3; ++fi) {
				this.alltriangles.push(triangles[fi] + si * 8);
			}
		}
	}

	private init() {
        var gl = this.gl;

        // gl.getExtension('OES_standard_derivatives');

        // Browserify will bundle shaders and js all together for us.
        // In order to do so, the tool must find a 'require' with a string literal argument
        // to figure out what must be bundled together
        require('./shaders/structure.vs');
        require('./shaders/structure.fs');
        
        this.structureProgram = gl.createProgram();
        gl.attachShader(this.structureProgram, StructureArtist.getShader(gl, './shaders/structure.vs'));
        gl.attachShader(this.structureProgram, StructureArtist.getShader(gl, './shaders/structure.fs'));
        gl.linkProgram(this.structureProgram);
    }

	public draw(prMatrix: Float32Array, mvMatrix: Float32Array): void {
		
		var gl = this.gl;
		gl.useProgram(this.structureProgram);

        var location = gl.getAttribLocation(this.structureProgram, 'aPos')
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.allvertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(location);

        // var solLocation = gl.getAttribLocation(this.structureProgram, "aCol");
        // gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sol), gl.STATIC_DRAW);
        // gl.vertexAttribPointer(solLocation, 1, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(solLocation);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.alltriangles), gl.STATIC_DRAW);

        gl.uniformMatrix4fv(gl.getUniformLocation(this.structureProgram, 'prMatrix'), false, prMatrix);
		gl.uniformMatrix4fv(gl.getUniformLocation(this.structureProgram, 'mvMatrix'), false, mvMatrix);
       
        gl.drawElements(gl.TRIANGLES, this.alltriangles.length, gl.UNSIGNED_SHORT, 0);

	}

	private static getShader(gl : WebGLRenderingContext, path : string) : WebGLShader {

        var shader: WebGLShader;

        var ext = path.substring(path.lastIndexOf(".") + 1);

        if (ext == 'fs')
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        else if (ext == 'vs')
            shader = gl.createShader(gl.VERTEX_SHADER);
        else return null;

        var glsl = require(path);

        gl.shaderSource(shader, glsl());
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) == 0)
            alert(path + "\n" + gl.getShaderInfoLog(shader));

        return shader;
    }

	private gl: WebGLRenderingContext;
 	private structureProgram: WebGLProgram;
  	private structure: ShapeInstance[];
	private allvertices: number[];
	private alltriangles: number[];

}
export = StructureArtist;