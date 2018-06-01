const path = require('path')
const crypto = require('crypto')

const fs = require('fs-extra')
const debug = require('debug')('*')

const options = {}
const option = {
  throws: true,
  max: 0,
  ttl: 24 * 60 * 60 * 1000,
  interval: -1,
}

const createStorage = (dir='node-storage', opts={}) => {
  dir = path.normalize(dir)
	if (!path.isAbsolute(dir)) {
		dir = path.join(process.cwd(), dir)
  }

  options[dir] = options[dir] || {
    ...options
  }

  const prefix = '__storage__'
  const md5 = value => crypto.createHash('md5').update(value).digest('hex')
  const name = filename => `${prefix}${md5(filename)}`
  const interval = opts.interval && opts.interval != options[dir].interval

  options[dir] = {
    ...options[dir],
    ...opts,
  }

  const storage = (_dir, _opts={}) => {
    return createStorage(path.join(dir, _dir), {
      ...options[dir],
      ..._opts,
    })
  }

  if(interval) {
    clearInterval(storage.__interval)
    storage.__interval = setInterval(() => {
      storage.clean()
    }, options[dir].interval)
    storage.__interval.unref && storage.__interval.unref()
  }

  Object.defineProperty(storage, 'length', {
    get: function() {
      return fs.readdirSync(dir).filter(filename => {
        return filename.startsWith(prefix)
      }).length
    },
  })
  storage.key = function(index) {
    const files = fs.readdirSync(dir).filter(filename => {
      return filename.startsWith(prefix)
    }).map(filename => {
      return fs.readJSONSync(path.join(dir, filename), {
        throws: options.throws
      }) || {}
    }).sort((a, b) => {
      return a.created - b.created
    })
    return (files[index] || {}).key
    
  }
  storage.getItem = function(key='') {
    const filename = name(key)
    const pathname = path.join(dir, filename)
    if(!fs.pathExistsSync(pathname)) {
      return
    }
    const obj = fs.readJSONSync(pathname, {
      throws: options.throws,
    }) || {}
    return obj.value
  }
  storage.setItem = function(key='', value='', opts={}) {
    const filename = name(key)
    const pathname = path.join(dir, filename)

    if(options[dir].max > 0) {
      fs.pathExists(pathname)
      .then(exists => {
        if(!exists) {
          this.list().then(list => {
            const num = list.length - options[dir].max
            if(num >= 0) {
              return this.shift(num + 1)
            }
          })
        }
      })
      .catch(err => debug(err))
    }

    return fs.outputJSONSync(pathname, {
      key,
      value,
      ttl: opts.ttl || options[dir].ttl,
      created: Date.now(),
    }, {
      throws: options.throws,
    })
  }
  storage.removeItem = function(key='') {
    const filename = name(key)
    const pathname = path.join(dir, filename)
    return fs.removeSync(pathname)
  }
  storage.clear = function(remove=false) {
    if(!fs.pathExistsSync(dir)) {
      return
    }
    if(remove) {
      fs.removeSync(dir)
    }
    else {
      fs.readdirSync(dir).filter(filename => {
        return filename.startsWith(prefix)
      }).map(filename => {
        const pathname = path.join(dir, filename)
        fs.removeSync(pathname)
      })
    }
  }

  storage.get = function(key='') {
    const filename = name(key)
    const pathname = path.join(dir, filename)
    return fs.readJSON(pathname)
    .then(file => Promise.resolve(file.value))
    .catch(err => {
      debug(err)
      return Promise.resolve('')
    })
  }
  storage.set = function(key='', value='') {
    const filename = name(key)
    const pathname = path.join(dir, filename)

    const output = () => {
      return fs.outputJSON(pathname, {
        key,
        value,
        ttl: opts.ttl || options[dir].ttl,
        created: Date.now(),
      })
    }

    if(options[dir].max > 0) {
      return fs.pathExists(pathname)
      .then(exists => {
        if(!exists) {
          this.list().then(list => {
            const num = list.length - options[dir].max
            if(num >= 0) {
              return this.shift(num + 1)
            }
          })
        }
        return output()
      })
      .catch(err => debug(err))
    }
    else {
      return output()
      .catch(err => debug(err))
    }
  }
  storage.remove = function(key='') {
    const filename = name(key)
    const pathname = path.join(dir, filename)
    return fs.remove(pathname)
    .catch(err => Promise.resolve())
  }
  storage.list = function() {
    return fs.readdir(dir)
    .then(filenames => {
      return Promise.all(filenames.filter(filename => {
        return filename.startsWith(prefix)
      })
      .map(filename => {
        const pathname = path.join(dir, filename)
        return fs.readJSON(pathname)
      }))
    })
    .catch(err => Promise.resolve([]))
  }
  storage.valueOf = function() {
    return this.list()
    .then(files => {
      return files.reduce((pre, cur) => {
        return {
          ...pre,
          [cur.key]: cur.value,
        }
      }, {})
    })
    .catch(err => Promise.resolve({}))
  }
  storage.shift = function(num) {
    return this.list()
    .then(files => {
      files.sort((a, b) => a.created - b.created)
      return Promise.all(files.slice(0, num).map(file => this.remove(file.key)))
    })
    .catch(err => Promise.resolve({}))
  }
  storage.pop = function(num) {
    return this.list()
    .then(files => {
      files.sort((a, b) => b.created - a.created)
      return Promise.all(files.slice(0, num).map(file => this.remove(file.key)))
    })
    .catch(err => Promise.resolve({}))
  }
  storage.clean = function(empty=false) {
    return this.list()
    .then(files => {
      const now = Date.now()
      return Promise.all(files.map(file => {
        if(empty || file.created + file.ttl < now) {
          return this.remove(file.key)
        }
        else {
          return Promise.resolve()
        }
      }))
    })
    .catch(err => Promise.resolve({}))
  }

  return storage
}

module.exports = createStorage
