var Koa = require('koa');
const router = require('./router')

var app = new Koa();


app.use(router.routes()).use(router.allowedMethods());


app.listen(3000, function () {
    console.log('Server running on https://localhost:3000')
});
