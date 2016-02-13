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
Start = Statements

Statements "statements"
	=  _? Statement (_ Statement)* _?

Statement "statement"
	=  (Action / RAction / RuleDef)

RuleDef "rule definition" 
	= "rule" _ RName (_ RModifier)* _? "{" _? (RAction (_ RAction)*)? _? "}"
    
RModifier "rule modifier"
	= MMaxdepth / MWeight

RName "rule name"
	= !Reserved Identifier

RAction "raction"
	= (Multiplier? "{" _? (Trans (_ Trans)*)? _?"}")* _? (RName / Primitive)

Multiplier "multiplier"
	= Integer _? "*" _?
    
Trans "transformation"
	= Tx / Ty / Tz / Rx / Ry / Rz / Scale / Fx / Fy / Fz / Matrix / Hue / Sat / Bright / Alpha / SetColor / Blend
    
// 3D-space transforms

Tx "translate x"
	= "x" _ Float
    
Ty "translate y"
	= "y" _ Float
    
Tz "translate z"
	= "x" _ Float
    
Rx "rotate x"
	= "rx" _ Float
    
Ry "rotate y"
	= "ry" _ Float
    
Rz "rotate z"
	= "rz" _ Float

Scale "scale"
	= "s" _ Float _ Float _ Float
    
Fx "flip x"
	= "fx"

Fy "flip y"
	= "fy"
    
Fz "flip z"
	= "fz"

Matrix "matrix"
	= "m" _ Float _ Float _ Float _ Float _ Float _ Float _ Float _ Float _ Float
    
// Colorspace transforms

Hue "hue"
	= ("h" / "hue") _ Float
    
Sat "saturation"
	= "sat" _ Float
    
Bright "brightness"
 	= ("b" / "brightness") _ Float
 
Alpha "alpha"
 	= ("a" / "alpha") _ Float
 
SetColor "set color"
	= "color" _ Color

Blend "blend"
	= "blend" _ Float _ Float

// TODO
// set color random
// set colorpool [scheme]

MMaxdepth "maxdepth modifier"
	= ("md" / "maxdepth") _ Integer (_? ">" _? RName)?

MWeight "weight modifier"
	= ("w" / "weight") _ Float

Primitive "drawing primitive"
	= "box" / "grid" / "sphere" / "line" / "point" / "triangle" / "mesh" / "cylinder" / "tube"

Action "action"
	= "set" _ (AMaxdepth / AMaxObjects / AMinsize / ANaxsize / ASeed / ABackground)

AMaxdepth "maxdepth action"
	= "maxdepth" _ Integer
    
AMaxObjects"maxobjects action"
	= "maxobjects" _ Integer

AMinsize "minsize action"
	= "minsize" _ Float

ANaxsize "maxsize action"
	=  "maxsize" _ Float
    
ASeed "seed action"
	= "seed" _ (Integer / "initial")

ABackground "background action"
	= "background" _ Color

Digit "digit"
	= [0-9]
    
Letter "letter"
	= [a-zA-Z]

Integer "integer"
	= Digit+ { return parseInt(text(), 10); }

Float "float"
	= Digit+ { return parseInt(text(), 10); }

Color "color"
	= "color"
    
Identifier "identifier"
	= ("_" / Letter) ("_" / Letter / Digit)*

_ "whitespace"
	= [ \t\n\r]+
    
Reserved "reserved"
	= "x" / "y" / "z" / "rx" / "ry" / "rz" / "s" / "fx" / "fy" / "fz" / "m" / "h" / "hue" / "sat" / "b" / "brightness" / "a" / "alpha" / "color" / "blend" / "rule" / "md" / "maxdepth" / "w" / "weight" / "set" / "maxdepth" / "maxobjects" / "minsize" /  "maxsize" / "seed" / "initial" / Primitive
