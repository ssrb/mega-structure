set background #444

set raytracer::light [0,5000,5000]
set raytracer::samples 6
set raytracer::ambient-occlusion-samples 2
set raytracer::phong [0.6,0.6,0.9]

{ color white z 4.5 } Core

rule Core
{
	{ y 4.5 } PanelStruct
}

// Panelstruct

rule PanelStruct w 1 md 4
{
	{ ry 90 } Panel
	{ y 2.0 } PanelStruct
}

rule PanelStruct2 w 0
{
	{} Panel
}

rule Panel md 5
{
	{}PanelPart
	{ ry -60 x 0.325 z 0.6 } Panel
}

rule Panel2 md 5 w 50
{
	{}PanelPart
	{ ry 60 x 0.325 z 0.6  } Panel
}

rule Panel2 md 1 w 0
{
}

rule PanelPart w 4
{
	{ rz 90 s 0.2 0.05 0.1 } beamAssembly
	{ s 0.05 2.0 0.8 } box
}

rule PanelPart w 2
{
	{ b 0.5 rz 90 s 0.2 0.05 0.1 } beamAssembly
	{ b 0.5 s 0.05 2.0 0.8 } box
}

// Beam

rule beamAssembly w 4
{
	{ z -5 } beam
	{ z 5 } beam

	{ s 1 0.2 11 y 12 } box
	{ s 1 0.2 11 y -12 } box

	{ z 0.4 } vertPanel
	{ z 5 } vertPanel
	{ z -5 } vertPanel
}

rule beamAssembly w 2
{
}

rule vertPanel 
{
	{s 1 4 0.2} box
	{s 1 1 0.5} box
}

rule vertPanel md 15 > end 
{
	widePane
	{ y 1 } vertPanel
}

rule end 
{
}

rule vertPanel 
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