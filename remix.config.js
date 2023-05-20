/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
  },
  publicPath: '/build/',
  serverBuildPath: 'api/index.js',
  serverDependenciesToBundle: ['@formkit/auto-animate/react'],
  serverModuleFormat: 'cjs',
}
