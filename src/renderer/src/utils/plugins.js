export const registerPlugins = (app) => {
  const imports = import.meta.glob(
    ['../plugins/quasar/index.js', '../plugins/router/index.js'],
    {
      eager: true,
    },
  )
  const importPaths = Object.keys(imports).sort()

  importPaths.forEach((path) => {
    const pluginImportModule = imports[path]

    app.use(pluginImportModule.default)
  })
}
