const watch = require('node-watch')
const shell = require('shelljs')

shell.exec('./build.sh', {async: true})

watch('./src/', { recursive: true }, function(evt, name) {
  if (name.indexOf('___') !== -1) {
    return
  }
  console.log('Change detected! Rebuilding...')
  shell.exec('./build.sh', {async: true})
})
