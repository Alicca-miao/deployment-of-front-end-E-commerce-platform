// 引入express
const express = require('express')

// 配置端口号
const PORT = 8088

//新增，引入
const history = require('connect-history-api-fallback');
//新增，解决代理请求
const { createProxyMiddleware } = require('http-proxy-middleware');


// 创建一个app服务实例
const app = express()

//新增，使用中间件
//app.use(history())
app.use(history({
	verbose:false,

	rewrites:[
		//不然这样写就是登录刷新后不处理
		//{ from: /^\/login.*$/, to: (context) => context.parsedUrl.path },
	]
}))
//新增，又是一个中间件，请求代理那个
app.use(
  '/dev',
  createProxyMiddleware({
    target: 'http://sph-h5-api.atguigu.cn',
    changeOrigin: true,
	 pathRewrite: {'^/dev': ''}
  }),
);


// 配置静态资源
app.use(express.static(__dirname + '/public'))

// 绑定端口监听
app.listen(PORT, () => {
	console.log(`本地服务器启动成功，http://localhost:${PORT}`)
})