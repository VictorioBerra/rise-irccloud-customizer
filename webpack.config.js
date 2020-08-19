const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');
const rfr = require('rfr');

const tamperMonkeyFile = fs.readFileSync(rfr.resolve('./tampermonkey.txt'), { encoding:'utf8' });
const packageVersion = rfr("./package.json").version;
const tampermonkeyFileHeader = tamperMonkeyFile.replace(/\@\@VERSION\@\@/, packageVersion);
const tampermonkeyFileHeaderLines = tampermonkeyFileHeader.split(/\n/);

module.exports = (env, argv) => {

  const isDev = argv.mode === "development";

  const pluginsArr = [
    new ForkTsCheckerWebpackPlugin()
  ];

  const optimization = {
    minimize: true,
    minimizer: []
  }

  // load plugin only in development mode
  if (!isDev) {
    optimization.minimizer.push(new TerserPlugin({
      terserOptions: {
        output: {
          comments: { 
            test: function (comment){
              if(comment) {
                return /\@/i.test(comment) || /UserScript/i.test(comment) ||  /eslint-disable/i.test(comment);
              }
            } 
          }
        },
      },
    }));
    pluginsArr.push(new webpack.BannerPlugin({
      raw: true,
      banner: tampermonkeyFileHeader
    }));
  }

  return {
    optimization: optimization,
    entry: './src/index.ts',
    devtool: isDev ? "inline-source-map" : "", // generate source code only in development mode
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        },
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: pluginsArr
  }
};