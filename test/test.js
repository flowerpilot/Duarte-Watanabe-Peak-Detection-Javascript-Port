var test = require('unit.js')

var detect_peak = require('../detect-peak')
var h = require('../numpy-helpers')

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

describe('numpy-helpers', function() {
    describe('where', function() {
        it('finds all true evaluated elements values without condition', function() {
            test.array(
                h.where([true, false, false, true])).
                is([0,3])
        })
        it('evalutes condition on values', function() {
            test.array(
                h.where([1,2,3,4], x=>2<x)).
                is([2,3])
        })
    })

    describe('A', function() {
        it('is just simple mapper for array.map..', function() {
            test.array(h.A([1,2,3], x => x+1)).is([2,3,4])
        })
    })

    describe('AA', function() {
        it('maps pairwise over 2 arrays', function() {
            test.array(h.AA([1,2,3], [1,2,3], (a,b) => a/b)).is([1,1,1])
        })
        it('throws up on unequal length arrays..', function() {
            test.
                exception(function() { h.AA([1,2,3], [1,2]) }).
                match("arrays must be of equal length: 3 != 2")
        })
    })

    describe('hstack', function() {
        it('concatenates two arrays', function() {
            test.array(
                h.hstack([1], [2,3])).
                is([1,2,3])
        })
        it('concatenates three arrays', function() {
            test.array(
                h.hstack([1], [2,3], [4,5,6])).
                is([1,2,3,4,5,6])
        })
    })

    describe('uniq', function() {
        it('removes duplicates', function() {
            test.array(
                h.uniq([1, 1, 2, 2, 3, 2, 4, 9, 1])).
                is([1,2,3,4,9])
        })
    })
})
