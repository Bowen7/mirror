const Jimp = require('jimp')
const { resolve } = require('path')
const gaussian = require('../src/gaussian')
async function main () {
  const { bitmap } = await Jimp.read(resolve(__dirname, './public/input.jpeg'))
  const { width, height, data } = bitmap
  const output = gaussian(data, width, height, 5)
  // eslint-disable-next-line no-new
  new Jimp({ width, height, data: output }, (err, image) => {
    if (err) {
      console.error(err)
    }
    image.write(resolve(__dirname, './output.png'))
  })
}

main()
