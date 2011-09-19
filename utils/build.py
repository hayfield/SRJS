import os
import time
import re

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
'arena/Arena2012.js',
'arena/Material.js',
'arena/Wall.js',
'arena/Cube.js',
'arena/Trigger.js',
'arena/Pushable.js',
'arena/Marker.js',
'robot/Query.js',
'robot/Robot.js',
'robot/IO.js',
'robot/BumpSensor.js',
'robot/RangeFinder.js',
'robot/Motor.js',
'vision/Vision.js',
'vision/VisionV1.js',
'vision/VisionV2.js',
'vision/Blob.js',
'vision/Colors.js'
]

LIBRARIES = [
'Three.js',
'Detector.js',
'RequestAnimationFrame.js',
'Stats.js'
]

def revision():
    buffer = []
    f = open(os.path.join('REVISION'), 'r')
    contents = f.readline()
    regex = '([a-zA-Z]+)?\d+'
    try:
        rev = re.search( regex, contents ).group( 0 )
        buffer.append( rev )
    except Exception:
        print 'Invalid REVISION file contents. Should match: ' + regex
        buffer.append('idk')
    buffer.append('.')
    buffer.append(str(time.time()))
    return "".join(buffer)

def merge(files, path):

	buffer = []

	for filename in files:
		with open(os.path.join(path, filename), 'r') as f:
			buffer.append('// FILE: %s\n' % filename)
			buffer.append('%s\n' % f.read())

	return "".join(buffer)

def output(text, filename):

	with open(os.path.join('..', 'build', filename), 'w') as f:
		f.write(text)

def main():
    revisionText = '// REVISION: ' + revision() + '\n'

    path = os.path.join('..', 'js', 'src')
    srcText = merge(FILES, path)
    output(revisionText + srcText, 'SRJS.js')

    path = os.path.join('..', 'js', 'libs')
    libText = merge(LIBRARIES, path)
    output(revisionText + libText + srcText, 'SRJS-full.js')

main()
