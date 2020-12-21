const Jimp = require('jimp')
const { resolve } = require('path')
const gaussian = require('../src/blur/gaussian')
const box = require('../src/blur/box')
const fast = require('../src/blur/fast')
async function main () {
  const { bitmap } = await Jimp.read(resolve(__dirname, './public/input.jpg'))
  const { width, height, data } = bitmap
  const output = fast(data, width, height, 5)
  // eslint-disable-next-line no-new
  new Jimp({ width, height, data: output }, (err, image) => {
    if (err) {
      console.error(err)
    }
    image.write(resolve(__dirname, './output.png'))
  })
}

main()
