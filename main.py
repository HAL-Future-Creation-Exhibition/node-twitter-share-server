#coding:utf-8
import math
import io
import urllib.request
import sys
from PIL import Image, ImageDraw, ImageFont

args = sys.argv
raw_message = args[1]
icon_url = args[2]
output_name = args[3]
message = raw_message

img = Image.open("certification_template.png")
icon_path = io.BytesIO(urllib.request.urlopen(icon_url).read())
icon_img = Image.open(icon_path)
icon_img_resize = icon_img.resize((100, 100))
mask = Image.new("L", img.size, 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.ellipse((726, 231, 826, 331), 255)
base = Image.new("RGB", img.size, (255, 255, 255))
base_draw = ImageDraw.Draw(base)
base.paste(icon_img_resize, (726, 231))

draw = ImageDraw.Draw(img)
img_width, img_height = img.size
center_align = True
ratio = 0.8
fontpath = "hiragino.ttc"
msg_color = (0, 0, 0)
font = ImageFont.truetype("hiragino.ttc", 40)
msg_width, msg_height = font.getsize(message)
msg_y = 371
msg_x = int(0.5 * (img_width - msg_width))

draw.text((msg_x, msg_y), message, fill=msg_color, font=font)

Image.composite(base, img, mask).save(output_name)