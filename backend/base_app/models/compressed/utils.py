# Compression utility functions

from functools import partial
from pathlib import Path
from typing import Union, overload
from PIL import Image
from colorsys import rgb_to_hsv


RGB = tuple[int, int, int]


def clamp(val: int, min_: int, max_: int = None) -> int:
    if max_ is None:
        max_, min_ = min_, 0
    return max(min_, min(max_, val))


rgbClamp = partial(clamp, **{"min_": 255})


@overload
def rgb2hex(rgb: RGB) -> str: ...
@overload
def rgb2hex(rgb: tuple[RGB]) -> tuple[str]: ...
def rgb2hex(rgb: Union[RGB, tuple[RGB]]) -> Union[str, tuple[str]]:
    """Convert rgb color(s) to hex

    Args:
        rgb (Union[RGB, tuple[RGB]]): _rgb color(s)_

    Returns:
        Union[str, tuple[str]]: _hex color(s)_
    """
    if isinstance(rgb[0], (tuple, list)):
        return tuple(map(rgb2hex, rgb))
    return "#{:02x}{:02x}{:02x}".format(*map(rgbClamp, rgb))


def hue_weight(hue: float) -> float:
    """Calculates hue weight of hsv or hsl colors

    Args:
        hue (float): _hue_

    Returns:
        float: _Calculated weight_
    """
    if hue <= 5:
        return 0.7
    elif hue < 60:
        return 0.6
    else:
        return 1.5


def dominant_color(
    fp: Union[str, bytes, Path],
    resize: bool = True,
    palette_size: int = 128,
    img_size=100,
    min_S=0.1,
    min_V=0.15,
) -> str:
    """Calculates dominant color from given image(or image path/file name)

    Args:
        fp (Union[str, bytes, Path]): _A filename (string), pathlib.Path object or a file object._
        resize (bool, optional): _If true image will be resized before extracting color_. Defaults to True.
        palette_size (int, optional): _Palette colors size. Defaults to 128.
        img_size (int, optional): _Palette image size_. Defaults to 100.
        min_S (float, optional): _Minimum saturation percent_. Defaults to 0.1.
        min_V (float, optional): _Minimum value/brightness percent_. Defaults to 0.15.

    Returns:
        _str_: _Dominant color as hex_
    """

    img = Image.open(fp).copy()
    # resize image for better performance
    if resize:
        print("Being resized")
        img.thumbnail((img_size, img_size))

    # convert image to P mode to get palette
    paletted = img.convert("P", palette=Image.ADAPTIVE, colors=palette_size)
    # get palettes
    palette = paletted.getpalette()
    # get list of tuple of color count and palette index
    color_counts = paletted.getcolors()
    # dominant color with default color
    dominant_color = [83, 83, 83]
    max_priority = 0
    for count, i in color_counts:
        # get color from palette using index
        rgb = palette[i * 3 : i * 3 + 3]
        # convert rgb to hsv to calculate color priority
        H, S, V = rgb_to_hsv(*(x / 255 for x in rgb))
        # if color vibrance is not valid continue
        if S < min_S or V < min_V:
            continue
        # calculate color priority using: color_count * saturation * brightness * hue_weight
        priority = (count * 3) * S * V * hue_weight(H * 360)
        if priority > max_priority:
            dominant_color = rgb
            max_priority = priority

    # return as hexadecimal color
    return rgb2hex(dominant_color)
