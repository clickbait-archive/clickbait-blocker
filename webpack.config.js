var webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    env = require("./utils/env");

module.exports = {
  entry: {
    content_scripts: path.join(__dirname, "src", "js", "content_scripts.js"),
    options: path.join(__dirname, "src", "js", "options.js")
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: "babel" },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.scss$/, loaders: ["style", "css", "sass"]}
    ]
  },
  resolve: {
    modules: ['node_modules', 'src'],
    alias: {
      'clickbait-blocker-sites': path.join(__dirname, './node_modules/clickbait-blocker-sites')
     }
  },
  plugins: [
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({ "process.env": env })
  ]
};
