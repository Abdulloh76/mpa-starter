const path = require('path')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const TerserPlugin = require('terser-webpack-plugin')

const buildPath = path.resolve(__dirname, 'dist')


const ENV = process.env.npm_lifecycle_event;
const isDev = ENV === 'dev';
const isProd = ENV === 'build';

function setDevTool() {
  if (isDev) {
    return 'source-map';
  }
  return 'none';
}

function setDMode() {
  if (isProd) {
    return 'production';
  }
  return 'development';
}

module.exports = {
  mode: setDMode(),
  devtool: setDevTool(),
  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: {
    shared: './src/js/sharedModules/share.js',
    home: './src/js/home.js',
    contacts: './src/js/contacts.js'
  },

  // how to write the compiled files to disk
  // https://webpack.js.org/concepts/output/
  output: {
    filename: '[name].[hash:20].js',
    path: buildPath
  },

  // https://webpack.js.org/concepts/loaders/
  module: {
    rules: [
      // {
      //   test: /\.js$/i,
      //   exclude: /node_modules/,
      //   loader: 'babel-loader',
      //   options: {
      //     presets: ['@babel/preset-env']
      //   }
      // },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/imgs',
              name: '[name].[ext]',
              esModule: false,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              mozjpeg: {
                progressive: true,
                quality: 75,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
                optimizationLevel: 1,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
      // ????
      // {
      //   // Load all images as base64 encoding if they are smaller than 4097 bytes
      //   test: /\.(png|jpe?g|gif|svg)$/i,
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         name: '[name].[hash:20].[ext]',
      //         esModule: false,
      //         limit: 4096
      //       }
      //     }
      //   ]
      // }
    ]
  },

  // https://webpack.js.org/concepts/plugins/
  plugins: [
    new CleanWebpackPlugin(), // cleans output.path by default
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './src/pages/contacts/index.html',
      filename: './contacts/index.html',
      inject: 'body',
      chunks: ['contacts', 'share'],
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/home/index.html',
      filename: './home/index.html',
      inject: 'body',
      chunks: ['home', 'share'],
    })
  ],

  // https://webpack.js.org/configuration/optimization/
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin({
  //       cache: true,
  //       parallel: true,
  //       sourceMap: true
  //     }),
  //     new OptimizeCssAssetsPlugin({})
  //   ]
  // }
}
