// history在本地打包,打开dist文件为空白,起一个本地服务,看dist里的index,在服务器的环境都能看见,那我就起个服务给他
const express = require("express")
const app = express()
// 端口号
const port = 8081 
let history = require('connect-history-api-fallback')

//重定向到index.html
history({
    rewrites: [{
        from: /^\/libs\/.*$/,
        to: '/index.html'
    }]
});

app.use(history());

app.use(express.static('./dist'))

app.listen(port, () => {
    console.log('Listening at http://localhost:' + port)
})
