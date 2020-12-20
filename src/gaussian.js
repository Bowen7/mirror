// http://blog.ivank.net/fastest-gaussian-blur.html
const { splitChannel, mergeChannels } = require('./utils')
const gaussian = (data, width, height, radius) => {
  const bxs = boxesForGaussian(radius, 3)
  const rgba = splitChannel(data)
  for (let i = 0; i < 3; i++) {
    boxBlur(rgba[i], width, height, (bxs[0] - 1) / 2)
    boxBlur(rgba[i], width, height, (bxs[1] - 1) / 2)
    boxBlur(rgba[i], width, height, (bxs[2] - 1) / 2)
  }
  return mergeChannels(rgba)
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

function boxBlur (data, w, h, r) {
  boxBlurH(data, w, h, r)
  boxBlurT(data, w, h, r)
}

function boxBlurH (data, w, h, r) {
  const iarr = 1 / (r + r + 1)
  for (let i = 0; i < h; i++) {
    let ti = i * w; let li = ti; let ri = ti + r
    const fv = data[ti]; const lv = data[ti + w - 1]; let val = (r + 1) * fv
    for (let j = 0; j < r; j++) val += data[ti + j]
    for (let j = 0; j <= r; j++) { val += data[ri++] - fv; data[ti++] = Math.round(val * iarr) }
    for (let j = r + 1; j < w - r; j++) { val += data[ri++] - data[li++]; data[ti++] = Math.round(val * iarr) }
    for (let j = w - r; j < w; j++) { val += lv - data[li++]; data[ti++] = Math.round(val * iarr) }
  }
}
function boxBlurT (data, w, h, r) {
  const iarr = 1 / (r + r + 1)
  for (let i = 0; i < w; i++) {
    let ti = i; let li = ti; let ri = ti + r * w
    const fv = data[ti]; const lv = data[ti + w * (h - 1)]; let val = (r + 1) * fv
    for (let j = 0; j < r; j++) val += data[ti + j * w]
    for (let j = 0; j <= r; j++) { val += data[ri] - fv; data[ti] = Math.round(val * iarr); ri += w; ti += w }
    for (let j = r + 1; j < h - r; j++) { val += data[ri] - data[li]; data[ti] = Math.round(val * iarr); li += w; ri += w; ti += w }
    for (let j = h - r; j < h; j++) { val += lv - data[li]; data[ti] = Math.round(val * iarr); li += w; ti += w }
  }
}
module.exports = gaussian
