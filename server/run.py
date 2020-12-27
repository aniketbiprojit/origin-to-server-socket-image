import sys

from PIL import Image
img = Image.open(sys.argv[1]).convert('RGB').convert('LA')
img.save(sys.argv[1][:-4] + '.png')

print(sys.argv[1].split('/')[-1][:-4] + '.png',end='')
