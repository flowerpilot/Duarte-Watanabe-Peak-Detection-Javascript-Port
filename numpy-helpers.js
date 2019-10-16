const helpers = {
    A: function(a, f) {
        return a.map(f)
    },

    AA: function(a, b, f) {
        if(a.length != b.length) {
            throw `arrays must be of equal length: ${a.length} != ${b.length}`
        }

        return a.map((v,i) => f(v, b[i]))
    },

    // return a sub selection of all indices of the input array which is
    // defined by the indices in idx
    Asub: function(a, idx) {
        return idx.map(i => a[i])
    },

    // Returns the indices that would sort an array.
    // example:
    // >>> x = np.array([3, 1, 2])
    // >>> np.argsort(x)
    // array([1, 2, 0])
    argsort: function(v) {
        return Array.from(
            Array(v.length).keys()).
            sort(
                (a, b) => v[a] < v[b] ? 
                -1 : 
                (v[b] < v[a]) | 0)
    },

    /* arguments are a variable amount of arrays arrays 
     * example: hstack([1], [2,3], [4,5,6]) returns [1,2,3,4,5,6]
     */
    hstack: function() {
        return Array.prototype.slice.call(arguments).reduce((a,b) => a.concat(b))
    },

    uniq: function(a) { // , opts) {
        // opts = Object.assign({'invert':false, opts)
        return [...new Set(a)].sort((a,b) => a-b)
    },

    // returns indices of all elements where the condition is true. When no
    // condition is given the element itself is evaluated for its boolean value
    where: function(values, condition/*optional*/) {
        var res = []
        var p = condition ? condition : (x => x)
        values.forEach(function(val, idx) {
            if(p(val)) {
                res.push(idx)
            }
        })
        return res
    },

    mask: function(a, mask) {
        if(a.length < mask.length) {
            throw `too many boolean indices: ${a.length} < ${mask.length}`
        }

        return a.filter((_,i) => mask[i])
    },

    min_axis_0: function(a) {
        return a[0].map(function(x, i1) {
            return a.map(e => e[i1]).reduce((min, cur) => min < cur ? min : cur)
        })
    }

/*
// XXX: untested code block, due to lack of NaN example...
function in1d(a, b, opts) {
  opts = Object.assign({'invert':false, opts})
  return a.map(x => (b.includes(x) ^ opts.invert) === 1)
}
*/
}

module.exports = helpers
