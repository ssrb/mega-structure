set background #444

set raytracer::light [0,5000,5000]
set raytracer::samples 8
set raytracer::ambient-occlusion-samples 2
set raytracer::phong [0.6,0.6,0.9]

{ color white } Core

rule Core
{
	SphereStuct
}

rule SphereStuct w 40 md 15
{
	ubox
	dbox
	{ x 2 y 3.25 ry 12 } SphereStuct
}

rule SphereStuct  w 14 {  r2 }

rule r2 w 10 
{  
	{} r2
}

rule r2 {  SphereStuct }

rule dbox w 8 maxdepth 3
{
	{ x 0 y -6.5 rx 3.6  } dbox
	{ ry 6 rx -1.8 } Panel
}
rule dbox w 8 maxdepth 2
{
	{ x 0 y -6.5 rx 3.6  } dbox
	{ b 0.5 ry 6 rx -1.8 } Panel
}
rule dbox { }

rule ubox w 8 maxdepth 3 
{
	{ x 0 y 6.5 rx -3.6  }  ubox
	{ ry 6 rx 1.8 } Panel
}
rule ubox w 8 maxdepth 2 
{
	{ x 0 y 6.5 rx -3.6  }  ubox
	{ b 0.5 ry 6 rx 1.8 } Panel
}
rule ubox { }

rule Panel md 1 w 1
{
	{ y 1.0 rz -60 y 1.0  } Panel
}

rule Panel md 6 w 16 
{
	PanelPart
	{ y 1.0 rz -60 y 1.0  } Panel
}
rule PanelPart
{
	{ rz 90 s 0.2 0.2 0.1 } beamAssembly
	{ s 0.1 1.75 1 } box
}

// Beam

rule beamAssembly w 1
{
	{ z -5 } beam
	{ z 5 } beam

	{ s 1 0.2 11 y 12 } box
	{ s 1 0.2 11 y -12 } box

	{ z 0.4 } vertPanel
	{ z 5 } vertPanel
	{ z -5 } vertPanel
}

rule beamAssembly w 6
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