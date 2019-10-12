//
// This is a port of the python code found at: 
// https://nbviewer.jupyter.org/github/demotu/BMC/blob/master/notebooks/DetectPeaks.ipynb
// 
// original authors of the algorithm: "Marcos Duarte, http://github.com/demotu/BMC"
// author of this javascript port: dirk lüsebrink, http://github.com/crux
// 
var h = require('./numpy-helpers')

const Defaults = {
  // detect peaks that are greater than minimum peak height.
  // {None, number}, optional (default = None) 
  mph: undefined, 

  // detect peaks that are at least separated by minimum peak distance (in
  // number of data).
  // positive integer, optional (default = 1)
  mpd: 1,
  
  // detect peaks (valleys) that are greater (smaller) than `threshold` in
  // relation to their immediate neighbors.
  // positive number, optional (default = 0)
  threshold: 0,

  // for a flat peak, keep only the rising edge ('rising'), only the falling
  // edge ('falling'), both edges ('both'), or don't detect a flat peak (None).
  // {None, 'rising', 'falling', 'both'}, optional (default = 'rising')
  //
  // Note: in Javascript for 'None' us 'null'
  edge: 'rising',

  // keep peaks with same height even if they are closer than `mpd`.
  // bool, optional (default = False)
  kpsh: false,

  // if True (1), detect valleys (local minima) instead of peaks.
  // bool, optional (default = False)
  valley: false,
}

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

function detect_peaks(x, params) {
  const p = Object.assign(Defaults, params)

  if(!Array.isArray(x)) {
    throw 'values parameter must be an array of numbers'
  }
  if(x.length < 3) {
    return []
  }

  if(p.valley) {
    x.map(v => -v)
  }

  // find indexes of all peaks
  var dx = x.slice(1).map((v, i) => v - x[i])

  // handle NaN's
  var indnan = h.where(x, val => val === NaN)
  if(0 < indnan.lenght) {
    indnan.forEach(i => x[i] = Infinity)
    h.where(dx, val => val === NaN).forEach(i => dx[i] = Infinity)
  }

  var [ine, ire, ife] = [[],[],[]]
  if(!p.edge) {
    // ine = np.where((np.hstack((dx, 0)) < 0) & (np.hstack((0, dx)) > 0))[0]
    ine = h.where(h.AA(h.A(dx.concat(0), v => v < 0), h.A(d[0].concat(dx), v => 0 < v), (a,b) => a && b))
  } else {
    if(p.edge.match(/rising|both/i)) {
      // ire = np.where((np.hstack((dx, 0)) <= 0) & (np.hstack((0, dx)) > 0))[0]
      ire = h.where(h.AA(h.A(dx.concat(0), v => v <= 0), h.A([0].concat(dx), v => 0 < v), (a,b) => a && b))
    }
    if(p.edge.match(/falling|both/i)) {
      // ife = np.where((np.hstack((dx, 0)) < 0) & (np.hstack((0, dx)) >= 0))[0]
      ife = h.where(h.AA(h.A(dx.concat(0), v => v < 0), h.A([0].concat(dx), v => 0 <= v), (a,b) => a && b))
    }
  }
  var ind = h.uniq(h.hstack(ine, ire, ife))

  // handle NaN's
  if(0 < ind.length && 0 < indnan.length) {
    // NaN's and values close to NaN's cannot be peaks
    // ind = ind[np.in1d(ind, np.unique(np.hstack((indnan, indnan-1, indnan+1))), invert=True)]
    ind = mask(
      ind, 
      in1d(
        h.uniq(
          h.hstack(
            indnan, h.A(indnam, x=>x-1), (h.A(indnan, x=>x+1)))),
        {invert: true}))
  }

  // first and last values of x cannot be peaks
  //  if ind.size and ind[0] == 0:
  //      ind = ind[1:]
  if(ind[0] === 0) {
    ind = ind.slice(1)
  }
  // if ind.size and ind[-1] == x.size-1:
  //    ind = ind[:-1]
  if(ind[ind.length-1] === 0) {
    ind = ind.slice(0, -1)
  }

  // remove peaks < minimum peak height
  // if ind.size and mph is not None:
  //   ind = ind[x[ind] >= mph]
  if(p.mph) {
    ind = mask(ind, h.A(x, val >= mph))
  }
  // remove peaks - neighbors < threshold
  // if ind.size and threshold > 0:
  //     dx = np.min(np.vstack([x[ind]-x[ind-1], x[ind]-x[ind+1]]), axis=0)
  //     ind = np.delete(ind, np.where(dx < threshold)[0])
  if(0 < p.threshold) {
    dx = min_axis_0(
          [                               // vstack[ [..], [..] ]
            h.AA(                           // x[ind]-x[ind-1]
              Asub(x, ind),               // x[ind]
              Asub(                       // x[ind-1]
                x, 
                h.A(ind, i => i-1)),        // ind-1
              (a,b) => a-b),
            h.AA(                           // x[ind]-x[ind-1]
              Asub(x, ind),               // x[ind]
              Asub(                       // x[ind+1]
                x, 
                h.A(ind, i => i+1)),        // ind+1
              (a,b) => a-b)])

    ind = mask(                           // np.delete(..  mask instead of
      ind,                                // np.delete because we put a ! in
                                          // the where condition
      h.where(dx, x => !(x < p.threshold))) // np.where(dx < threshold)[0])
  }

  // detect small peaks closer than minimum peak distance
  // if ind.size and mpd > 1:
  if(p.mpd > 1) {
    /*
        ind = ind[np.argsort(x[ind])][::-1]  # sort ind by peak height
        idel = np.zeros(ind.size, dtype=bool)
        for i in range(ind.size):
            if not idel[i]:
                # keep peaks with the same height if kpsh is True
                idel = idel | (ind >= ind[i] - mpd) & (ind <= ind[i] + mpd) \
                    & (x[ind[i]] > x[ind] if kpsh else True)
                idel[i] = 0  # Keep current peak
        # remove the small peaks and sort back the indexes by their occurrence
        ind = np.sort(ind[~idel])
        */
  }

  return ind
}

module.exports = detect_peaks
