attribute vec3 aPos;

uniform mat4 mvMatrix;
uniform mat4 prMatrix;

void main(void) {
 gl_Position = prMatrix * mvMatrix * vec4(aPos, 1.0);
}