const Jimp = require('jimp')
const { resolve } = require('path')
const { genSrcAndDest, mergeChannels } = require('../src/utils')
const gaussian = require('../src/blur/gaussian')
// const box = require('../src/blur/box')
// const fast = require('../src/blur/fast')
async function main () {
  const { bitmap } = await Jimp.read(resolve(__dirname, './public/input.jpg'))
  const { width, height, data } = bitmap
  const { src: srcRgba, dest: destRgba } = genSrcAndDest(data)
  for (let i = 0; i < 3; i++) {
    gaussian(srcRgba[i], destRgba[i], width, height, 5)
  }
  const output = mergeChannels(destRgba)
  // eslint-disable-next-line no-new
  new Jimp({ width, height, data: output }, (err, image) => {
    if (err) {
      console.error(err)
    }
    image.write(resolve(__dirname, './output.png'))
  })
}

main()
