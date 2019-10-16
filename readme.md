# Detection of peaks in data

Javascript port of an original python function for the detection of peaks in value arrays. Please go and the orginal documentation for an understanding of the function and its parameters at:

 - https://nbviewer.jupyter.org/github/demotu/BMC/blob/master/notebooks/DetectPeaks.ipynb

## Install 

  $ npm install "@joe_six/duarte-watanabe-peak-detection"

## Usage

```javascript
const detect_peaks = require("@joe_six/duarte-watanabe-peak-detection")

let x = [0, 1, 0, 2, 0, 3, 0, 2, 0, 1, 0]
// set minimum peak distance = 2
var peaks = detect_peaks(x, {mpd: 2})
```
