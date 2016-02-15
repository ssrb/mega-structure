set background #222

set raytracer::light [0,5000,5000]
set raytracer::samples 8
set raytracer::ambient-occlusion-samples 2
set raytracer::phong [0.5,0.5,0.125]

{ color white } Core

rule Core
{
	{ y -1.5 } OuterRingStruct
	//{ s 1.1 0.5 1.1 x -12 y -1.25  } Stair
}

// Stairs

rule Stair
{
	700 * { ry 0.95 y 0.1 z 0.2 } Step
}

Rule Step
{
	{ s 1 0.025 0.1 } box
	{ b 0.25 s 1.5 0.01 0.01 } box
	{ b 0.25 ry 0.95 rx -29.4 x 0.75 s 0.1 0.025 0.25 } box
	{ b 0.25 ry 0.95 rx -23.4 x -0.75 s 0.1 0.025 0.25 } box
}

// OuterRing

rule OuterRingStruct md 4 
{
	{ x 1 z 10 } OuterRingSup1
	{ ry 11.25 y 2 } OuterRingStruct
}

rule OuterRingSup1 md 10 > OuterRingSup2
{
	{ ry 5.625  }OuterRingPart
	{ ry 11.25 x 2 } OuterRingSup1
}

rule OuterRingSup2 w 15 md 22
{
	{ ry 5.625  }OuterRingPart
	{ ry 11.25 x 2 } OuterRingSup2
}

rule OuterRingSup2 w 5
{
}

rule OuterRingPart
{
	{ b 0.25 y -1.5 rx -90 } Panel
	{ b 0.4 a 0.5 y 1.0 s 2.0 1 0.1 } box
	{ b 0.4 a 0.5 z 2 y 1.0 s 2.4 1 0.1 } box
	{ } Ringsub
}

// Ring

rule Ringsub w 1
{
	//{ ry 90 x -0.25 s 2 1.25 2.5 } thinPanelSquare1
	//{ ry 90 x 0.05 s 2 1.25 2.5 } thinPanelSquare1
	//{ b 0.25 ry 180 rz 90 s 0.5 0.5 0.4 } beamAssembly
//	{ b 0.25 rz 90 s 1 2 0.75 z 0.5 y -0.5 }RodBox
	{ s 1.25 } rodrow
}

rule Ringsub w 300 md 5
{
	//{ ry 90 x -0.25 s 2 1.25 2.5 } thinPanelSquare1
	//{ ry 90 x 0.05 s 2 1.25 2.5 } thinPanelSquare1
	{ s 1.25 } rodrow
	{ z 0.5 } Ringsub
}

rule Ringsub w 10
{
	{ s 1.25 } rodrow
}

rule Panel
{
	2 * { z 2 } PanelSub
	//{ b 0.5 a 0.5 z 3 s 0.5 0.1 1.75 } box
	{ y -1.9 z 3 s 0.05 0.05 1.925 } box
}

rule PanelSub
{
	{ s 2.2 0.25 0.125 } box
	{ y -1 s 0.05 1.75 0.05 } box
	{ y -1.925 s 2.4 0.1 0.05 } box

	//{ a 0.5 b 0.25 y 1.75 s 0.75 3 0.05 } box
}

// Boxform

rule boxForm1 w 15
{
	 boxForm2
}

rule boxForm1 w 1
{
}

rule boxForm2
{
	{} RodBox
	{ x 0.5521 z -0.5 s 1.2 }thinPanelSquare1
	{ x -0.5524 z -0.5 s 1.2 }thinPanelSquare1
	{ ry 90 s 1.2 }thinPanelSquare1
	{ ry 90 x 1 s 1.2 }thinPanelSquare1
	{ rz 90 z -0.5 s 1.2 }thinPanelSquare1
	{ rz 90 z -0.5 x 1 s 1.2 }thinPanelSquare1
}

rule thinPanelSquare1 w 6
{
	thinPanelSquare2
}

rule thinPanelSquare1 w 4
{
}

rule thinPanelSquare2
{
	//{ ry 90 rz 90 y -0.75 x 0.5 } rodrow
	{ y 0.5 s 0.075 5 0.75 } box
}

rule thinPanelSquare2 w 75
{
}

rule rodrow
{
	{ s 2.1 0.25 0.25 y 2 } box
}

rule RodBox
{
	RodBoxP1
	{ z -1 rx 90 } RodBoxP1
}

rule RodBoxP1
{
	RodBoxSide
	{ x 0.5 z -0.5 ry 90 } RodBoxSide
	{ x -0.5 z -0.5 ry -90 } RodBoxSide
	{ z -1 ry 180 }RodBoxSide
}

rule RodBoxSide
{
	{} Rod
	{ y 1 } Rod
}

rule Rod w 4
{
	{ s 0.965 0.2054 0.116 } box
	Rod2
}

rule Rod w 1
{
}

rule Rod2 w 1
{
	{ s 1.435 0.02 0.02 } box
}

rule Rod2 w 1
{
	{ s 1.763 0.02 0.02 } box
}

// Beam

rule beamAssembly
{
	{ z -5 } beam
	{ z 5 } beam

	{ s 1 0.2 11 y 12 } box
	{ s 1 0.2 11 y -12 } box

	{ z 5 } vertPanel
	{ z -5 } vertPanel
}

rule vertPanel 
{
	{ s 1 4 0.2 } box
	{ s 1 1 0.5 } box
}

rule vertPanel md 1 w 7
{
	widePane
	{ y 1 } vertPanel
}

rule vertPanel w 1
{
	{s 1 1 0.5 } box
	{s 0.2 4 0.2 x 2 } box
	{s 0.2 4 0.2 x -2 } box
	{s 1 0.2 0.2 y 10 } box
	{s 1 0.2 0.2 y -10 } box
}

rule beam 
{
	{ s 0.2 5 0.2 } box
}

rule widePane 
{
	thinBeam1
	{ y 5 } thinBeam1
	{ x 4.9 y 2.5 } thinBeamVert
	{ x -4.9 y 2.5 } thinBeamVert
	pane
}

rule pane 
{
	{s 10 5 0.05 y 0.5} box
}

rule pane 
{
	{ s 10 2.5 0.05 y 0.5 } box
}

rule thinBeam1 
{
	{ s 10 0.2 0.2 } box
}

rule thinBeamVert 
{
	{ s 0.2 5 0.2 } box
}