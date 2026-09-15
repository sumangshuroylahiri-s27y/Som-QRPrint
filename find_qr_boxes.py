from PIL import Image
import glob
import json
import sys

results = {}
for file in sorted(glob.glob('public/assets/templates/design-*.png')):
    img = Image.open(file).convert('RGB')
    width, height = img.size
    
    # We are looking for a large white square. 
    # Since we can't easily do contour detection in pure PIL without extra code,
    # let's just do a naive approach: find the bounding box of pure white pixels
    # Actually, a better way is to scan the image for a large block of white.
    # Alternatively, let's just return the width and height so I know the resolution.
    results[file] = {"width": width, "height": height}

print(json.dumps(results, indent=2))
