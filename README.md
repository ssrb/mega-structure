# mega-structure

[![Build Status](https://travis-ci.org/ssrb/mega-structure.png)](https://travis-ci.org/ssrb/mega-structure)

Mega Structure is a structure synthesizer for the web based on [Mikael Hvidtfeldt](http://hvidtfeldts.net)'s eisenscript language.

The [Structure Synth](http://structuresynth.sourceforge.net) application provides the reference implementation for the language.

A similar project is called [Eisenscript](https://github.com/after12am/eisenscript).

## Eisenscript syntax

### Termination criteria

* **set maxdepth [integer]**
Breaks after [integer] iterations (generations). This will also serve as a upper recursion limit for all rules.
* **set maxobjects [integer]**
After [integer] objects have been created, the construction is terminated.
* **set minsize [float]**
Allows you to specify how large or small a given object can be before terminating. The 'size' parameter refers to the length of the diagonal of a unit cube in the current local state. The initial coordinate frame goes from (0,0,0) to (1,1,1) and hence has a diagonal length of sqrt(3)~1.7). It is possible to specify both a mix and a min size. The termination criteria only stops the current branch - if other branches are still within a valid range, the will be continued. More info...
set maxsize [float]
See above.
Other

* **set seed [integer]**
Allows you to set the random seed. This makes it possible to reproduce creations.
* **set seed initial**
This allows you to set the seed to its initial value (the value specified in the seed box). Notice that each rule call branch maintains its own sequence of random numbers. This makes it possible to generate the same set of random numbers as used earlier, making it possible to combine randomness with self-similarity. More info.
* **set background [color]**
Allows you to set the background color. Colors are specified as text-strings parsed using Qt's color parsing, allowing for standard HTML RGB specifications (e.g. #F00 or #FF0000), but also SVG keyword names (e.g. red or even lightgoldenrodyellow).
Rule modifiers

* **md / maxdepth [integer]**
Rule Retirement.Sets the maximum recursive for the rule. The rule would not execute any actions after this limit has been reached.
* **md / maxdepth [integer] > [rulename]**
Rule Retirement with substitution.Sets the maximum recursive for the rule. After this limit has been reached [rulename] will be executed instead this rule.
* **w / weight [float]**
Ambiguous rules.If several rules are defined with the same name, a random definition is chosen according to the weight specified here. If no weight is specified, the default weight of 1 is used.
Transformations

### Geometrical transformations

* **x [float]**
X axis translation. The float argument is the offset measured in units of the local coordinate system.
* **y [float]**
Y axis translation. As above.
* **z [float]**
Z axis translation. As above.
* **rx [float]**
Rotation about the x axis. The 'float' argument is the angle specified in degrees. The rotation axis is centered at the unit cube in the local coordinate system: that is the rotation axis contains the line segment from (0, 0.5, 0.5) -> (1, 0.5, 0.5).
* **ry [float]**
Rotation about the y axis. As above.
* **rz [float]**
Rotation about the z axis. As above.
* **s [float]**
Resizes the local coordinate system. Notice that the center for the resize is located at the center of the unit cube in the local system (at (0.5,0.5,0.5)
* **s [f1] [f2] [f3]**
Resizes the local coordinate system. As above but with separate scale for each dimension.
* **m [f1] ... [f9]**
Applies the specified 3x3 rotation matrix to the transformation matrix for the current state. About the argument order: [f1],[f2],[f3] defines the first row of the matrix.
* **fx**
Mirrors the local coordinate system about the x-axis. As above the mirroring planes is centered at the cube.
* **fy**
Mirrors the local coordinate system about the y-axis.
* **fz**
Mirrors the local coordinate system about the z-axis.

### Color space transformations

* **h / hue [float]**
Adds the 'float' value to the hue color parameter for the current state. Hues are measured from 0 to 360 and wraps cyclicly - i.e. a hue of 400 is equal to a hue of 40.
* **sat [float]**
Multiplies the 'float' value with the saturation color parameter for the current state. Saturation is measured from 0 to 1 and is clamped to this interval (i.e. values larger then 1 are set to 1).
* **b / brightness [float]**
Multiples the 'float' value with the brightness color parameter for the current state. Brightness is measured from 0 to 1 and is clamped to this interval. Notice that parameter is sometimes called 'V' or 'Value' (and the color space is often refered to as HSV).
* **a / alpha [float]**
Multiplies the 'float' value with the alpha color parameter for the current state. Alpha is measured from 0 to 1 and is clamped to this interval. An alpha value of zero is completely transparant, and an alpha value of one is completely opaque.
* **color [color]**
This commands sets the color to an absolut color (most other transformations are relative modifications on the current state). Colors are specified as text-strings parsed using Qt's color parsing, allowing for standard HTML RGB specifications (e.g. #F00 or #FF0000), but also SVG keyword names (e.g. red or even lightgoldenrodyellow)
