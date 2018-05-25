const forever = require('forever-monitor')

const child = new (forever.Monitor)('bin/www', {
  uid: 'app',
  append: true,
  watch: true,
  sourceDir: __dirname,
  env: {
    PORT: 8080,
    DEBUG: 'play2talk:*'
  }
})

child.on('exit', function () {
  console.log('App has exited')
})

child.start()
