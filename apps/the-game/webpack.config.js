const webpack = require('webpack');
const path = require('path');
const packageJson = require('./package.json');

// variables
const isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';
// const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './build');
const PnpWebpackPlugin = require(`pnp-webpack-plugin`);

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: ['react-hot-loader/patch', './src/main.tsx'],
  },
  output: {
    path: outPath,
    filename: isProduction ? '[contenthash].js' : '[hash].js',
    chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].[hash].js',
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    plugins: [PnpWebpackPlugin],
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['react-hot-loader/webpack', 'babel-loader'],
      },
      {
        test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2|png)$/,
        use: 'file-loader',
      },
    ],
  },
  /*optimization: {
    splitChunks: {
      name: true,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          filename: isProduction ? 'vendor.[contenthash].js' : 'vendor.[hash].js',
          priority: -10
        }
      }
    },
    runtimeChunk: true
  },*/
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false,
    }),
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/assets/index.html',
      meta: {
        title: packageJson.name,
        description: packageJson.description,
        keywords: Array.isArray(packageJson.keywords) ? packageJson.keywords.join(',') : undefined,
      },
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  devtool: 'inline-source-map',
};
