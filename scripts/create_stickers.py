import os
import io
import numpy as np
from PIL import Image, ImageOps, ImageFilter
from rembg import remove

def make_sticker(input_path, output_path, border_size=15):
    print(f"Processing sticker: {input_path}")
    try:
        # Load image
        with open(input_path, 'rb') as f:
            input_data = f.read()

        # 1. Remove background
        output_data = remove(input_data)
        img = Image.open(io.BytesIO(output_data)).convert("RGBA")

        # 2. Add White Border (Die-cut effect)
        # Create a mask from the alpha channel
        alpha = img.getchannel('A')
        
        # Binary mask (pure opaque or pure transparent)
        mask = alpha.point(lambda p: 255 if p > 10 else 0)
        
        # Dilate the mask to create the border area
        # We use a MaxFilter to expand the white areas of the binary mask
        border_mask = mask.filter(ImageFilter.MaxFilter(border_size * 2 + 1))
        
        # Create a solid white background for the border
        white_bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
        
        # Composite the border onto the transparent background
        sticker_base = Image.new("RGBA", img.size, (0, 0, 0, 0))
        sticker_base.paste(white_bg, (0, 0), mask=border_mask)
        
        # Composite the original image on top of the white border
        final_sticker = Image.alpha_composite(sticker_base, img)

        # 3. Save
        final_sticker.save(output_path, "PNG")
        print(f"Success: {output_path}")

    except Exception as e:
        print(f"Failed to process {input_path}: {e}")

if __name__ == "__main__":
    public_dir = os.path.join(os.getcwd(), "public")
    files = [f for f in os.listdir(public_dir) if f.lower().endswith('.png') and f != 'favicon.png' and f != 'icons.png']
    
    if not files:
        print("No PNG files found in " + public_dir)
    else:
        print(f"Found {len(files)} potential stickers. Starting conversion...")
        for filename in files:
            full_path = os.path.join(public_dir, filename)
            # Overwrite the PNG with its sticker version
            make_sticker(full_path, full_path)
