const PugPlugin = require('pug-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const yaml = require('js-yaml');
const fs = require('fs');

const { marked } = require("marked");
const slugify = require("@sindresorhus/slugify");


const dayjs = require("dayjs");
const advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)

const { DefinePlugin } = require('webpack');

module.exports = {
  devServer: {
    hot: false
  },
  entry: {
    index: './src/main.pug',
    registration: './src/registration.pug',
    privacy: './src/privacy.pug',
    ticket: './src/ticket.pug',
    invoice: './src/invoice.pug',
    coc: './src/coc.pug'
  },
  output: {
    filename: '[name].[contenthash].js',
  },
  plugins: [
    new DefinePlugin({ __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: false }),
    new PugPlugin({
      extractCss: {
        filename: 'assets/css/[name].[contenthash:8].css',
      },
    }),
    new CopyPlugin({
      patterns: [
        "CNAME",
        "robots.txt"
      ],
      options: {
        concurrency: 100,
      },
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["css-loader", "sass-loader", "postcss-loader"],
      },
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
        options: {
          data: {
            dayjs,
            marked,
            slugify,
            event: yaml.load(fs.readFileSync('./src/event.yml', 'utf8'))
          }
        }
      },
      {
        test: /\.(png|jpe?g|webp)$/,
        include: /src[\\/]images/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name]-[ext]',
        },
      },
      {
        test: /\.svg$/,
        type: 'asset/inline',
      },
      {
        test: /\.(png|jpg)$/i,
        include: /src[\\/]images[\\/]speakers/,
        type: 'asset/resource',
        use: [
          {
            loader: 'responsive-loader',
            options: {
              adapter: require('responsive-loader/jimp'),
              sizes: [224],
              name: 'assets/img/[name]-[width]w.[ext]',
            },
          },
        ],
      }
    ]
  }
};