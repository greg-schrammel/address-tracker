const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  images: {
    domains: [
      'raw.githubusercontent.com',
      'assets.coingecko.com',
      'logos.covalenthq.com',
      'www.covalenthq.com',
      's2.coinmarketcap.com',
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  },
})
