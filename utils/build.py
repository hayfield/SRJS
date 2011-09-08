import os

FILES = [
'SRJS.js',
'core/Settings.js',
'core/Utils.js',
'core/Vector2.js',
'core/Init.js',
'physics/Physics.js',
'physics/Intersections.js',
'physics/Edge.js',
'physics/Polygon.js',
'physics/Rectangle.js',
'physics/Ray.js',
'physics/Environment.js',
'physics/DebugCanvas.js',
'arena/Arena.js',
'arena/Arena2011.js',
'arena/Material.js',
'arena/Wall.js',
'arena/Cube.js',
'arena/Trigger.js',
'robot/Query.js',
'robot/Robot.js',
'robot/IO.js',
'robot/BumpSensor.js',
'robot/RangeFinder.js',
'robot/Motor.js',
'vision/Vision.js',
'vision/Blob.js',
'vision/Colors.js'
]

LIBRARIES = [
'Three.js',
'Detector.js',
'RequestAnimationFrame.js',
'Stats.js'
]

def merge(files, path):

	buffer = []

	for filename in files:
		with open(os.path.join(path, filename), 'r') as f:
			buffer.append(f.read())

	return "".join(buffer)

def output(text, filename):

	with open(os.path.join('..', 'build', filename), 'w') as f:
		f.write(text)

def main():
    path = os.path.join('..', 'js', 'src')
    srcText = merge(FILES, path)
    output(srcText, 'SRJS.js')

    path = os.path.join('..', 'js', 'libs')
    libText = merge(LIBRARIES, path)
    output(libText + srcText, 'SRJS-full.js')

main()
