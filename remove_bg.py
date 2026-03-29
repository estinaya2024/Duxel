from rembg import remove
from PIL import Image
import os

def process_image(input_path, output_path):
    print(f"Processing {input_path} -> {output_path}...")
    with open(input_path, 'rb') as i:
        input_data = i.read()
        output_data = remove(input_data)
        with open(output_path, 'wb') as o:
            o.write(output_data)
    print("Done.")

if __name__ == "__main__":
    public_dir = "public"
    images = [("fish.jpg", "fish.png"), ("steps.jpg", "steps.png")]
    
    for input_file, output_file in images:
        input_path = os.path.join(public_dir, input_file)
        output_path = os.path.join(public_dir, output_file)
        if os.path.exists(input_path):
            process_image(input_path, output_path)
        else:
            print(f"File {input_path} not found.")
