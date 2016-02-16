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
///<reference path="typings/pegjs/pegjs.d.ts"/>
var eisenscript = require('./eisen-script');
///<reference path="typings/gl-matrix/gl-matrix.d.ts"/>
var glmat = require('./bower_components/gl-matrix/dist/gl-matrix-min.js');

import collections = require('./node_modules/typescript-collections/collections');

// Temporary, used to test the parser without any ui
window.onload = () => {
    var scriptreq = new XMLHttpRequest();
    scriptreq.open('GET', './examples/mondrian_nc.es');
    scriptreq.onload = function() {
		var synth = new Synthesizer(scriptreq.responseText);
		// synth.synthesize()
	}
	scriptreq.send();
}

interface SynthFrame {
	rule: string;
	depth: number;
	matrix: Float32Array;
}

class Synthesizer {

	constructor(script : string) {
		// TODO: seed RNG
		this.ast = eisenscript.parse(script);
		// TODO: index the rules using a hash table + precompute the sum of the weights + sort by decreasing weight
	}

	public synthesize(): number[] {

		var shapes = new Array<number>();
			
		// TODO loop over all top level statements: some statement are rule invocation, some are set statement
		shapes.concat(this.synthesizeOne(""));

		return shapes;
	}

	public synthesizeOne(start : string): number[] {

		var stack = new collections.Stack<SynthFrame>();
		stack.push({ rule: this.pickClause(start), depth: 0, matrix: glmat.mat4.create() });

		var shapes = new Array<number>();
		while (!stack.isEmpty()) {

			if (shapes.length >= this.maxObjects) {
				console.debug("max objects reached");
				break;
			}

			// TODO: Report progress here

			// stack.size() isn't the depth
			if (stack.size() >= this.maxDepth) {
				continue;
			}

			var {rule, depth, matrix} = stack.pop();

			// TODO: check rule maxdepth
			var localMaxDepth = this.maxDepth;

			if (depth >= localMaxDepth) {
				// TODO: check the failover rule if any
				{
					var failover = this.pickClause("");
					stack.push({ rule: failover, depth: 0, matrix });
				}
				continue;
			}


			// foreach rule statement
			{				
				var matrices = this.applyTransform(/* transform : TODO , */matrix);			
				// if shape: 
				{
					for (var mi = 0; mi < matrices.length; ++mi) {
						shapes.push(42);
					}
				} 
				// else if call
				{
					for (var mi = 0; mi < matrices.length; ++mi) {
						var next = "";
						stack.push({ rule: next, depth : depth + 1, matrix: matrices[mi]});
					}
				}

			}		
		}

		console.debug("Generated %d shapes.", shapes.length);
		return shapes;
	}	

	private pickClause(ruleName: string) : string {
		// TODO look-up the index for ruleName, choose a clause at random accordingly to the weights
		return "";
	}
		
	private applyTransform(/* transform : TODO , */matrix: Float32Array): Float32Array[] {
		// TODO : account for multipliers and chain of transformations
		return [];
	}

	ast: any;
	maxObjects: number;
	maxDepth: number;
}