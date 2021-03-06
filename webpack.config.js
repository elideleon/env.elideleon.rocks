'use strict';

const Path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CombineLoaders = require( 'webpack-combine-loaders' );
const extractCSS = new ExtractTextPlugin( 'css/vendor.css' );
const extractSASS = new ExtractTextPlugin('css/bundle.css');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (options) => {

  let targetPath = Path.resolve( __dirname, 'src' );

  let webpackConfig = {
    
    devtool: options.devtool,
    
    entry: [
      `webpack-dev-server/client?http://localhost:${options.port}`,
      'webpack/hot/dev-server',
      './src/js/Main'
    ],
    
    output: {
      path: Path.join(__dirname, 'dist' ),
      filename: 'js/bundle.js'
    },

    plugins: [
      // environement variables
      new Webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(options.isProduction ? 'production' : 'development')
        }
      }),
      // html
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
      // CSS
      extractCSS,
      // SASS
      extractSASS,
      // Copy Assets
      new CopyWebpackPlugin([
            { from: Path.join(__dirname, 'src/img' ), to: Path.join(__dirname, 'dist/img' ) },
            { from: Path.join(__dirname, 'src/data' ), to: Path.join(__dirname, 'dist/data' ) },
        ], {
            ignore: [
                '*.txt',
                '.*'
            ],
            copyUnmodified: false
        })
    ],
    
    module: {
      loaders: [{
        test: /\.js$/,
        include: [ targetPath ],
        exclude: /(node_modules|bower_components)/,
        loader: CombineLoaders([
          {
            loader: 'ng-annotate-loader',
            query: {
              add: true
            }
          },
          {
            loader: 'babel-loader',
            query: {
              cacheDirectory: Path.join( __dirname, 'tmp' )
            }
          }
        ]),
      },
      // assets
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        include: [ targetPath ],
        loader: 'file-loader'
      }]
    }

  };

  if (options.isProduction) {

    webpackConfig.entry = ['./src/js/Main'];

  
    webpackConfig.plugins.push(
      new Webpack.optimize.OccurenceOrderPlugin(),
      new Webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      })
    );

    webpackConfig.module.loaders.push({
      test: /\.css$/,
      include: [ Path.resolve( __dirname, 'node_modules' )],
      loader: extractCSS.extract( ...CombineLoaders([
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
          query: {
            minimize: options.isProduction
          }
        }]).split( '!' ))
      },
      {
      test: /\.scss$/i,
      loader: extractSASS.extract(['css', 'sass'])
    });

  } else {

    webpackConfig.plugins.push(
      new Webpack.HotModuleReplacementPlugin()
    );

    webpackConfig.module.loaders.push({
      test: /\.css$/,
      include: [ Path.resolve( __dirname, 'node_modules' )],
      loader: extractCSS.extract( ...CombineLoaders([
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
          query: {
            minimize: options.isProduction
          }
        }]).split( '!' ))
      },
      {
        test: /\.scss$/i,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: /node_modules/
      });

    webpackConfig.devServer = {
      contentBase: './dist',
      hot: true,
      port: options.port,
      inline: true,
      progress: !true
    };
  }

  return webpackConfig;

}