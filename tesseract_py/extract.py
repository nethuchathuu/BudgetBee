import pytesseract
from PIL import Image

# If Tesseract is not in your PATH, specify the full path (Windows example):
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Load the image from file
image_path = "E:/FinalYearProject/tesseract_py/1.png"  # replace with your image path
image = Image.open(image_path)

# Extract text
extracted_text = pytesseract.image_to_string(image)

print("Extracted Text:")
print(extracted_text)
