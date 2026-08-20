import os
import math
from PIL import Image, ImageDraw

def create_medlink_icon(size=256):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background rounded rectangle
    radius = int(size * 0.22)
    # Background dark navy slate
    bg_color = (15, 23, 42, 255) # #0F172A
    draw.rounded_rectangle([0, 0, size, size], radius=radius, fill=bg_color)
    
    # Cyan gradient border
    border_color = (56, 189, 248, 200) # #38BDF8
    draw.rounded_rectangle([2, 2, size - 2, size - 2], radius=radius, outline=border_color, width=max(2, int(size * 0.03)))
    
    center = size / 2
    
    # Medical cross arms
    cross_width = int(size * 0.16)
    cross_len = int(size * 0.65)
    cross_color = (14, 165, 233, 80) # cyan transparent
    
    # Vertical arm
    draw.rounded_rectangle(
        [center - cross_width / 2, center - cross_len / 2, center + cross_width / 2, center + cross_len / 2],
        radius=int(cross_width * 0.4), fill=cross_color
    )
    # Horizontal arm
    draw.rounded_rectangle(
        [center - cross_len / 2, center - cross_width / 2, center + cross_len / 2, center + cross_width / 2],
        radius=int(cross_width * 0.4), fill=cross_color
    )
    
    # Interconnected federated node lines
    line_color = (56, 189, 248, 220)
    lw = max(2, int(size * 0.035))
    
    node_offset = size * 0.26
    # 4 cardinal nodes
    nodes = [
        (center, center - node_offset, (56, 189, 248)),  # Top (Cyan)
        (center, center + node_offset, (52, 211, 153)),  # Bottom (Teal)
        (center - node_offset, center, (56, 189, 248)),  # Left (Cyan)
        (center + node_offset, center, (52, 211, 153)),  # Right (Teal)
    ]
    
    for nx, ny, col in nodes:
        draw.line([(center, center), (nx, ny)], fill=line_color, width=lw)
        
    # DNA Helix Curves
    points_top = []
    points_bot = []
    for step in range(20):
        t = step / 19.0
        x = center - size * 0.26 + t * (size * 0.52)
        y_top = center + math.sin(t * math.pi * 2) * (size * 0.14)
        y_bot = center - math.sin(t * math.pi * 2) * (size * 0.14)
        points_top.append((x, y_top))
        points_bot.append((x, y_bot))
        
    draw.line(points_top, fill=(56, 189, 248, 255), width=max(2, int(size * 0.045)))
    draw.line(points_bot, fill=(52, 211, 153, 255), width=max(2, int(size * 0.045)))
    
    # Draw nodes
    nr = size * 0.065
    for nx, ny, col in nodes:
        draw.ellipse([nx - nr, ny - nr, nx + nr, ny + nr], fill=col + (255,))
        in_r = nr * 0.45
        draw.ellipse([nx - in_r, ny - in_r, nx + in_r, ny + in_r], fill=(255, 255, 255, 255))
        
    # Center node
    c_nr = size * 0.08
    draw.ellipse([center - c_nr, center - c_nr, center + c_nr, center + c_nr], fill=(56, 189, 248, 255))
    c_in_r = c_nr * 0.5
    draw.ellipse([center - c_in_r, center - c_in_r, center + c_in_r, center + c_in_r], fill=(255, 255, 255, 255))
    
    return img

if __name__ == "__main__":
    public_dir = r"C:\genomicsecure\public"
    os.makedirs(public_dir, exist_ok=True)
    
    icon_256 = create_medlink_icon(256)
    icon_256.save(os.path.join(public_dir, "favicon.png"), format="PNG")
    icon_256.save(os.path.join(public_dir, "logo.png"), format="PNG")
    
    # Generate multi-res ICO
    sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    icon_256.save(os.path.join(public_dir, "favicon.ico"), format="ICO", sizes=sizes)
    
    print("Successfully generated favicon.ico, favicon.png, and logo.png in public/")
