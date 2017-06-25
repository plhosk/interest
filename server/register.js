/**
 * register.js is the entry point for automatic Babel transpiling
 * at runtime with babel-register.
 *
 * In production, babel transpiling is done with Webpack using babel-cli.
 */
require('babel-register')({
  presets: ['es2015', 'stage-0'], // add 'react' if we use server-side rendering
})
// Anything required below this line will be transpiled
require('./server.js')
