const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const { findLastCommitSha } = require('./gitBuildId');

const PRODUCTION_DOMAIN_ROOT = '/pdf-generator-api';
const DEVELOPMENT_DOMAIN_ROOT = undefined; // = root of domain

module.exports = phase => ({
  distDir: 'build',

  basePath:
    phase === PHASE_DEVELOPMENT_SERVER
      ? DEVELOPMENT_DOMAIN_ROOT
      : PRODUCTION_DOMAIN_ROOT,

  generateBuildId: async () => {
    const commitSha = await findLastCommitSha();
    return commitSha.substr(0, 7);
  },
});
