/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: 'app',
  browserBuildDirectory: 'public/build',
  future: {
    v2_errorBoundary: true,
  },
  publicPath: '/build/',
  serverBuildDirectory: 'api/_build',
  serverDependenciesToBundle: ['@formkit/auto-animate/react'],
}
