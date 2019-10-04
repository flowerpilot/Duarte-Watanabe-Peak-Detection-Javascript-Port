var test = require('unit.js')

var detect_peak = require('../detect-peak')

describe('detect-peak', function() {
  it('empty values array', function() {
    test.array(detect_peak([])).is([])
  })

  it('minimum distance', function() {
    let x = [0, 1, 0, 2, 0, 3, 0, 2, 0, 1, 0]
    test.array(detect_peak(x, {mds: 2})).is([1, 5, 9])
    test.array(detect_peak(x)).is([1, 3, 5, 7, 9])
  })
})
