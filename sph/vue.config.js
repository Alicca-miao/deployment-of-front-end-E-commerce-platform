const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer:{
    proxy: {
      '/dev': {// 匹配所有以 '/dev'开头的请求路径
          target: 'http://sph-h5-api.atguigu.cn',// 代理目标的基础路径
          changeOrigin: true,
          pathRewrite: {'^/dev': ''}
      },
    }
  }
})
