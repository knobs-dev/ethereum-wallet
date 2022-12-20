const webpack = require("webpack");

module.exports = {
  // ...
  webpack: {
    alias: {
      /* ... */
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        }),
      ],
      remove: [
        /* ... */
      ],
    },
    configure: {
      /* ... */
    },
    configure: (webpackConfig, { env, paths }) => {
      /* ... */
      return webpackConfig;
    },
  },
};

// module.exports = {
//   configure: {
//     resolve: {
//       fallback: {
//         buffer: require.resolve("buffer"),
//         // crypto: require.resolve("crypto-browserify"),
//         // stream: require.resolve("stream-browserify"),
//         // assert: require.resolve("assert"),
//         // http: require.resolve("stream-http"),
//         // https: require.resolve("https-browserify"),
//         // os: require.resolve("os-browserify"),
//         // url: require.resolve("url"),
//       },
//     },
//   },
//   plugins: {
//     add: [
//   new webpack.ProvidePlugin({
//     Buffer: ["buffer", "Buffer"],
//   }),
//     ],
//   },
// };
