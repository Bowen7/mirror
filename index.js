const Jimp = require('jimp')

async function main() {
  const { bitmap } = await Jimp.read('./demos/27432981.jpeg')
  new Jimp({ ...bitmap }, (err, image) => {
    image.write('./dist/dist.png')
  })
}

main()
