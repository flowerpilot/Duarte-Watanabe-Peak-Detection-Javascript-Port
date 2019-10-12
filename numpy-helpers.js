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

    /* arguments are a variable amount of arrays arrays 
     * example: hstack([1], [2,3], [4,5,6]) returns [1,2,3,4,5,6]
     */
    hstack: function() {
        return Array.prototype.slice.call(arguments).reduce((a,b) => a.concat(b))
    },

    uniq: function(a) { // , opts) {
        // opts = Object.assign({'invert':false, opts)
        return [...new Set(a)].sort()
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

    /*

function in1d(a, b, opts) {
  opts = Object.assign({'invert':false, opts})
  return a.map(x => (b.includes(x) ^ opts.invert) === 1)
}

function mask(a, mask) {
  if(a.length != mask.length) {
    throw `mask must be of equal length: ${a.length} != ${mask.length}`
  }

  return a.filter((_,i) => mask[i])
}
function min_axis_0(a) {
  return a[0].map(function(x, i1) {
    return a.map(e => e[i1]).reduce((min, cur) => min < cur ? min : cur)
  })
}
*/
}

module.exports = helpers
