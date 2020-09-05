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
    outputDir: 'dist',
    lintOnSave: false,  // 关闭eslint
    // productionSourceMap:true,  // 生产环境下css 分离文件
    configureWebpack: {  // 覆盖webpack默认配置的都在这里
        resolve: {   // 配置解析别名
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@h': path.resolve(__dirname, './src/assets/hotcss'),
                '@s': path.resolve(__dirname, './src/assets/style'),
                '@i': path.resolve(__dirname, './src/assets/images'),
            }
        }
    }
}