# 网站部署：
## 最大两个问题：
**（1）不能正常发送ajax请求了
（2）原地刷新后页面404**
已云部署到：49.235.165.241
![截屏2024-06-04 下午3 09 26](https://github.com/Alicca-miao/deployment-of-front-end-E-commerce-platform/assets/171432857/e3bf3544-7a43-4c83-9570-b9f6caa02b3e)



### 1. 本地部署

（1）第一步：将vue文件打包
```powershell
npm run build
```
>开发用的脚手架是一个微型服务器
打包后不再借助脚手架需要部署到服务器运行

- 随机点击任何一个需要ajax获取数据的部分
*emphasized text按住control键点击categorylist，转到定义然后按住control键点击request，其实就是axios实例*

问题：npm i nodemon后还是nodemon server.js打不开
zsh: command not found: nodemon
解决：npx nodemon server.js

然后把打包后的文件dist里的全部都复制黏贴到server的public下，重新启动服务器（nodemon自动重启）

浏览器给8080发送
http://localhost:8080/api/product/getBaseCategoryList
代理把请求发送给
http://gmall-h5-api.atguigu.cn/api/product/getBaseCategoryList

为何404原因：
打开8088瞬间，快速加载整个网页，靠前端的js完成一次前端路由跳转，来到/home
而刷新时浏览器误以为/home是后端路由，然后问服务器是否有后端路由。其实如果有有后端路由的话,后端路由这样写：
```powershell
app.get('/home',(req,res)=>{
res.send('ok')
})
```

**解决问题1：刷新页面404**
- 第一种解决将history模式改为hash模式
`router`配置是history模式，改成hash重新 `npm run build `生成新的dist，再把dist内容放到server的public下
原因: /login是不带给服务器的,触发不了后台路由匹配，所以刷新404问题解决了
缺点：不美观，慎用

（地址栏中发出去的请求都是get请求？）

- 第二种解决：`app.get('*',(req,res)=>{
res.sendFile(__dirname+'/public/index.html')
//sendfile是绝对的路径，把index.html返回给浏览器里面的js就能工作了，证明前端路由能奏效了
})`

  >需求：注册可以刷新后还是注册，但是登录不想刷新后还是登录，想刷新后啥也不匹配，但是这样注册也打不开

   缺点：不灵活

- 第三种解决：引入connect-history-api-fallback 专门处理前端路由
https://www.npmjs.com/package/connect-history-api-fallback

    ```powershell
    app.use(history({
    	verbose:false,
    
    	rewrites:[
    		#这样写就是登录刷新后不处理
    		#{ from: /^\/login.*$/, to: (context) => context.parsedUrl.path },
    	]
    }))
    ```

打包之后没有脚手架了，有脚手架时候他给咱提供代理服务器
然后项目就发出请求：http://localhost:8080/api/product/getBaseCategoryList

写/dev就是想识别当前所处的主机名，协议名，主机名端口号（在network里的fetch/xhr里header看到）

现在就是想8088也能转发请求就好了
- 最佳方法：引入http-proxy-middleware库
脚手架本来处理代理

https://www.npmjs.com/package/http-proxy-middleware

```powershell
app.use(
  '/dev',
  createProxyMiddleware({
    target: 'http://sph-h5-api.atguigu.cn',
    changeOrigin: true,
	 pathRewrite: {'^/dev': ''}
  }),
);
```
效果：获取本地ip：ifconfig | grep "inet "
192.168.31.248
手机也能访问：

<img width="409" alt="截屏2024-06-03 下午11 20 07" src="https://github.com/Alicca-miao/deployment-of-front-end-E-commerce-platform/assets/171432857/1b35e7ad-4563-40ec-a3da-efa2b7e51ced">




----------------------


### 2.nginx 部署（mac）

**不用homebrew安装配置并使用nginx：**

1.安装nginx： 
`curl -O http://nginx.org/download/nginx-1.21.6.tar.gz`
2. 解压缩：`tar -zxvf nginx-1.21.6.tar.gz`
3. 或许缺失这个：`xcode-select --install`
4. `cd nginx-1.21.6`
`./configure`
`make`
`sudo make install`
出错：缺少PCRE library
5. 直接安装PCRE library库：
`curl -O https://ftp.pcre.org/pub/pcre/pcre-8.44.tar.gz`
7. `cd pcre2-10.40`
8. `./configure
make
sudo make install`

此时安装的nginx和pcre的目录：

`/Users/yumiaoli/nginx-1.21.6/pcre2-10.40`

8.
`./configure --with-pcre=/Users/yumiaoli/nginx-1.21.6/pcre2-10.40`
`make
sudo make install`

部分输出：
`test -f '/usr/local/nginx/conf/fastcgi_params' \
		|| cp conf/fastcgi_params '/usr/local/nginx/conf'
cp conf/fastcgi_params \
		'/usr/local/nginx/conf/fastcgi_params.default'
test -f '/usr/local/nginx/conf/fastcgi.conf' \
		|| cp conf/fastcgi.conf '/usr/local/nginx/conf'
cp conf/fastcgi.conf '/usr/local/nginx/conf/fastcgi.conf.default'
test -f '/usr/local/nginx/conf/uwsgi_params' \
		|| cp conf/uwsgi_params '/usr/local/nginx/conf'
cp conf/uwsgi_params \
		'/usr/local/nginx/conf/uwsgi_params.default'
test -f '/usr/local/nginx/conf/scgi_params' \
		|| cp conf/scgi_params '/usr/local/nginx/conf'
cp conf/scgi_params \
		'/usr/local/nginx/conf/scgi_params.default'
test -f '/usr/local/nginx/conf/nginx.conf' \
		|| cp conf/nginx.conf '/usr/local/nginx/conf/nginx.conf'
cp conf/nginx.conf '/usr/local/nginx/conf/nginx.conf.default'
test -d '/usr/local/nginx/logs' \
		|| mkdir -p '/usr/local/nginx/logs'
test -d '/usr/local/nginx/logs' \
		|| mkdir -p '/usr/local/nginx/logs'
test -d '/usr/local/nginx/html' \
		|| cp -R html '/usr/local/nginx'
test -d '/usr/local/nginx/logs' \
		|| mkdir -p '/usr/local/nginx/logs'`

从提供的输出来看，**Nginx 已经成功安装到 /usr/local/nginx 目录**

10.检查 Nginx 是否正确安装以及版本信息：
`/usr/local/nginx/sbin/nginx -v`

输出：nginx version: nginx/1.21.6

**启动 Nginx：**
`sudo /usr/local/nginx/sbin/nginx`
出现问题：nginx: [emerg] bind() to 0.0.0.0:80 failed (48: Address already in use)

**配置nginx：**
默认的 Nginx 配置文件位于 `/usr/local/nginx/conf/nginx.conf`

我将端口修改为8099,每次修改配置文件后，你需要**重启 Nginx** 来应用更改：
`sudo /usr/local/nginx/sbin/nginx -s reload`
出错：[error] open() "/usr/local/nginx/logs/nginx.pid" failed (2: No such file or directory)
原因：没开启nginx...
`sudo /usr/local/nginx/sbin/nginx`
`sudo /usr/local/nginx/sbin/nginx -s reload`
**停止nginx：**
`sudo /usr/local/nginx/sbin/nginx -s stop`

然后寻找mac里类似于window里d盘的位置：
`cd /Volumes/Macintosh\ HD`
我将dist放到了共享里：
`/Users/Shared/dist`

打开localhost:8099到nginx的html里发现了显示的页面**部署网页：**
1修改nginx.config里的server里的location /
里的root 后的一项为地址，我修改的是在`/Users/Shared/dist`（
原本那一项为html文件）

重启nginx，找到进程管理器结束进程
重新运行exe

然后又出现了开头的两个问题，404和代理请求问题

解决办法：
在`location / `里添加一句
`try_files $uri $uri/ /index.html; `
解决刷新404
**#无法匹配资源时候，把index.html给你**
然后重启nginx
（截止目前为止只把nginx作为静态资源服务器,解决404问题）

下一步让他可以转发请求
在location /下再加一个
```powershell
location /dev/ {
  # 设置代理目标
  proxy_pass http://sph-h5-api.atguigu.cn/;
}
```
如果你请求时候，请求路径包含/dev，那么就转发给后面的网站
细节：怎么控制去不去除dev，通过俩斜杠
然后发现还是出错，**解决方案**：
在设置，隐私和安全里的第一项 清除浏览数据里的高级里清楚数据（默认4个勾）
这样nginx就可以配置代理转发请求
【上述为nginx服务器部署】

>优势：低内存消耗？反向代理和负载均衡，接受客户端请求转发给后端服务器

### 3.云服务器部署
来自：腾讯云的轻量级应用服务器
需要：windows系统里的
- xshell
- xftp

新建centos7.6的轻量应用服务器，xftp和xshell都首先点击新建，输入主机即ip地址后连接，然后输入用户名和密码连接
将dist文件通过xftp传入在/var目录下，不要放root目录因为要访问权限
在/var下新建立文件夹miao然后将dist下的所有文件都复制黏贴过去

这样服务器已经拥有了前端资源，还是要nginx把他跑起来
进入内置管理器yum：
在xshell下连接好服务器49.235.165.241后
`yum install nginx`

到/etc/nginx 如果有这个目录就安装成功了

![WechatIMG959](https://github.com/Alicca-miao/deployment-of-front-end-E-commerce-platform/assets/171432857/fd5d9864-bd70-48c3-a4e8-d6d9249990b1)




将原本的nginx.config修改后
`service nginx start`



























