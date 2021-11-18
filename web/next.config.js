const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const { findLastCommitSha } = require('./gitBuildId');

const PRODUCTION_DOMAIN_ROOT = undefined;
const DEVELOPMENT_DOMAIN_ROOT = undefined; // = root of domain

module.exports = phase => ({
  trailingSlash: true,

  basePath:
    phase === PHASE_DEVELOPMENT_SERVER
      ? DEVELOPMENT_DOMAIN_ROOT
      : PRODUCTION_DOMAIN_ROOT,

  generateBuildId: async () => {
    const commitSha = await findLastCommitSha();
    return commitSha.substr(0, 7);
  },

  webpack: (config, { webpack, buildId }) => {
    fixEnums(config);
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.CONFIG_BUILD_ID': JSON.stringify(buildId),
      })
    );
    return config;
  },
});

// Due to us exporting enums from shared
// https://github.com/vercel/next.js/issues/13045
function fixEnums(config) {
  config.module.rules.forEach(({ use }, i) => {
    if (!use) return;
    const isBabelLoader = Array.isArray(use)
      ? use.findIndex(
          item => item && item.loader && item.loader === 'next-babel-loader'
        ) !== -1
      : use.loader === 'next-babel-loader';
    if (isBabelLoader) {
      // eslint-disable-next-line no-param-reassign
      delete config.module.rules[i].include;
    }
  });
}
