const forever = require('forever-monitor')

const child = new (forever.Monitor)('bin/www', {
  uid: 'app',
  append: true,
  watch: true,
  cwd: __dirname,
  sourceDir: __dirname,
  watchIgnoreDotFiles: false,
  watchIgnorePatterns: ['.node-persist/**']
})

child.on('exit', () => {
  console.log('App has exited')
})
child.start()
