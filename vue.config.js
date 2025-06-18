'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const name = defaultSettings.title // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// Node.js v18+ 兼容配置
process.env.NODE_OPTIONS = process.env.NODE_OPTIONS || '--openssl-legacy-provider'

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: port,
        open: false,
        // 新版本 webpack-dev-server 配置
        client: {
            overlay: {
                warnings: false,
                errors: false
            }
        },
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:9901/love/admin',
                // target: 'http://0.0.0.0:9901/love/admin',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: name,
        devtool: process.env.NODE_ENV === 'development' ? 'eval-cheap-module-source-map' : 'source-map',
        resolve: {
            alias: {
                '@': resolve('src')
            },
            // webpack 5 polyfill 配置 - 条件引用
            fallback: (() => {
                try {
                    return {
                        "path": require.resolve("path-browserify"),
                        "os": require.resolve("os-browserify/browser"),
                        "crypto": false
                    }
                } catch (e) {
                    // 如果polyfill包不存在，使用默认配置
                    return {
                        "path": false,
                        "os": false,
                        "crypto": false
                    }
                }
            })()
        },
        // Node.js v18+ 优化配置
        optimization: {
            usedExports: true,
            sideEffects: false,
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    // 分离第三方库
                    vendor: {
                        name: 'chunk-vendors',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: 'initial'
                    },
                    // 分离Element Plus
                    elementPlus: {
                        name: 'chunk-elementPlus',
                        priority: 20,
                        test: /[\\/]node_modules[\\/]_?element-plus(.*)/
                    },
                    // 分离Vue相关
                    vue: {
                        name: 'chunk-vue',
                        test: /[\\/]node_modules[\\/](vue|vue-router|pinia)/,
                        priority: 30,
                        chunks: 'all'
                    }
                }
            }
        }
    },
    chainWebpack(config) {
        config.plugins.delete('preload') // TODO: need test
        config.plugins.delete('prefetch') // TODO: need test

        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        // set preserveWhitespace
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                // Vue3 兼容性配置
                if (!options.compilerOptions) {
                    options.compilerOptions = {}
                }
                options.compilerOptions.preserveWhitespace = true
                return options
            })
            .end()

        // 开发环境配置优化
        config
            .when(process.env.NODE_ENV === 'development',
                config => {
                    config.devtool('eval-cheap-module-source-map')
                    // 开发环境性能优化
                    config.cache(true)
                }
            )

        // 生产环境配置优化
        config
            .when(process.env.NODE_ENV !== 'development',
                config => {
                    // 使用现代的 html-webpack-plugin 配置
                    config
                        .plugin('html')
                        .tap(args => {
                            args[0].minify = {
                                removeComments: true,
                                collapseWhitespace: true,
                                removeAttributeQuotes: true
                            }
                            // 内联小的 runtime chunk
                            args[0].inlineSource = /runtime\..+\.js$/
                            return args
                        })
                    
                    config
                        .optimization.splitChunks({
                            chunks: 'all',
                            cacheGroups: {
                                libs: {
                                    name: 'chunk-libs',
                                    test: /[\\/]node_modules[\\/]/,
                                    priority: 10,
                                    chunks: 'initial' // only package third parties that are initially dependent
                                },
                                elementUI: {
                                    name: 'chunk-elementPlus', // 将elementPlus分成一个包
                                    priority: 20, // 重量需要大于libs和app，否则会被打包到libs或app中
                                    test: /[\\/]node_modules[\\/]_?element-plus(.*)/ // 为了适应cnpm
                                },
                                commons: {
                                    name: 'chunk-commons',
                                    test: resolve('src/components'), // can customize your rules
                                    minChunks: 3, //  minimum common number
                                    priority: 5,
                                    reuseExistingChunk: true
                                }
                            }
                        })
                    config.optimization.runtimeChunk('single')
                }
            )
    }
}
