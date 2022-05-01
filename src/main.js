// @ts-check

const Koa = require('koa')
const Pug = require('koa-pug')
const path = require('path')
const route = require('koa-route')
const serve = require('koa-static')
const mount = require('koa-mount')
const websockify = require('koa-websocket')

// the magic happens right here
const app = websockify(new Koa())

app.use(mount('/public', serve('src/public')))

// @ts-ignore
// eslint-disable-next-line no-new
new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app,
})

app.use(async (ctx) => {
  await ctx.render('main')
})

app.ws.use(
  route.all('/ws', (ctx) => {
    ctx.websocket.send('Hello World')
    ctx.websocket.on('message', (message) => {
      console.log(message)
    })
  })
)

app.listen(5005)
