const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@prime/ui-ai'],
  outputFileTracingRoot: path.join(__dirname, '../'),
}

module.exports = nextConfig
