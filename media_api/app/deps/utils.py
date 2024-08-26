from PIL import Image, ImageOps


def resize_images(file, sizes, required_mode):
    image = Image.open(file)

    if image.mode != required_mode:
        image = image.convert(required_mode)

    result = {key: ImageOps.fit(image, size) for key, size in sizes.items() if size}
    return result
