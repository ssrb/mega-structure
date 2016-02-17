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
		synth.synthesize()
	}
	scriptreq.send();
}

interface Statement {
	type: string;
}

interface DefStatement extends Statement {
	rule: string;
	weight: number;
	maxdepth: number;
	failover: string;
	production: InvocStatement[];
}

interface InvocStatement extends Statement {
	transformations: any[];
	next: string;
}

interface SetStatement extends Statement {
	// TODO
}

interface SynthFrame {
	rule: string;
	depth: number;
	geospace: Float32Array;
	colorspace: Float32Array;
}

interface ShapeInstance {
	shape: any;
	geospace: Float32Array;
	colorspace: Float32Array;
}

class Synthesizer {

	constructor(script : string) {
		// TODO: seed RNG ?
		this.ast = <Statement[]>eisenscript.parse(script);
		this.index = Synthesizer.indexRules(this.ast);	
	}

	private static indexRules(ast: Statement[]): collections.Dictionary<string, [number, DefStatement[]]> {		
		var index = new collections.Dictionary<string, [number, DefStatement[]]>();
		for (var si = 0; si < ast.length; ++si) {
			if (ast[si].type == "def") {
				var def = <DefStatement>ast[si];
				var wclauses = index.getValue(def.rule);
				if (!wclauses) {
					wclauses = [0, []];
					index.setValue(def.rule, wclauses);
				}
				wclauses[0] += def.weight;
				wclauses[1].push(def);
			}
		}
		index.forEach(function(rule: string, wclauses: [number, DefStatement[]]): void {
			wclauses[1].sort(function(left: DefStatement, right: DefStatement): number {
				return left.weight - right.weight;
			});
		});		
		return index;
	}

	private pickClause(rule: string): DefStatement {
		var wclauses = this.index.getValue(rule);
		var guess = wclauses[0] * Math.random();
		for (var ci = 0; ci < wclauses[1].length; ++ci) {
			var clause = wclauses[1][ci];
			guess -= clause.weight;
			if (guess < 0) {
				return clause;
			}
		}		
	}

	public synthesize(): ShapeInstance[] {

		var shapes = new Array<ShapeInstance>();
				
		for (var si = 0; si < this.ast.length; ++si) {
			switch (this.ast[si].type) {
				case "invoc":
					var invoc = <InvocStatement>this.ast[si];
					// TODO handle transformations at top level
					shapes.concat(this.synthesizeOne(invoc.next));
					break;
				case "set":
					break;
			}
		}
		
		return shapes;
	}

	public synthesizeOne(start: string): ShapeInstance[] {

		var stack = new collections.Stack<SynthFrame>();
		stack.push({ rule: start, depth: 0, geospace: glmat.mat4.create(), colorspace: glmat.mat4.create()});

		var shapes = new Array<ShapeInstance>();
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

			var {rule, depth, geospace, colorspace} = stack.pop();

			var clause = this.pickClause(rule);

			var localMaxDepth = clause.maxdepth;
			if (localMaxDepth >= 0 && depth >= localMaxDepth) {
				if (clause.failover) {
					stack.push({ rule: clause.failover, depth: 0, geospace, colorspace });
				}
				continue;
			}


			for (var pi = 0; pi < clause.production.length; ++pi) {

				var prod = clause.production[pi];

				var [geospaces, colorspaces] = this.applyTransform(prod.transformations, geospace, colorspace);			
				// if shape: 
				{
					for (var mi = 0; mi < geospaces.length; ++mi) {
						shapes.push({ shape: 42, geospace: geospaces[mi], colorspace: colorspaces[mi] });
					}
				} 
				// else if call
				{
					for (var mi = 0; mi < geospaces.length; ++mi) {
						var next = "";
						stack.push({ rule: prod.next, depth: depth + 1, geospace: geospaces[mi], colorspace: colorspaces[mi] });
					}
				}

			}		
		}

		console.debug("Generated %d shapes.", shapes.length);
		return shapes;
	}	

	private applyTransform(transform: any, geospace: Float32Array, colorspace: Float32Array): [Float32Array[], Float32Array[]] {
		// TODO : account for multipliers and chain of transformations
		return [[], []];
	}

	ast: Statement[];
	maxObjects: number;
	maxDepth: number;
	index: collections.Dictionary<string, [number, DefStatement[]]>;
}