{color white} r1
{x 0 y 0 z -0.05 s 5 5 0.1 color grey}box
//rule 1, fills the square

rule r1 md 4{
{ x -0.25 y 0.25 s 0.5 0.5 0.75 rz 180} r1
{ x 0.25 y -0.25 s 0.5 0.5 1 rz 0} r1
{ x -0.25 y -0.25 s 0.5 0.5 1 rz 90} r1
tower}

rule r1 md 5 {
{ x -0.25 y 0.25 s 0.5 0.5 1 rz 0} r1
{ x 0.25 y -0.25 s 0.5 0.5 0.75 rz 90} r1
{ x -0.25 y -0.25 s 0.5 0.5 1 rz 90} r1
tower}

rule tower w 1{
{z 0.01 rz 3 s 0.8}tower
 base}
rule tower w 1{
{z 0.01 rz 3 s 1.01}tower
 base}
rule tower w 1{
{z 0.01 rz 3 s 1.02}tower
 base}
rule tower w 1{
{z 0.01 rz 3 s 0.95}tower
 base}
rule tower w 0.5{}

rule base {
{x 0.25 y 0.25 s 0.45 0.45 0.01 sat 0.3}box}