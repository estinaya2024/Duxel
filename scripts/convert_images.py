import os
from PIL import Image

def convert_jpg_to_png(directory):
    files = [f for f in os.listdir(directory) if f.lower().endswith('.jpg')]
    if not files:
        print("No JPG files found in " + directory)
        return

    print(f"Found {len(files)} JPG files. Converting...")
    
    for filename in files:
        img_path = os.path.join(directory, filename)
        try:
            with Image.open(img_path) as img:
                name_without_ext = os.path.splitext(filename)[0]
                new_filename = f"{name_without_ext}.png"
                new_path = os.path.join(directory, new_filename)
                
                # Convert to RGBA just in case, but RGB is fine for high-quality JPGs
                img.save(new_path, "PNG")
                print(f"Converted: {filename} -> {new_filename}")
        except Exception as e:
            print(f"Failed to convert {filename}: {e}")

if __name__ == "__main__":
    public_dir = os.path.join(os.getcwd(), "public")
    convert_jpg_to_png(public_dir)
