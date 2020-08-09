/* eslint-disable import/no-extraneous-dependencies */
// const dotenv = require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
// const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const TerserPlugin = require('terser-webpack-plugin');


const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PROD_BUILD = NODE_ENV === 'production' || NODE_ENV === 'staging';
// const IS_DEV = !IS_PROD_BUILD;
const ROOT_DIR = path.resolve(__dirname, '../');
const SRC_DIR = path.resolve(ROOT_DIR, 'src');
const dotEnvPlugin = new DotenvPlugin({
  path: path.resolve(ROOT_DIR, `.env.${NODE_ENV}`)
});
const commonPlugins = [
  new webpack.NamedModulesPlugin(),
  new BundleAnalyzerPlugin(),

  /* For optimizing lodash */
  new LodashModuleReplacementPlugin({
    shorthands: true, // Should be able to use _.map(arr, 'obj')
    collections: true,
    paths: true
  }),

  /* For webpack build progress % */
  new ProgressBarPlugin(),

  /* Define globals */
  new webpack.DefinePlugin({
    'NODE_ENV': IS_PROD_BUILD ? '"production"' : '"development"'
  }),

  new HtmlWebpackPlugin({
    template: path.resolve(ROOT_DIR, 'public/index.html'),
    templateParameters: {
      env: IS_PROD_BUILD ? 'production' : 'development'
    },
    minify: true
  }),
  dotEnvPlugin
];

const devPlugins = [
  ...commonPlugins,
];

const prodPlugins = [
  ...commonPlugins,
  /* Clear dist folder before a new build */
  new CleanPlugin(),

  // new BundleAnalyzerPlugin(),

  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: '[name].[hash].css',
    chunkFilename: '[id].[hash].css',
  }),

  new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),

  // new SentryWebpackPlugin({
  //   include: '.',
  //   ignoreFile: '.sentrycliignore',
  //   ignore: ['node_modules', 'webpack.config.js'],
  //   configFile: path.resolve(ROOT_DIR, '.sentry.properties')
  // })
];

module.exports = function webpackConfig() {
  const config = {
    mode: IS_PROD_BUILD ? 'production' : 'development',
    devtool: 'source-map',
    context: ROOT_DIR,
    entry: {
      main: [
        path.resolve(SRC_DIR, 'index.js')
      ]
    },
    output: {
      publicPath: '/',
      path: path.resolve(ROOT_DIR, 'build'),
      filename: IS_PROD_BUILD ? '[name].[chunkhash].js' : '[name].js',
      chunkFilename: IS_PROD_BUILD ? 'chunks/[id].[chunkhash].js' : 'chunks/[id].js',
    },
    /* Disabling logs from plugins like mini css extract */
    stats: {
      children: false,
      chunks: false,
      assets: false,
    },
    devServer: {
      contentBase: path.resolve(ROOT_DIR, 'build'),
      hot: true,
      publicPath: '/',
      historyApiFallback: true,
      host: '0.0.0.0',
      port: 4000,
    },
    performance: {
      hints: false
    },
    optimization: {},
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            /* Babel loader to convert next gen JS syntax to a more browser compatible syntax */
            {
              loader: 'babel-loader?cacheDirectory'
            },
            {
              loader: 'react-hot-loader/webpack'
            }
            /* Eslint to enforce coding conventions */
            // {
            //   loader: 'eslint-loader',
            //   options: {
            //     // Don't show warnings in webpack output
            //     quiet: true,
            //     failOnError: false,
            //     emitError: false
            //   }
            // }
          ]
        },
        {
          test: /\.json$/,
          type: 'javascript/auto',
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
        {
          test: /\.css$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: IS_PROD_BUILD ? MiniCssExtractPlugin.loader : 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                localIdentName: IS_PROD_BUILD ? '[hash:base64:5]' : '[folder]-[local]__[hash:base64:5]',
                modules: true,
                sourceMap: true,
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  // require('postcss-import')({ root: path.resolve(SRC_DIR) }),
                  /* To enable css nesting like sass */
                  require('postcss-nested'),
                  /* Enable variables inside media queries */
                  require('postcss-custom-media')({
                    importFrom: [path.resolve(SRC_DIR, 'theme/variables/media.css')]
                  }),
                  /* for color modification functions like lighten darken etc. */
                  require('postcss-color-function'),
                  /* automated vendor prefixing */
                  require('autoprefixer'),
                ]
              }
            },
          ]
        },
        {
          test: /\.css$/,
          include: /(node_modules|bower_components)/,
          use: [
            {
              loader: IS_PROD_BUILD ? MiniCssExtractPlugin.loader : 'style-loader',
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          /* Fonts and Images */
          test: /\.(png|ico|jpg|ttf|eot|otf|woff(2)?)(\?[a-z0-9]+)?$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: (url, resourcePath, context) => {
              if (/favicon\.ico/.test(resourcePath)) {
                return `${url}`;
              }
              return `${resourcePath.split('/public/')[1]}`;
            }
          },
        },
        {
          test: /\.svg$/,
          include: [
            path.resolve(ROOT_DIR, 'public/assets/icons')
          ],
          issuer: {
            test: /\.js?$/
          },
          use: [{
            loader: '@svgr/webpack',
            options: {
              icon: true,
            }
          }, 'url-loader'],
        },
        {
          test: /\.svg$/,
          issuer: {
            test: /\.js?$/
          },
          use: ['@svgr/webpack', 'url-loader'],
        },
        {
          test: /\.svg$/,
          use: ['url-loader'],
        }
      ]
    },
    resolve: {
      modules: [
        SRC_DIR,
        'node_modules'
      ],
      extensions: ['.js', '.jsx', '.json'],
      alias: {
        assets: path.resolve(ROOT_DIR, 'public/assets'),
        constants: path.resolve(SRC_DIR, 'constants'),
      }
    },
    plugins: IS_PROD_BUILD ? prodPlugins : devPlugins
  };

  if (IS_PROD_BUILD) {
    config.optimization.minimizer = [
      /* Ugligy JS */
      new TerserPlugin({
        parallel: true,
      }),
      /* Minify CSS */
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          safe: true
        }
      })
    ];
  }

  return config;
};
