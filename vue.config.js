const path = require('path');
module.exports = {
    publicPath: '/',
    // 配置图标
    pwa: {
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico'
        }
    },
    //生产环境打包的目录
    outputDir: 'dist',
    // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    assetsDir: "static",
    // 指定生成的 index.html 的输出路径
    indexPath: "index.html",
    // 
    lintOnSave: false,  // 关闭eslint
    productionSourceMap: false,  // 生产环境下css 分离文件

    // css配置

    css: {
        extract: true,
        sourceMap: false,

    },
    configureWebpack: {  // 覆盖webpack默认配置的都在这里
        resolve: {   // 配置解析别名
            alias: {
                '@': path.resolve(__dirname, './src/components'),
            }
        }
    }
}