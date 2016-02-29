# mega-structure

[![Build Status](https://travis-ci.org/ssrb/mega-structure.png)](https://travis-ci.org/ssrb/mega-structure)

Mega Structure is a structure synthesizer for the web based on [Mikael Hvidtfeldt](http://hvidtfeldts.net)'s eisenscript language.

The [Structure Synth](http://structuresynth.sourceforge.net) application provides the reference implementation for the language.

A similar project is called [Eisenscript](https://github.com/after12am/eisenscript).

### Eisenscript syntax

#### Termination criteria

* **set maxdepth [integer]**: stop when any generation path is [integer] long;
* **set maxobjects [integer]**: stop once [integer] objects have been created;
* **set minsize/maxsize [float]**: stop once a shape basis diagonal is below/above [float] units;
* **set seed [integer]**: set the PRNG seed used to choose between rules;
* **set background [color]**: self-explanatory

#### Rule modifiers

* **md / maxdepth [integer]**: stop if the current generation path includes [integer] call to that rule;
* **md / maxdepth [integer] > [rulename]**: same as above, failover rule [rulename] once the limit is reached;
* **w / weight [float]**: how likely the rule is going to be selected in case multiple rules have the same name. Default weight is 1.

#### Transformations

##### Geometric transformations

* **x [float]**: [float] units translation along the X axis;
* **y [float]**: as above;
* **z [float]**: as above;
* **rx [float]**: [float] degrees rotation about an axis colinear to X going through local coordinate (0, 0.5, 0.5);
* **ry [float]**: as above;
* **rz [float]**: as above;
* **s [float]**: uniformely scale by [float] along the 3 axis;
* **s [f1] [f2] [f3]**: scale along the X by [f1], along Y by [f2], along Z by [f3];
* **m [f1] ... [f9]**: 3x3 generic matrix transformation;
* **fx**: X axis mirror (flip sign of the frame x coordinates);
* **fy**: as above;
* **fz**: as above;

##### Color space transformations

* **h / hue [float]**: add [float] degrees to the current color hue. [0-360] normalized;
* **sat [float]**: multiply the current color saturation by [float]. [0-1] clamped;
* **b / brightness [float]**: multiply the current color brightness (HSV value) by [float]. [0-1] clamped;
* **a / alpha [float]**: multiply the current color alpha by [float]. [0-1] clamped;
* **color [color]**: set the current color to [color]

