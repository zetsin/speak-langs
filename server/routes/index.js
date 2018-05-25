const fs = require('fs')
const path = require('path')

const ignore = [
  path.basename(__filename)
]

fs.readdirSync(__dirname).forEach(file => {
  file = path.parse(file)
  if (!ignore.includes(file.base) && file.ext === '.js') {
    exports[file.name] = require(`./${file.name}`)
  }
})
