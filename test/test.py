#!/usr/bin/env python3

import numpy as np

import sys 
import os
dirname = os.path.dirname(__file__)
sys.path.append(os.path.join(dirname, ".."))
from detect_peaks import detect_peaks


def main():
    x = [0, 1, 0, 2, 0, 3, 0, 2, 0, 1, 0]
    # set minimum peak distance = 2
    res = detect_peaks(x, mpd=1, show=False)
    print(f'result: {res}')


if __name__ == "__main__":
    main()

