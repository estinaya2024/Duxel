import json
import re
import os

# Define absolute paths
base_dir = r'C:\Users\ayaka\color-palette-generator'
json_path = os.path.join(base_dir, 'color-master.json')
output_path = os.path.join(base_dir, 'src', 'utils', 'extendedColors.ts')

# Load the master JSON
try:
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
except Exception as e:
    print(f'Error loading JSON: {e}')
    print(f'Attempted path: {json_path}')
    exit(1)

colors = {}
for entry in data:
    name = str(entry.get('name', '')).strip()
    hex_code = str(entry.get('hex', '')).strip()
    if name and hex_code:
        # Normalize: keep only alphanumeric characters for the key
        normalized = re.sub(r'[^a-zA-Z0-9]', '', name).lower()
        if normalized and normalized not in colors:
            colors[normalized] = hex_code

# Reconstruct the file with a clean structure
output_path = 'src/utils/extendedColors.ts'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('export const EXTENDED_COLORS: Record<string, string> = {\n')
    
    sorted_keys = sorted(colors.keys())
    for i, k in enumerate(sorted_keys):
        comma = ',' if i < len(sorted_keys) - 1 else ''
        # Escape double quotes just in case
        safe_k = k.replace('"', '\\"')
        safe_v = colors[k].replace('"', '\\"')
        f.write(f'  "{safe_k}": "{safe_v}"{comma}\n')
        
    f.write('};\n')

print(f'Successfully updated extendedColors.ts with {len(colors)} unique names.')
