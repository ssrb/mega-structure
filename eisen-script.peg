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
{
	function extractOptional(optional, index) {
    	return optional ? optional[index] : null;
  	}
  
	function optionalList(value) {
		return value !== null ? value : [];
  	}
    
    function buildList(head, tail, index) {
      return [head].concat(extractList(tail, index));
    }
  
    function extractList(list, index) {
      var result = new Array(list.length), i;

      for (i = 0; i < list.length; i++) {
        result[i] = list[i][index];
      }

      return result;
    }
}

Start = Statements

Statements "statements"
	=  _? head:Statement tail:(_ Statement)*  _? {
    	return buildList(head, tail, 1);
    }

Statement "statement"
	=  SetStatement / TopLevelRuleInvoc / RuleDef

RuleDef "rule definition" 
	= "rule" _ name:RuleName modifiers:(_ RuleModifier)* _? "{" 
    		_? production:(head:RuleInvoc tail:(_ RuleInvoc)* {return buildList(head, tail, 1);})? _? 
       "}" {
    	return {name, modifiers: extractList(modifiers, 1), production}
    }
    
RuleModifier "rule modifier"
	= MMaxdepth / MWeight

RuleName "rule name"
	= !(Reserved _) identifier:Identifier {
    	return identifier
    }
    
TopLevelRuleInvoc
	= RuleInvoc
    
RuleInvoc "rule invocation"
	= transformations:(multiplier:Multiplier? "{" _? sequence:(head:Trans tail:(_ Trans)* {return buildList(head, tail, 1);})? _?"}" { return {multiplier, sequence}; })* _? next:(RuleName / Primitive) {
    	return {transformations, next}
    }

Multiplier "multiplier"
	= Integer _? "*" _?
    
Trans "transformation"
	= Tx / Ty / Tz / Rx / Ry / Rz / Scale / Fx / Fy / Fz / Matrix / Hue / Sat / Bright / Alpha / SetColor / Blend
    
// 3D-space transforms

Tx "translate x"
	= "x" _ dx:Float {
    	return {x: dx}
    }
    
Ty "translate y"
	= "y" _ dy:Float {
    	return {y: dy}
    }
    
Tz "translate z"
	= "z" _ dz:Float {
    	return {z: dz}
    }
    
Rx "rotate x"
	= "rx" _ theta:Float {
    	return {rx: theta}
    }
    
Ry "rotate y"
	= "ry" _ theta:Float {
    	return {ry: theta}
    }
    
Rz "rotate z"
	= "rz" _ theta:Float {
    	return {rz: theta}
    }

Scale "scale"
	= "s" _ Float (_ Float _ Float)?
    
Fx "flip x"
	= "fx" {
    	return {fx}
    }

Fy "flip y"
	= "fy" {
    	return {fy}
    }
    
Fz "flip z"
	= "fz" {
    	return {fz}
    }

Matrix "matrix"
	= "m" _ Float _ Float _ Float _ Float _ Float _ Float _ Float _ Float _ Float
    
// Colorspace transforms

Hue "hue"
	= "h" _ hue:Float {
    	return {hue};
    }
    / "hue" _ hue:Float {
    	return {hue};
    }
    
Sat "saturation"
	= "sat" _ sat:Float {
    	return {sat};
    }
    
Bright "brightness"
 	= "b" _ brightness:Float {
    	return {brightness};
    }
    / "brightness" _ Float  {
    	return {brightness};
    }
 
Alpha "alpha"
 	= ("a" _ Float) / ("alpha" _ Float)
 
SetColor "set color"
	= "color" _ Color

Blend "blend"
	= "blend" _ Float _ Float

// TODO
// set color random
// set colorpool [scheme]

MMaxdepth "maxdepth modifier"
	= ("md" / "maxdepth") _ Integer (_? ">" _? RuleName)?

MWeight "weight modifier"
	= ("w" _ Float) / ("weight" _ Float) 

Primitive "drawing primitive"
	= "box" / "grid" / "sphere" / "line" / "point" / "triangle" / "mesh" / "cylinder" / "tube"

SetStatement "set statement"
	= "set" _ (Maxdepth / MaxObjects / Minsize / Naxsize / Seed / Background)

Maxdepth "maxdepth action"
	= "maxdepth" _ Integer
    
MaxObjects"maxobjects action"
	= "maxobjects" _ Integer

Minsize "minsize action"
	= "minsize" _ Float

Naxsize "maxsize action"
	=  "maxsize" _ Float
    
Seed "seed action"
	= "seed" _ (Integer / "initial")

Background "background action"
	= "background" _ Color

DecimalDigit
	= [0-9]

NonZeroDigit
	= [1-9]

HexDigit "hex digit"
	= [0-9a-f]i
    
Character "character"
	= [a-z]i

UnsignedInteger "integer"
	= "0" / NonZeroDigit DecimalDigit*
    
Integer
	= [+-]? UnsignedInteger

ExponentPart
	= ExponentIndicator Integer

ExponentIndicator
	= "e"i
  
Float "float"
	= (Integer "." DecimalDigit* ExponentPart? / "." DecimalDigit+ ExponentPart? / Integer ExponentPart?) {
       return parseFloat(text());
    }

Color "color"
	= "#" HexDigit HexDigit HexDigit (HexDigit HexDigit HexDigit)?
    
Identifier "identifier"
	= head:("_" / Character) tail:("_" / Character / DecimalDigit)* { return head + tail.join("") }

_ "whitespace"
	= [ \t\n\r]+
    
Reserved "reserved"
	= "x" / "y" / "z" / "rx" / "ry" / "rz" / "s" / "fx" / "fy" / "fz" / "m" / "h" / "hue" / "sat" / "b" / "brightness" / "a" / "alpha" / "color" / "blend" / "rule" / "md" / "maxdepth" / "w" / "weight" / "set" / "maxdepth" / "maxobjects" / "minsize" /  "maxsize" / "seed" / "initial" / Primitive
