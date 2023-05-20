const { createRoutesFromFolders } = require('@remix-run/v1-route-convention')

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  publicPath: '/build/',
  routes: (defineRoutes) => createRoutesFromFolders(defineRoutes),
  serverBuildPath: 'api/index.js',
  serverDependenciesToBundle: ['@formkit/auto-animate/react'],
  serverModuleFormat: 'cjs',
}
