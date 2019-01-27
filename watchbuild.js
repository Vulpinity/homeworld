const watch = require('node-watch')
const shell = require('shelljs')

shell.exec('./dev.sh', {async: true})

watch('./src/', { recursive: true }, function(evt, name) {
  if (name.indexOf('___') !== -1) {
    return
  }
  console.log('Change detected! Rebuilding...')
  shell.exec('./dev.sh', {async: true})
})
