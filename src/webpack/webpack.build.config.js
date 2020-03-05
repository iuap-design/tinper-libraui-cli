const path = require('path')
const { getManifestJson, getLib } = require('../utils')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const buildConfig = () => {
  const lib = getLib()
  const externals = {}
  lib.forEach(item => {
    externals[item.key] = item.value
  })
  const manifestJson = getManifestJson()
  const libName = manifestJson.name
  const mode = process.env.NODE_ENV
  const plugins = [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'index.css',
      chunkFilename: 'index.css'
    }),
    new SimpleProgressWebpackPlugin()
  ]
  if (mode === 'development') {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerPort: 8080,
        generateStatsFile: false
      }))
  }
  return {
    entry: {
      [libName]: path.resolve('./.libraui/temp/build/index.js')
    },
    mode,
    externals,
    output: {
      filename: 'index.js',
      path: path.resolve('dist'),
      libraryTarget: 'umd',
      library: '__[name]__',
      libraryExport: 'default',
      globalObject: 'this'
    },
    devtool: 'source-map',
    plugins
  }
}

module.exports = buildConfig
