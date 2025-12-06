from PIL import Image, ImageOps
import os
import glob

def add_watermark(image_path, watermark_path, output_path):
    try:
        base_image = Image.open(image_path).convert("RGBA")
        watermark = Image.open(watermark_path).convert("RGBA")

        # Resize watermark to be 15% of the base image width
        width_ratio = 0.15
        w_width = int(base_image.width * width_ratio)
        w_height = int(watermark.height * (w_width / watermark.width))
        watermark = watermark.resize((w_width, w_height), Image.Resampling.LANCZOS)

        # Make watermark white and transparent
        # Create a white image of the same size
        white_img = Image.new('RGBA', watermark.size, (255, 255, 255, 0))
        # Use the alpha channel of the watermark as the mask for the white image
        # But first we need to ensure the watermark has transparency where it should
        # Assuming the logo is dark on transparent or white on transparent. 
        # Let's just force the visible pixels to be white with 70% opacity.
        
        datas = watermark.getdata()
        new_data = []
        for item in datas:
            # If pixel is not transparent
            if item[3] > 0:
                # Make it white with 180 alpha (approx 70%)
                new_data.append((255, 255, 255, 180))
            else:
                new_data.append(item)
        watermark.putdata(new_data)

        # Position: Bottom Right with padding
        padding = int(base_image.width * 0.02)
        position = (base_image.width - w_width - padding, base_image.height - w_height - padding)

        # Composite
        transparent = Image.new('RGBA', base_image.size, (0, 0, 0, 0))
        transparent.paste(base_image, (0, 0))
        transparent.paste(watermark, position, mask=watermark)
        
        # Save
        if output_path.lower().endswith('.jpg') or output_path.lower().endswith('.jpeg'):
            transparent = transparent.convert("RGB")
        
        transparent.save(output_path)
        print(f"Watermarked: {output_path}")

    except Exception as e:
        print(f"Error processing {image_path}: {e}")

# Paths
logo_path = "assets/images/logo-original.png"
gallery_images = glob.glob("assets/images/gallery-*.png")

if not os.path.exists(logo_path):
    print(f"Logo not found at {logo_path}")
else:
    for img_path in gallery_images:
        add_watermark(img_path, logo_path, img_path)
