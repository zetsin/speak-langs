const forever = require('forever-monitor')

const child = new (forever.Monitor)('bin/www', {
  uid: 'app',
  sourceDir: 'src',
  watch: process.env.NODE_ENV === 'development',
  watchDirectory: '.',
  watchIgnoreDotFiles: false,
})

child.on('exit', () => {
  console.log('App has exited')
})
child.start()
  