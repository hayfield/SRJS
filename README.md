An attempt to port the Student Robotics API to JavaScript to allow easier testing of algorithms by providing a 3D arena which robots can move around in that doesn't involve card stuck to table legs. It also allows testing to be performed before anything has been physically constructed.

# Docs

# Getting Started

See examples/boilerplate.html for an annotated layout which can be used as the basis of code you write.

# SRJS Functions and Notes

`this` and `robot`
When writing code for the robot within the `main()` and `initialise()` functions, `this` and `robot` refers to the Robot being controlled. In some cases such as within a [forEach](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach) loop it's necessary to pass one of the two as a parameter if `this` is to reference the correct thing.

`robot.createProperty( name, initialValue )`
Used to create a property with a given name which will keep its value between calls to `robot.main()`, while allowing multiple robots to use the same variable names.
### Example
```javascript
robot.createProperty( 'hitAWall', false ); // create the property
var shouldReverse = robot.hitAWall; // access the value and store it in another variable
robot.hitAWall = true; // change the value after initialisation
```

# Motor Control ([Python Docs](https://www.studentrobotics.org/docs/programming/sr/motor/))

Setting the speed of the motors is similar to in Python. The only difference is the statements needs to be prefixed by `robot.`.
 * `robot.motor[0]` is the left wheel
 * `robot.motor[1]` is the right wheel

### Python
```python
motor[0].target = 100
motor[1].target = 100
```
### Javascript
```javascript
robot.motor[0].target = 100;
robot.motor[1].target = 100;
```

# IO ([Python Docs](https://www.studentrobotics.org/docs/programming/sr/io/))

There are some notable differences between the Python API and SRJS.
In Python, `io[IO_BOARD_NUMBER]` has two properties: `input` and `output`, which are arrays of input or output devices respectively.
In SRJS, `io` is not an array, so `[IO_BOARD_NUMBER]` is not required. There are also no `input` or `output` arrays. These are replaced with `bumpSensor` and `rangeFinder` arrays, which contain bump sensors and range finders in various positions around the robot starting in the front-left corner and working round the robot clockwise. The default number of each are stored in `SRJS.bumpSensorsPerRobot` and `SRJS.rangeFindersPerRobot`, although can be customised on a per-robot basis. Bump Sensors have a digital output and Range Finders have an analogue output.

### Python
```python
# to read JointIO board 0's digital pin 0...
pin0 = io[0].input[0].d
# to read JointIO board 0's analogue pin 2...
pin2 = io[0].input[2].a
```
### Javascript
```javascript
// check to see whether the front-left bump sensor is pressed
var pin0 = robot.io.bumpSensor[0].d;
// read the value from the front range finder
var pin2 = robot.io.rangeFinder[0].a;
```

# Vision ([Python Docs](https://www.studentrobotics.org/docs/programming/sr/vision/))

You must explicitly enable vision in SRJS to use it by adding the following to your code: `SRJS.robotVision = true;` Enabling vision will cause the framerate to drop significantly.

### Python
```python
ev = yield vision
if ev.was(vision):
	for blob in ev.vision.blobs:
		if blob.colour == RED:
		print "Found red blob at " + str(blob.x) + ", " + str(blob.y)
```
### Javascript
```javascript
var vision = robot.vision;
vision.blobs.forEach(function( blob ){
	if( blob.colour === SRJS.RED ){
		console.log( 'Found red blob at', blob.x, ',', blob.y );
	}
}, robot);
```

# Coroutines ([Python Docs](https://www.studentrobotics.org/docs/programming/python/yield_and_coroutines))

It is possible to set functions running in the background, independent of other code.

### Python
```python
@coroutine
def aCoroutine():
	while True:
		yield 1
		print "I'm a Robot"
# OR:
def anotherCoroutine():
	while True:
		print "I'm a Coroutine"
		yield 1

def main():
	#To add another function as a coroutine:
	add_coroutine(anotherCoroutine)
```
### Javascript
```javascript
// Within the initialise() function for the robot
var aCoroutine = function(){
	console.log("I'm a Robot");
};
robot.invokeRepeating( aCoroutine, 1000 );
// OR:
robot.invokeRepeating(function(){
	console.log("I'm a Coroutine");
}, 0, 1000 );
```

# Query ([Python Docs](https://www.studentrobotics.org/docs/programming/sr/query/))

With the Python API, it's possible to stop the execution of the code to wait for something to occur. This cannot be done in SRJS, so queries have to be written differently.
### Python
```python
yield query.timeout(3)
# do other things here
```
### Javascript
```javascript
robot.Yield( 3, function(){
	// do other things here
});
```
`robot.Yield()` is a function which stops the robot's `main()` loop code until the query passed as the first parameter is true. The second parameter is a function which will be called when the query becomes true.

The syntax to yield for non-timeout events is noticeably different to Python.
### Python
```python
# Wait for digital input 3 on JointIO board 0 to become digital '1'
yield query.io[0].input[0].d == 1
# Wait for the reading of analogue input 3 on JointIO board 0 to exceed 1V
yield query.io[0].input[1].a > 1
print "done!"
```
### Javascript
```javascript
robot.Yield( new SRJS.Query( ['robot.io.bumpSensor[0].d', 'eq', true] ), function(){
	robot.Yield( new SRJS.Query( ['robot.io.rangeFinder[0].a', 'gt', 1] ), function(){
		console.log( 'done!' );
	});
});
```
Queries are created by passing `new SRJS.Query()` as the first parameter for `robot.Yield()`. The query is then passed an array with three parameters:
1. A string containing the name of the variable to watch
2. A string to define the type of comparison to perform. Can be one of the following:
	* `eq` - wait for the values to be equal (`===`)
	* `gt` - wait for the variable to become greater than the given value (`<`)
	* `lt` - wait for the variable to become less than the given value (`>`)
3. A value to perform the comparison against

It is possible to combine a number of events in a single query and wait for one or all of them to be true before the query as a whole returns true.
### Python
```python
# OR:
yield query.io[0].input[0].a < 2, query.io[0].input[0].a > 3
# AND:
yield (query.io[0].input[2].d == 1) & (query.io[0].input[3].d == 0)
# alternatively:
yield And( query.io[0].input[3].d == 1, query.io[0].input[2].d == 0 )
print "done!"
```
### Javascript
```javascript
// OR:
robot.Yield( new SRJS.Query( 'or',
							['robot.io.rangeFinder[0].a', 'lt', 2],
							['robot.io.rangeFinder[0].a', 'gt', 3]
			), function(){
	// AND:
	robot.Yield( new SRJS.Query( 'and',
								['robot.io.bumpSensor[2].d', 'eq', true],
								['robot.io.bumpSensor[3].d', 'eq', false] ), function(){
		// alternatively:
		robot.Yield( new SRJS.Query( ['robot.io.bumpSensor[3].d', 'eq', true],
								['robot.io.bumpSensor[2].d', 'eq', false] ), function(){
			console.log( 'done!' );
		});
	});
});
```
The first parameter is a string, either `and` or `or` to specify how the query should work. This is then followed by a number of arrays containing the comparisons. If there are multiple comparisons being made, but no string to specify how the query should operate, it will default to `and`.

Comparison and timeout queries cannot be directly combined in a single Yield, although it is possible to set variables to make it work. See examples/yield-query-time-and-comparison.html to see how this can be done.
When an or query returns, you will have to manually work out which comparison returned true.

# Power ([Python Docs](https://www.studentrobotics.org/docs/programming/sr/power/))

Not available in SRJS.

# Pwm ([Python Docs](https://www.studentrobotics.org/docs/programming/sr/pwm/))

Not available in SRJS.
