from PIL import Image
im = Image.open("current/assignment_8/clouds.jpg") #open heightmap
pix = im.load()

# print(im.size) #Get the width and hight of the image for iterating over

width = im.size[0]
height = im.size[1]

print("var gridHeights = [")
for w in range(0,width,4):
	for h in range(0,height,4):
		print("\t[" + str(w/4) + ", " + str(h/4) + ", " + str(pix[w,h][0]) + "]," );
print("];")

# print (pix[x,y]) #Get the RGBA Value of the a pixel of an image
# pix[x,y] = value # Set the RGBA Value of the image (tuple)
#
#### format #####
# positions = [
# 	[w, h, pix[w,h][0]]
# ]