import os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

def remove_border(input_path, output_path, border_size=15):
    print(f"Processing: {input_path}")
    try:
        img = Image.open(input_path).convert("RGBA")
        
        # Current alpha channel
        alpha = np.array(img.getchannel('A'))
        
        # Create a boolean mask from alpha
        mask = alpha > 127
        
        # Erode the mask by exactly a 31x31 square (which mathematically reverses MaxFilter(31))
        eroded_mask = ndimage.binary_erosion(mask, structure=np.ones((border_size * 2 + 1, border_size * 2 + 1)))
        
        # Create new alpha channel
        new_alpha = np.where(eroded_mask, 255, 0).astype(np.uint8)
        
        # Apply to image array
        img_array = np.array(img)
        img_array[..., 3] = new_alpha
        
        final_sticker = Image.fromarray(img_array, mode="RGBA")
        final_sticker.save(output_path, "PNG")
        print(f"Success: {output_path}")

    except Exception as e:
        print(f"Failed {input_path}: {e}")

if __name__ == "__main__":
    public_dir = os.path.join(os.getcwd(), "public")
    files = [f for f in os.listdir(public_dir) if f.lower().endswith('.png') and f not in ('favicon.svg', 'icons.svg')]
    for f in files:
        remove_border(os.path.join(public_dir, f), os.path.join(public_dir, f))
