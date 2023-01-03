const PugPlugin = require('pug-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const yaml = require('js-yaml');
const fs = require('fs');

const { marked } = require("marked");

const dayjs = require("dayjs");
const advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)


module.exports = {
  devServer: {
    hot: false
  },
  entry: {
    index: './src/main.pug',
    coc: './src/coc.pug'
  },
  plugins: [
    new PugPlugin({
      extractCss: {
        filename: 'assets/css/[name].[contenthash:8].css',
      },
    }),
    new CopyPlugin({
      patterns: [
        "CNAME",
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
            event: yaml.load(fs.readFileSync('./src/event.yml', 'utf8'))
          }
        }
      },
      {
        test: /\.(png|svg|jpe?g|webp)$/,
        include: /src[\\/]images/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name]-[hash:8][ext]',
        },
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
              name: 'assets/img/[name]-[hash:8]-[width]w.[ext]',
            },
          },
        ],
      }
    ]
  }
};