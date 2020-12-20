const splitChannel = (data) => {
  const dataInt8 = new Uint8ClampedArray(data.buffer)
  const simpleChannelLength = dataInt8.length / 4
  const r = new Uint8ClampedArray(simpleChannelLength)
  const g = new Uint8ClampedArray(simpleChannelLength)
  const b = new Uint8ClampedArray(simpleChannelLength)
  const a = new Uint8ClampedArray(simpleChannelLength)
  for (let i = 0; i < simpleChannelLength; i++) {
    r[i] = dataInt8[i * 4]
    g[i] = dataInt8[i * 4 + 1]
    b[i] = dataInt8[i * 4 + 2]
    a[i] = dataInt8[i * 4 + 3]
  }
  return [r, g, b, a]
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

module.exports = { splitChannel, mergeChannels }
