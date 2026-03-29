import os
import io
import numpy as np
from PIL import Image
from rembg import remove
from scipy import ndimage

def create_perfect_sticker(input_path, output_path):
    print(f"Processing perfect sticker: {input_path}")
    try:
        # 1. Load original JPG image perfectly
        with open(input_path, 'rb') as f:
            input_data = f.read()

        # 2. Advanced AI Background removal (leaves some white body holes)
        output_data = remove(input_data)
        img = Image.open(io.BytesIO(output_data)).convert("RGBA")

        # 3. Surgical Hole Filling (keeps duck bodies perfectly solid white)
        alpha = np.array(img.getchannel('A'))
        binary_mask = alpha > 10
        
        # Fill the "gone" areas inside the duck
        filled_mask_bool = ndimage.binary_fill_holes(binary_mask)
        holes_mask = filled_mask_bool & ~binary_mask
        
        img_array = np.array(img)
        # Set holes back to pure white and solid alpha
        img_array[holes_mask] = [255, 255, 255, 255]
        
        # Ensure the whole shape is completely solid
        new_alpha = np.where(filled_mask_bool, 255, 0).astype(np.uint8)
        img_array[..., 3] = new_alpha
        
        final_sticker = Image.fromarray(img_array, mode="RGBA")

        # 4. Save EXACTLY as it is, strictly NO borders added
        final_sticker.save(output_path, "PNG")
        print(f"Success: saved borderless sticker to {output_path}")

        # 5. Clean up the original JPG
        os.remove(input_path)

    except Exception as e:
        print(f"Failed to process {input_path}: {e}")

if __name__ == "__main__":
    public_dir = os.path.join(os.getcwd(), "public")
    files = [f for f in os.listdir(public_dir) if f.lower().endswith('.jpg')]
    
    if not files:
        print("No JPG files found to convert in " + public_dir)
    else:
        print(f"Found {len(files)} original JPGs. Starting perfect conversion...")
        for filename in files:
            full_path = os.path.join(public_dir, filename)
            png_name = os.path.splitext(filename)[0] + ".png"
            output_path = os.path.join(public_dir, png_name)
            create_perfect_sticker(full_path, output_path)
