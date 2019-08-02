'use strict';

var path = require('path');

var config = {
  projectName: 'webview-h5',
  date: '2018-8-5',
  designWidth: 750,
  deviceRatio: {
    '640': 1.17,
    '750': 1,
    '828': 0.905
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: {
    babel: {
      sourceMap: true,
      presets: [
        [
          'env',
          {
            modules: false
          }
        ]
      ],
      plugins: [ 'transform-decorators-legacy', 'transform-class-properties', 'transform-object-rest-spread' ]
    }
  },
  defineConstants: {},
  alias: {
    '@actions': path.resolve(__dirname, '..', 'src/actions'),
    '@components': path.resolve(__dirname, '..', 'src/components'),
    '@styles': path.resolve(__dirname, '..', 'src/styles'),
    // '@raven': path.resolve(__dirname, '..', 'src/core/utils/raven/src/singleton.js'),
    '@BOZ': path.resolve(__dirname, '..', 'src/store/api.js'),
    '@core': path.resolve(__dirname, '..', 'src/core'),
    '@request': path.resolve(__dirname, '..', 'src/core/utils/request.js'),
    '@images': path.resolve(__dirname, '..', 'src/images')
  },
  copy: {
    patterns: [],
    options: {}
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: [ 'last 3 versions', 'Android >= 4.1', 'ios >= 8' ]
          }
        },
        pxtransform: {
          enable: true,
          config: {}
        },
        url: {
          enable: true,
          config: {
            limit: 10240 // 设定转换尺寸上限
          }
        },
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    }
  },
  h5: {
    esnextModules: ['taro-ui'],
    publicPath: '/',
    staticDirectory: 'static',
    router: {
      basename: '/webview-h5',
      mode: 'browser'
    },
    devServer: {
      host: "127.0.0.1",
      port: 8081
    },
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: [ 'last 3 versions', 'Android >= 4.1', 'ios >= 8' ]
          }
        },
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    }
  }
};

module.exports = function (merge) {
  return process.env.NODE_ENV === 'production' ? merge({}, config, require("./prod.js")): merge({}, config, require("./dev.js"))
};
