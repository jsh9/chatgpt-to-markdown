from PIL import Image, ImageDraw, ImageFont

# Define image size and background color
img_size = (300, 300)
bg_color = (219, 236, 243)

# Create a new image with the specified size and background color
img = Image.new("RGB", img_size, bg_color)

# Get a drawing context for the image
draw = ImageDraw.Draw(img)

# Define font and text color for the "GPT" and "2MD" letters
font_gpt = ImageFont.truetype("arial.ttf", 120)
font_2md = ImageFont.truetype("arial.ttf", 120)
text_color = (33, 70, 115)

# Draw the "GPT" letters on the first line
text_gpt = "GPT"
text_gpt_size = draw.textsize(text_gpt, font_gpt)
text_gpt_pos = ((img_size[0] - text_gpt_size[0]) / 2, (img_size[1] - text_gpt_size[1]) / 2 - 70)
draw.text(text_gpt_pos, text_gpt, fill=text_color, font=font_gpt)

# Draw the "2MD" letters on the second line
text_2md = "2MD"
text_2md_size = draw.textsize(text_2md, font_2md)
text_2md_pos = ((img_size[0] - text_2md_size[0]) / 2, text_gpt_pos[1] + text_gpt_size[1] + 30)
draw.text(text_2md_pos, text_2md, fill=text_color, font=font_2md)

# Save the image as a PNG file
img.save("chatgpt_icon_v4.png")
