const genSrcAndDest = (data) => {
  const dataInt8 = new Uint8ClampedArray(data.buffer)
  const simpleChannelLength = dataInt8.length / 4
  const r = new Uint8ClampedArray(simpleChannelLength)
  const g = new Uint8ClampedArray(simpleChannelLength)
  const b = new Uint8ClampedArray(simpleChannelLength)
  const a = new Uint8ClampedArray(simpleChannelLength)
  const _r = new Uint8ClampedArray(simpleChannelLength)
  const _g = new Uint8ClampedArray(simpleChannelLength)
  const _b = new Uint8ClampedArray(simpleChannelLength)
  const _a = new Uint8ClampedArray(simpleChannelLength)
  for (let i = 0; i < simpleChannelLength; i++) {
    _r[i] = r[i] = dataInt8[i * 4]
    _g[i] = g[i] = dataInt8[i * 4 + 1]
    _b[i] = b[i] = dataInt8[i * 4 + 2]
    _a[i] = a[i] = dataInt8[i * 4 + 3]
  }
  return { src: [r, g, b, a], dest: [_r, _g, _b, _a] }
}

const mergeChannels = ([r, g, b, a]) => {
  const simpleChannelLength = r.length
  const data = new Uint8ClampedArray(simpleChannelLength * 4)
  for (let i = 0; i < simpleChannelLength; i++) {
    data[4 * i] = r[i]
    data[4 * i + 1] = g[i]
    data[4 * i + 2] = b[i]
    data[4 * i + 3] = a[i]
  }
  return Buffer.from(data)
}

module.exports = { genSrcAndDest, mergeChannels }
