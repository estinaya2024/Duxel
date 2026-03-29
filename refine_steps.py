from PIL import Image
import numpy as np
import os

def remove_white_background(input_path, output_path, threshold=240):
    print(f"Refining {input_path} -> {output_path} (Targeting white background)...")
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)
    
    # Identify white pixels (R, G, and B all above threshold)
    red, green, blue, alpha = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    white_areas = (red > threshold) & (green > threshold) & (blue > threshold)
    
    # Set white areas to transparent
    data[white_areas] = [0, 0, 0, 0]
    
    new_img = Image.fromarray(data)
    new_img.save(output_path, "PNG")
    print(f"Success! Saved to {output_path}")

if __name__ == "__main__":
    public_dir = "public"
    input_file = os.path.join(public_dir, "steps.jpg")
    output_file = os.path.join(public_dir, "steps.png")
    
    if os.path.exists(input_file):
        remove_white_background(input_file, output_file)
    else:
        print(f"Error: {input_file} not found.")
