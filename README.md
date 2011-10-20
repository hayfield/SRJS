An attempt to port the [Student Robotics](https://www.studentrobotics.org/) API to Javascript to allow easier testing of algorithms by providing a 3D arena which robots can move around in that doesn't involve card stuck to table legs. It also allows testing to be performed before anything has been physically constructed.

### This version of the code is in transition between the 2011 and 2012 SR APIs. This means that examples and code may not match up exactly and things are likely to change in the near future. For a version of the code that's more stable and consistent (but old), see [here](https://github.com/hayfield/SRJS/tree/53135d36818fd48a3ea7e2795f82e3e435954996).

## Docs

## Downloading SRJS

The latest (possibly unstable) version of SRJS can be downloaded as a [zip](https://github.com/hayfield/SRJS/zipball/master).

Alternatively, older versions of the code, which should be less prone to problems, have been [tagged](https://github.com/hayfield/SRJS/tags) and can be downloaded from there. The higher the tag number, the more recent the code.

## Running SRJS

SRJS will run in the latest versions of [Chrome](http://www.google.com/chrome/) and [Firefox](http://www.mozilla.org/firefox/). Switching tabs while it is running will cause strange things to happen. Vision code will not work correctly unless your graphics card supports [WebGL](http://get.webgl.org).

Some of the examples use the console to display output, so you'll need to open it to see anything happening.

* [Opening the console in Chrome](http://code.google.com/chrome/devtools/docs/overview.html#access).
* [Opening the console in Firefox](https://developer.mozilla.org/en/Using_the_Web_Console#Opening_the_Web_Console).

## Getting Started

See examples/boilerplate.html for an annotated layout which can be used as the basis of code you write.

## SRJS Functions and Notes

#### Using `this` and `robot`
When writing code for the robot within the `main()` and `initialise()` functions, `this` and `robot` refers to the Robot being controlled. In some cases such as within a [forEach](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach) loop it's necessary to pass one of the two as a parameter if `this` is to reference the correct thing.

#### Using `robot.createProperty( name, initialValue )`
Used to create a property with a given name which will keep its value between calls to `robot.main()`, while allowing multiple robots to use the same variable names.
##### Example
```javascript
robot.createProperty( 'hitAWall', false ); // create the property
var shouldReverse = robot.hitAWall; // access the value and store it in another variable
robot.hitAWall = true; // change the value after initialisation
```

### Motor Control ([Python Docs](https://www.studentrobotics.org/docs/programming/sr/motors/))

Setting the speed of the motors is similar to in Python.

 * `robot.motors[0]` is the left wheel
 * `robot.motors[1]` is the right wheel

##### Python
```python
R.motors[0].target = 100
R.motors[1].target = 100
```
##### Javascript
```javascript
robot.motors[0].target = 100;
robot.motors[1].target = 100;
```

### IO ([Python Docs](https://www.studentrobotics.org/docs/programming/sr/io/))

There are some notable differences between the Python API and SRJS.
In Python, `io[IO_BOARD_NUMBER]` has two properties: `input` and `output`, which are arrays of input or output devices respectively.
In SRJS, `io` is not an array, so `[IO_BOARD_NUMBER]` is not required. There are also no `input` or `output` arrays. These are replaced with `bumpSensor` and `rangeFinder` arrays, which contain bump sensors and range finders in various positions around the robot starting in the front-left corner and working round the robot clockwise. The default number of each are stored in `SRJS.bumpSensorsPerRobot` and `SRJS.rangeFindersPerRobot`, although can be customised on a per-robot basis. Bump Sensors have a digital output and Range Finders have an analogue output.

##### Python
```python
# to read JointIO board 0's digital pin 0...
pin0 = R.io[0].input[0].d
# to read JointIO board 0's analogue pin 2...
pin2 = R.io[0].input[2].a
```
##### Javascript
```javascript
// check to see whether the front-left bump sensor is pressed
var pin0 = robot.io.bumpSensor[0].d;
// read the value from the front range finder
var pin2 = robot.io.rangeFinder[0].a;
```

### Vision ([Python Docs](https://www.studentrobotics.org/docs/programming/sr/vision/))

You must explicitly enable vision in SRJS to use it by adding the following to your code: `SRJS.robotVision = true;`. Enabling vision will cause the framerate to drop.

In SRJS, markers are attached to the centre of objects. This means that if there is a 50x50x50cm robot with a marker on it, the position of the marker is judged as being at the centre of the robot rather than on one of its sides. It also means that markers to not have a `vertices[]` property. In addition, buckets only have a single type of marker attached, `SRJS.MARKER_BUCKET`, rather than different markers for the ends and sides of the bucket.

To compare the type of marker that is visible, the type name needs to be prefixed by `SRJS`, so `MARKER_ROBOT` in Python becomes `SRJS.MARKER_ROBOT` in SRJS.

`robot.see()` in SRJS accepts two parameters. The first is the `width` of the image, the second the `height`. This differs from the Python API which accepts a single `res` parameter. These dimensions are optional and will default to `800x600`.

##### Python
```python
markers = R.see( res=(1280,1024) )
for marker in markers:
    if marker.dist < 50:
        print "A marker is close to the robot!"
    if marker.info.type == MARKER_ROBOT:
        print "I spy a robot"
```
##### Javascript
```javascript
var markers = robot.see( 1280, 1024 );
markers.forEach(function(marker){
    if( marker.dist < 50 ){
        console.log( 'A marker is close to the robot!' );
    }
    if( marker.info.type === SRJS.MARKER_ROBOT ){
        console.log( 'I spy a robot' );
    }
});
```

### Threads

It is possible to set functions running in the background, independent of other code. This code will still run in the background even when the robot is waiting for a call to `wait_for()` to return true.

`robot.invokeRepeating()` takes three parameters: `robot.invokeRepeating( callback, initialDelay, repeatRate )`
If only two parameters are passed, so `repeatRate` is missed out, it will default to the value given to `initialDelay`.

##### Python
```python
import time, thread

def cheese():
    while True:
        time.sleep(1)
        print "I'm a Robot"

thread.start_new_thread(cheese,())
```
##### Javascript
```javascript
// Within the initialise() function for the robot
var aCoroutine = function(){
	console.log("I'm a Robot");
};
robot.invokeRepeating( aCoroutine, 1000 );
// OR:
robot.invokeRepeating(function(){
	console.log("I'm a Robot");
}, 0, 1000 );
```

### wait_for ([Python Docs](https://www.studentrobotics.org/docs/programming/sr/io/wait_for))

With the Python API, it's possible to stop the execution of the code to wait for something to occur. This cannot be done in SRJS, so queries have to be written differently.
##### Python
```python
time.sleep(3)
# do other things here
```
##### Javascript
```javascript
robot.wait_for( 3, function(){
	// do other things here
});
```
`robot.wait_for()` is a function which stops the robot's `main()` loop code until the query passed as the first parameter is true. The second parameter is a function which will be called when the query becomes true. In SRJS, `robot.wait_for()` can also be referenced as `robot.waitFor()` or `robot.Yield()`.

The syntax to yield for non-sleep events is noticeably different to Python.
##### Python
```python
# Wait for digital input 3 on JointIO board 0 to become digital '1'
wait_for( R.io[0].input[0].query.d == 1 )
# Wait for the reading of analogue input 3 on JointIO board 0 to exceed 1V
wait_for( R.io[0].input[1].query.a > 1 )
print "done!"
```
##### Javascript
```javascript
robot.wait_for( new SRJS.Query( ['robot.io.bumpSensor[0].d', 'eq', true] ), function(){
	robot.wait_for( new SRJS.Query( ['robot.io.rangeFinder[0].a', 'gt', 1] ), function(){
		console.log( 'done!' );
	});
});
```
Queries are created by passing `new SRJS.Query()` as the first parameter for `robot.wait_for()`. The query is then passed an array with three parameters:

 1. A string containing the name of the variable to watch
 2. A string to define the type of comparison to perform. Can be one of the following:
  * `eq` - wait for the values to be equal (`===`)
  * `gt` - wait for the variable to become greater than the given value (`>`)
  * `lt` - wait for the variable to become less than the given value (`<`)
  * `ne` - wait for the variable to become not equal to the given value (`!==`)
  * `gte` - wait for the variable to become greater than or equal to the given value (`>=`)
  * `lte` - wait for the variable to become less than or equal to the given value (`<=`)
 3. A value to perform the comparison against

It is possible to combine a number of events in a single query and wait for one or all of them to be true before the query as a whole returns true.
##### Python
```python
# OR:
wait_for( R.io[0].input[0].query.a < 2, R.io[0].input[0].query.a > 3 )
# ALTERNATE OR:
wait_for( Or( R.io[0].input[3].query.a < 2, R.io[0].input[3].query.a > 3 ) )
# AND:
wait_for( And( R.io[0].input[3].query.d == 1, R.io[0].input[2].query.d == 0 ) )
print "done!"
```
##### Javascript
```javascript
// OR:
robot.wait_for( new SRJS.Query( ['robot.io.rangeFinder[0].a', 'lt', 2],
							    ['robot.io.rangeFinder[0].a', 'gt', 3] ), function(){
    // ALTERNATE OR:
    robot.wait_for( new SRJS.Query( 'or',
                                    ['robot.io.rangeFinder[3].a', 'lt', 2],
							        ['robot.io.rangeFinder[3].a', 'gt', 3] ), function(){
        // AND:
        robot.wait_for( new SRJS.Query( 'and',
                                    ['robot.io.bumpSensor[2].d', 'eq', true],
                                    ['robot.io.bumpSensor[3].d', 'eq', false] ), function(){
            console.log( 'done!' );
        });
    });
});
```
The first parameter is a string, either `and` or `or` to specify how the query should work. This is then followed by a number of arrays containing the comparisons. If there are multiple comparisons being made, but no string to specify how the query should operate, it will default to `and`.

**Variable watchers and timeouts cannot currently be combined within a single query in the Python API for the 2012 SR competition. This capability appears to have been removed when `yield` was replaced by `wait_for()`.**
To use both a timeout and a comparison within a single query, pass the number of seconds to wait as a parameter.
##### Python
```python
yield query.io[0].input[0].a > 1, query.timeout(3)
# do things here
```
##### Javascript
```javascript
robot.wait_for( new SRJS.Query( 'or',
                            ['robot.io.rangeFinder[0].a', 'gt', 1],
                            3 ), function(){
    // do things here
});
```
When an or query returns, it will pass an array containing the status of the tracked items as a parameter to the callback. Any tracked items that do not return true when the query returns will be represented as `null`. If a timeout has completed, it will be represented by `true`.

```javascript
robot.motors[0].target = 100;
robot.motors[1].target = 100;
robot.wait_for( new SRJS.Query( 'or',
                            ['robot.io.rangeFinder[0].a', 'gt', 1],
                            3,
                            ['robot.io.bumpSensor[0].d', 'eq', true]), function( status ){
    console.log(status);
    // Output (values may differ slightly): [null, true, null]
    // Alternative Output (values may differ slightly): [1.0040160642570304, null, null]
});
```

### Power ([Python Docs](https://www.studentrobotics.org/docs/programming/sr/power/))

Not available in SRJS.

### Servos ([Python Docs](https://www.studentrobotics.org/docs/programming/sr/servos/))

Not available in SRJS.

### Blob-based Vision ([Python Docs](https://www.studentrobotics.org/docs/programming/sr/vision/))

**This section describes the blob-based vision system (VisionV1). The marker-based vision system (VisionV2) works differently and is described above**

You must explicitly enable vision in SRJS to use it by adding the following to your code: `SRJS.robotVision = true;`. Enabling vision will cause the framerate to drop significantly.

##### Python
```python
ev = yield vision
if ev.was(vision):
	for blob in ev.vision.blobs:
		if blob.colour == RED:
		print "Found red blob at " + str(blob.x) + ", " + str(blob.y)
```
##### Javascript
```javascript
var vision = robot.vision;
vision.blobs.forEach(function( blob ){
	if( blob.colour === SRJS.RED ){
		console.log( 'Found red blob at', blob.x, ',', blob.y );
	}
}, robot);
```
