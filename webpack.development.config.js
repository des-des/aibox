const path = require("path")
const webpack = require("webpack")

module.exports = {
  entry: {
    app: ["./client/"]
  },
  output: {
    path: path.resolve(__dirname, "public"),
    publicPath: "/public/",
    filename: "bundle.js"
  },
  module : {
    loaders : [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel']
    }]
  },
  devServer : { hot: true },
  plugins   : [ new webpack.HotModuleReplacementPlugin() ],
  inline    : true,
  progress  : true,
  colors    : true
}
