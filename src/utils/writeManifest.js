const { getManifestJson } = require('./index')
const path = require('path')
const fse = require('fs-extra')
// const { getLibraConfig } = require('../utils')
// const { sourcePath } = getLibraConfig()

function customJsonStringify (key, value) {
  if (typeof value === 'function') {
    return `/Function(${value.toString()})/`
  }
  return value
}

const writeManifest = () => {
  require('ignore-styles').default(['.sass', '.scss', '.png', '.jpg', '.jpeg', '.gif', '.css', '.less', '.svg'])
  const library = require(path.resolve('dist/index.js'))
  // console.log(library)
  const manifestComponents = []
  Object.keys(library).forEach(compName => {
    const Comp = library[compName]
    // console.log(object)
    if (typeof Comp !== 'function') {
      console.warn(`${compName} is not a Class`)
      // continue
      return
    }
    const componentManifest = Comp.manifest
    componentManifest && manifestComponents.push(componentManifest)
  })
  // for (const compName in library) {
  //   if( )
  //   console.log(compName)
  //   const Comp = library[compName]
  //   if (typeof Comp !== 'function') {
  //     console.warn(`${compName} is not a Class`)
  //     continue
  //   }
  //   const componentManifest = Comp.manifest || new Comp().manifest
  //   componentManifest && manifestComponents.push(componentManifest)
  // }
  // console.log(object)
  const manifestJson = getManifestJson()
  // const manifestComponents = []
  // const loop = (obj, prefix = '') => {
  //   for (const key in obj) {
  //     const item = obj[key]
  //     if (typeof item === 'string') {
  //       const libPath = item.replace(sourcePath, 'lib')
  //       console.log(path.resolve(libPath))
  //       require('ignore-styles').default(['.sass', '.scss', '.png', '.jpg', '.jpeg', '.gif', '.css', '.less', '.svg'])
  //       const CLS = require(path.resolve(libPath)).default
  //       if (typeof CLS !== 'function') {
  //         // throw new Error(`${componentName} is not a Class`)
  //         console.warn(`${key} is not a Class`)
  //         continue
  //       }
  //       const componentManifest = CLS.manifest || new CLS().manifest
  //       if (componentManifest) {
  //         componentManifest.name = prefix + key
  //         manifestComponents.push(componentManifest)
  //       }
  //     } else {
  //       loop(item, `${key}.`)
  //     }
  //   }
  // }

  // loop(manifestJson.components)
  const output = { ...manifestJson, components: manifestComponents }
  fse.outputFileSync(
    path.resolve('./dist/manifest.json'),
    JSON.stringify(output, customJsonStringify)
  )
  process.exit(0)
}
module.exports = writeManifest
