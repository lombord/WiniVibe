# Compression utility functions

from typing import Tuple, cast
from PIL import Image
from colorsys import rgb_to_hsv


RGB = Tuple[int, int, int]


def rgb2hex(rgb: RGB) -> str:
    return "#{:02x}{:02x}{:02x}".format(*rgb)


def get_vibrance(H: float, S: float, V: float) -> float:
    """Calculate color vibrance based on Hue, Saturation, and Brightness

    Args:
        H (float): _Hue_
        S (float): _Saturation_
        V (float): _Brightness_

    Returns:
        float: _vibrance_
    """

    H *= 360
    h_weight: float
    SV: float = S * V

    if H <= 60:
        # how yellow the color is
        D = (60 - H) / 60
        S2 = S * S
        SVR = V * V * 0.2 + S2
        h_weight = max((D**5) * SVR * SVR * 1.5, S2 * 0.15)
    elif H <= 180:
        # how green the color is
        D = 1 - abs(120 - H) / 60
        h_weight = (SV + D * 0.1 if H < 120 else SV + D * 0.3) * 2
    elif 180 < H < 300:
        # how blue the color is
        D = abs(240 - H) / 60
        D2 = 1 - D
        h_weight = (
            max(D * 0.2 + SV, D * S * 0.6 + D2 * D2 * V * V, 0.15)
            if H <= 240
            else max(D2 * V, D * (SV + 0.3), 0.1)
        ) * 1.5

    else:
        h_weight = max(V * V * 0.2 + S * S, 0.1) * 1.5

    return max(h_weight * SV, 0.001)


def dominant_color(
    fp,
    resize: bool = True,
    palette_size: int = 32,
    img_size=100,
    min_V=0.2,
) -> str:
    """Calculates dominant color from given image(or image path/file name)

    Args:
        fp (Union[str, bytes, Path]): _A filename (string), pathlib.Path object or a file object._
        resize (bool, optional): _If true image will be resized before extracting color_.
        palette_size (int, optional): _Palette colors size.
        img_size (int, optional): _Palette image size_.
        min_V (float, optional): _Minimum value/brightness percent_.

    Returns:
        _str_: _Dominant color as hex_
    """

    img = Image.open(fp)
    # resize image for better performance
    if resize:
        print("Being resized")
        img.thumbnail((img_size, img_size))

    # convert image to P mode to get palette
    paletted = img.quantize(
        colors=palette_size,
        method=Image.Quantize.MAXCOVERAGE,
        kmeans=1,
    )
    # get palette of the image
    palette = paletted.getpalette()
    # get list of tuple of color count and palette index
    color_counts = paletted.getcolors()
    # dominant color with default color
    dominant_color: RGB = (83, 83, 83)
    max_priority = 0
    if color_counts and palette:
        for count, i in color_counts:
            # get color from palette using index
            rgb = palette[i * 3 : i * 3 + 3]
            # convert rgb to hsv to calculate color priority
            H, S, V = rgb_to_hsv(*[x / 255 for x in rgb])
            # if color brightness is not valid continue
            if V <= min_V:
                continue
            # calculate color priority based: color_count * vibrance
            priority = count * get_vibrance(H, S, V)
            if priority > max_priority:
                dominant_color = cast(RGB, rgb)
                max_priority = priority

    # return as hexadecimal color
    return rgb2hex(dominant_color)
