import os

FILES = [
'SRJS.js',
'core/Vector2.js',
'core/Init.js',
'physics/Physics.js',
'physics/Intersections.js',
'physics/Edge.js',
'physics/Polygon.js',
'physics/Rectangle.js',
'physics/Ray.js',
'physics/Environment.js',
'arena/Arena.js',
'arena/Arena2011.js',
'arena/Material.js',
'arena/Wall.js',
'arena/Cube.js',
'arena/Trigger.js',
'robot/Robot.js',
'robot/IO.js',
'robot/BumpSensor.js',
'robot/RangeFinder.js',
'robot/Motor.js',
'vision/Vision.js',
'vision/Blob.js',
'vision/Colors.js'
]

def merge(files):

	buffer = []

	for filename in files:
		with open(os.path.join('..', 'js', 'src', filename), 'r') as f:
			buffer.append(f.read())

	return "".join(buffer)

def output(text, filename):

	with open(os.path.join('..', 'build', filename), 'w') as f:
		f.write(text)

def main():
    text = merge(FILES)
    output(text, 'SRJS.js')

main()
