import webpack from 'webpack'
import express from 'express'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import debug from 'debug'

import webpackConfig from '../webpack.dev'

const log = {
  pack: debug('webpack'),
  hot: debug('hot-reload'),
}

const compiler = webpack(webpackConfig)

const hotRouter = new express.Router()

hotRouter.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    reasons: false,
  },
}))

hotRouter.use(webpackHotMiddleware(compiler, {
  log: log.pack,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000,
}))

export default hotRouter
