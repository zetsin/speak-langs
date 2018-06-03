const forever = require('forever-monitor')

const child = new (forever.Monitor)('bin/www', {
  uid: 'app',
  watch: process.env.NODE_ENV === 'development',
  sourceDir: 'src',
  watchIgnoreDotFiles: false,
  logFile: 'forever-log.log',
  outFile: 'forever-out.log',
  errFile: 'forever-err.log',
})

child.on('exit', () => {
  console.log('App has exited')
})
child.start()
