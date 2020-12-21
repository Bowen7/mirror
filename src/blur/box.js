const { genSrcAndDist, mergeChannels } = require('../utils')
function box (data, width, height, radius) {
  const bxs = boxesForGauss(radius, 3)
  const { src, dist } = genSrcAndDist(data)
  for (let i = 0; i < 3; i++) {
    boxBlur(src[i], dist[i], width, height, (bxs[0] - 1) / 2)
    boxBlur(src[i], dist[i], width, height, (bxs[1] - 1) / 2)
    boxBlur(src[i], dist[i], width, height, (bxs[2] - 1) / 2)
  }
  return mergeChannels(dist)
}
function boxesForGauss (sigma, n) {
  const wIdeal = Math.sqrt((12 * sigma * sigma / n) + 1) // Ideal averaging filter width
  let wl = Math.floor(wIdeal); if (wl % 2 === 0) wl--
  const wu = wl + 2

  const mIdeal = (12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4)
  const m = Math.round(mIdeal)

  const sizes = []; for (let i = 0; i < n; i++) sizes.push(i < m ? wl : wu)
  return sizes
}

function boxBlur (srcChannel, distChannel, width, height, r) {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      let val = 0
      for (let iy = i - r; iy < i + r + 1; iy++) {
        for (let ix = j - r; ix < j + r + 1; ix++) {
          const x = Math.min(width - 1, Math.max(0, ix))
          const y = Math.min(height - 1, Math.max(0, iy))
          val += srcChannel[y * width + x]
        }
      }
      distChannel[i * width + j] = val / ((r + r + 1) * (r + r + 1))
    }
  }
}

module.exports = box
