const Jimp = require('jimp')

async function main() {
  const { bitmap } = await Jimp.read('./public/input.jpeg')
  new Jimp({ ...bitmap }, (err, image) => {
    image.write('./output.png')
  })
}

main()
