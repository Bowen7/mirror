const { genSrcAndDist, mergeChannels } = require('../utils')
const fast = (data, width, height, radius) => {
  const bxs = boxesForGaussian(radius, 3)
  const { src, dist } = genSrcAndDist(data)
  for (let i = 0; i < 3; i++) {
    boxBlur(src[i], dist[i], width, height, (bxs[0] - 1) / 2)
    boxBlur(dist[i], src[i], width, height, (bxs[1] - 1) / 2)
    boxBlur(src[i], dist[i], width, height, (bxs[2] - 1) / 2)
  }
  return mergeChannels(dist)
}

function boxesForGaussian (sigma, n) {
  const wIdeal = Math.sqrt((12 * sigma * sigma / n) + 1)
  let wl = Math.floor(wIdeal); if (wl % 2 === 0) wl--
  const wu = wl + 2

  const mIdeal = (12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4)
  const m = Math.round(mIdeal)

  const sizes = []; for (let i = 0; i < n; i++) sizes.push(i < m ? wl : wu)
  return sizes
}

function boxBlur (srcChannel, distChannel, w, h, r) {
  for (let i = 0; i < srcChannel.length; i++) {
    distChannel[i] = srcChannel[i]
  }
  boxBlurH(distChannel, srcChannel, w, h, r)
  boxBlurT(srcChannel, distChannel, w, h, r)
}

function boxBlurH (srcChannel, distChannel, width, height, r) {
  const iarr = 1 / (r + r + 1)
  for (let i = 0; i < height; i++) {
    let ti = i * width; let li = ti; let ri = ti + r
    const fv = srcChannel[ti]; const lv = srcChannel[ti + width - 1]; let val = (r + 1) * fv
    for (let j = 0; j < r; j++) val += srcChannel[ti + j]
    for (let j = 0; j <= r; j++) { val += srcChannel[ri++] - fv; distChannel[ti++] = Math.round(val * iarr) }
    for (let j = r + 1; j < width - r; j++) { val += srcChannel[ri++] - srcChannel[li++]; distChannel[ti++] = Math.round(val * iarr) }
    for (let j = width - r; j < width; j++) { val += lv - srcChannel[li++]; distChannel[ti++] = Math.round(val * iarr) }
  }
}
function boxBlurT (srcChannel, distChannel, width, height, r) {
  const iarr = 1 / (r + r + 1)
  for (let i = 0; i < width; i++) {
    let ti = i; let li = ti; let ri = ti + r * width
    const fv = srcChannel[ti]; const lv = srcChannel[ti + width * (height - 1)]; let val = (r + 1) * fv
    for (let j = 0; j < r; j++) val += srcChannel[ti + j * width]
    for (let j = 0; j <= r; j++) { val += srcChannel[ri] - fv; distChannel[ti] = Math.round(val * iarr); ri += width; ti += width }
    for (let j = r + 1; j < height - r; j++) { val += srcChannel[ri] - srcChannel[li]; distChannel[ti] = Math.round(val * iarr); li += width; ri += width; ti += width }
    for (let j = height - r; j < height; j++) { val += lv - srcChannel[li]; distChannel[ti] = Math.round(val * iarr); li += width; ti += width }
  }
}
module.exports = fast
