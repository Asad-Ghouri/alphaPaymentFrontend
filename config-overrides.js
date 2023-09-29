const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};

  Object.assign(fallback, {
    // ENABLE OR DISABLE YOUR POLYFILLS HERE
    http: require.resolve("stream-http"),
    zlib: require.resolve("browserify-zlib"),
    stream: require.resolve("stream-browserify"),
    https: require.resolve("https-browserify"),
  });

  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  config.resolve.extensions.push(".mjs");
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });

  return config;
};