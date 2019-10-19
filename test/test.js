var test = require('unit.js')

var detect_peak = require('../detect-peak')
var h = require('../numpy-helpers')

describe('detect-peak', function() {
    describe('minimum peak height', function() {
        /*
            >>> x = np.sin(2*np.pi*5*np.linspace(0, 1, 200)) + np.random.randn(200)/5
            >>> # set minimum peak height = 0 and minimum peak distance = 20
            >>> detect_peaks(x, mph=0, mpd=20, show=True)
        */
        it('mph = 0 and minimum peak distance = 20', function() {
            // np.sin(2*np.pi*5*np.linspace(0, 1, 200))
            let x = h.A(h.linspace(0, 1, 200), x => Math.sin(x * Math.PI * 2 * 5))
            test.array(
                detect_peak(x, {mph:0, mpd:20})).
                is([10, 50, 90, 129, 169])
        })
    })

    it('empty values array', function() {
        test.array(detect_peak([])).is([])
    })

    it('minimum distance', function() {
        let x = [0, 1, 0, 2, 0, 3, 0, 2, 0, 1, 0]
        test.array(detect_peak(x, {mpd: 2})).is([1, 5, 9])
        test.array(detect_peak(x)).is([1, 3, 5, 7, 9])
    })

    it('minimum distance with sorting relevance', function() {
        let x = [0, 1, 0, 2, 0, 3, 0, 2, 0, 1, 0, 1, 0, 2, 0, 3, 0, 2, 0, 1, 0]
        test.array(detect_peak(x, {mpd: 3})).is([1, 5, 11, 15, 19])
    })

    it('detect both edges', function() {
        let x = [0, 1, 1, 0, 1, 1, 0]
        test.array(detect_peak(x, {edge:'both'})).is([1, 2, 4, 5])
    })

    it('set threshold = 2', function() {
        let x = [-2, 1, -2, 2, 1, 1, 3, 0]
        test.array(detect_peak(x, {threshold:2})).is([1, 6])
    })

    describe("handle NaN's", function() {
        it('set threshold = 2', function() {
            let x = [-2, 1, -2, 2, 1, 1, NaN, 0]
            test.array(detect_peak(x, {threshold:2})).is([1])
        })
    })
})

describe('numpy-helpers', function() {

    describe('in1d', function() {
        /*
        >>> test = np.array([0, 1, 2, 5, 0])
        >>> states = [0, 2]
        >>> mask = np.in1d(test, states)
        >>> mask
        array([ True, False,  True, False,  True])
        */
        it('masks', function() {
            test.array(
                h.in1d([0,1,2,5,0], [0,2])).
                is([true, false,  true, false,  true])
        })

        it('inverts', function() {
            test.array(
                h.in1d_invert([0,1,2,5,0], [0,2])).
                is([false, true, false, true, false])
        })
    })

    it('np.linspace(0, 1,  5)', function() {
        /*
        >>> np.linspace(0, 1, 5)
        >>> array([0.  , 0.25, 0.5 , 0.75, 1.  ])
        */
        test.array(h.linspace(1, 2, 5)).is([1, 1.25, 1.5, 1.75, 2])
    })

    describe('mask', function() {
        it('throws up on two many booleans', function() {
            test.
                exception(function() { h.mask([1,2], [true, false, true]) }).
                match("too many boolean indices: 2 < 3")
        })
        it('removes values where mask is false', function() {
            test.array(
                h.mask([1,2,3], [true, false, true])).
                is([1,3])
        })
        it('works with short masks and defaults the tail to false', function() {
            test.array(
                h.mask([1,2,3], [false, true])).
                is([2])
        })
    })

    describe('argsort', function() {
        // >>> x = np.array([3, 1, 2])
        // >>> np.argsort(x)
        // array([1, 2, 0])
        it('Returns the indices that would sort an array.', function() {
            test.array(
                h.argsort([3,1,2])).
                is([1,2,0])
        })
    })

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
