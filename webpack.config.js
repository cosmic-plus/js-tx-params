module.exports = {
  entry: "./es5/index.js",
  output: {
    path: __dirname + "/web/",
    filename: "tx-params.js",
    library: "txParams",
    libraryTarget: "umd"
  },
  devtool: "source-map"
}
