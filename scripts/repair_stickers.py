import os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

def repair_and_border(input_path, output_path, border_size=15):
    print(f"Processing: {input_path}")
    try:
        img = Image.open(input_path).convert("RGBA")
        
        # 1. Fill holes in the alpha channel
        alpha = np.array(img.getchannel('A'))
        
        # binary mask where alpha > 0
        binary_mask = alpha > 10
        
        # fill holes
        filled_mask_bool = ndimage.binary_fill_holes(binary_mask)
        
        # the difference gives us the holes that were originally transparent
        holes_mask = filled_mask_bool & ~binary_mask
        
        # update the image array: where holes_mask is true, set to white (255, 255, 255, 255)
        img_array = np.array(img)
        img_array[holes_mask] = [255, 255, 255, 255]
        
        # update alpha channel
        new_alpha = np.where(filled_mask_bool, 255, 0).astype(np.uint8)
        img_array[..., 3] = new_alpha
        
        # create new image with filled holes
        filled_img = Image.fromarray(img_array, mode="RGBA")
        
        # Skip the white border addition. Use the completely filled natural duck image.
        final_sticker = filled_img
        
        final_sticker.save(output_path, "PNG")
        print(f"Success: {output_path}")

    except Exception as e:
        print(f"Failed {input_path}: {e}")

if __name__ == "__main__":
    public_dir = os.path.join(os.getcwd(), "public")
    files = [f for f in os.listdir(public_dir) if f.lower().endswith('.png') and f not in ('favicon.svg', 'icons.svg')]
    for f in files:
        repair_and_border(os.path.join(public_dir, f), os.path.join(public_dir, f))
