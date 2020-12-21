const { genSrcAndDist, mergeChannels } = require('../utils')
function gaussian (data, width, height, radius) {
  const { src, dist } = genSrcAndDist(data)
  const rs = Math.ceil(radius * 2.57)
  for (let index = 0; index < 3; index++) {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        let val = 0
        let wsum = 0
        for (let iy = i - rs; iy < i + rs + 1; iy++) {
          for (let ix = j - rs; ix < j + rs + 1; ix++) {
            const x = Math.min(width - 1, Math.max(0, ix))
            const y = Math.min(height - 1, Math.max(0, iy))
            const dsq = (ix - j) * (ix - j) + (iy - i) * (iy - i)
            const wght = Math.exp(-dsq / (2 * radius * radius)) / (Math.PI * 2 * radius * radius)
            val += src[index][y * width + x] * wght; wsum += wght
          }
        }
        dist[index][i * width + j] = Math.round(val / wsum)
      }
    }
  }
  return mergeChannels(dist)
}
module.exports = gaussian
