import os
from PIL import Image

src_img_path = r"C:/Users/Manoj/.gemini/antigravity/brain/82a1cfbc-f612-4c89-a236-03801d02b37d/.user_uploaded/media_1787243429481.png"
public_dir = r"C:\genomicsecure\public"
os.makedirs(public_dir, exist_ok=True)

# Open uploaded image
img = Image.open(src_img_path).convert("RGBA")

# Save as logo.png and favicon.png
logo_path = os.path.join(public_dir, "logo.png")
favicon_png = os.path.join(public_dir, "favicon.png")
favicon_ico = os.path.join(public_dir, "favicon.ico")

img.save(logo_path, format="PNG")
img.save(favicon_png, format="PNG")

# Generate multi-size ICO
sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
img.save(favicon_ico, format="ICO", sizes=sizes)

print(f"Successfully processed and saved user logo into {public_dir}")
