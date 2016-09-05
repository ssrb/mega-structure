# mega-structure

[![Build Status](https://travis-ci.org/ssrb/mega-structure.png)](https://travis-ci.org/ssrb/mega-structure)

mega-structure is a structure synthesizer for the web based on [Mikael Hvidtfeldt](http://hvidtfeldts.net)'s eisenscript language.

![Screenshot 1](https://raw.githubusercontent.com/ssrb/mega-structure/master/screenshots/hexstruct.png)

![Screenshot 2](https://raw.githubusercontent.com/ssrb/mega-structure/master/screenshots/minmax.png)

![Screenshot 3](https://raw.githubusercontent.com/ssrb/mega-structure/master/screenshots/mondrian.png)

The [Structure Synth](http://structuresynth.sourceforge.net) application provides the reference implementation for the language.

A similar project is called [Eisenscript](https://github.com/after12am/eisenscript).

### Eisenscript syntax

#### Termination criteria

* **set maxdepth [integer]**: break a generation path as soon as a it's [integer] long;
* **set maxobjects [integer]**: stop as soon as [integer] objects have been created;
* **set minsize/maxsize [float]**: break a generation path when the local coordinate frame diagonal is below/above [float] units;
* **set seed [integer]**: seed the PRNG used to choose between rules;
* **set background [color]**: self-explanatory

#### Rule modifiers

* **md / maxdepth [integer]**: break a generation path if it includes [integer] call to that rule;
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
* **s [f1] [f2] [f3]**: scale along the X axis by [f1], along Y by [f2], along Z by [f3];
* **m [f1] ... [f9]**: 3x3 generic matrix transformation;
* **fx**: X axis mirror (flip sign of the frame x coordinates);
* **fy**: as above;
* **fz**: as above;

##### Color space transformations

* **h / hue [float]**: add [float] degrees to the current color hue. Result is [0-360] normalized;
* **sat [float]**: multiply the current color saturation by [float]. Result is [0-1] clamped;
* **b / brightness [float]**: multiply the current color brightness (HSV value) by [float]. Result is [0-1] clamped;
* **a / alpha [float]**: multiply the current color alpha by [float]. Result is [0-1] clamped;
* **color [color]**: set the current color to [color]

