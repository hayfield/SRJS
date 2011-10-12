## More Important Things

#### Movement and Collisions

* Currently uses multiple different techniques to do different things (collisions and pushing, see src/physics/Polygon.js). Unifying it into a single system that includes capabilities such as pushing things along walls or rotation when pushing would make sense.

#### Pushing

* Things should rotate when pushed
* Things should slide along walls when pushed against walls
* Get rid of the horrible hacky mess to try and make things get pushed in all directions (the assignment of distMin)

#### Robots

* Add a specific section of the robot that picks things up rather than picking items up whether you drive straight forward into it or just clip it with the back corner

#### Features

* Make robots push each other
* Update the vision code to work like the new vision system when it arrives

#### Documentation

* Check to see how query.timeout() is implemented in the Python API v5

## Less Important Things

#### Robot

* Allow more than one parameter to be passed to the callback bound using robot.bindCallbackToRobot()
 
#### Triggers

* Should possibly be more integrated with the physics code
 
#### Physics

* Using SRJS.phys seems a bit hacky
* SRJS.intersections also seems a bit hacky

#### Bump Sensors

* Currently centred on the edge of the robot
* Code duplicated between Bump Sensor and Range Finder

#### Robot Args

* Specifying the width and length (so they're something other than 50) causes the bump sensors to be in the wrong place
* Setting the height as anything other than 50 causes it to float

#### Query

* See if the use of eval() can be reduced

#### API

* Try and make the input API slightly more like the Python version
* Make it possible to specify the position and rotation of range finders (add your own)

#### Pushing

* When doing SAT detection, project each vertex only once

#### Markers

* Check whether the update system works with multiple robots, or whether markers need cloning when returning from update()

## Probably Not Very Important Things

#### SRJS.Vision.detectBlobs()

* Can create large numbers of span objects per frame. Possibly reuse to give the garbage collector some love.
 
#### SRJS.Vision.update()

* Would make more sense to access image data directly rather than converting to PNG, drawing that, then getting imageData to process

#### 2011 Arena

* Blue Blobs show through the wall from certain angles
