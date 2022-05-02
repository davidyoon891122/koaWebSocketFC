// @ts-check

const Koa = require('koa')
const Pug = require('koa-pug')
const path = require('path')
const route = require('koa-route')
const serve = require('koa-static')
const mount = require('koa-mount')
const websockify = require('koa-websocket')
const mongoClient = require('./mongo')

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

/* eslint-disable-next-line no-underscore-dangle */
const _client = mongoClient.connect()

async function getChatsCollection() {
  const client = await _client
  return client.db('chat').collection('chats')
}

/**
 * @typedef Chat
 * @property {string} nickname
 * @property {string} message
 */

app.ws.use(
  route.all('/ws', async (ctx) => {
    const chatsCollection = await getChatsCollection()
    const chatsCursor = chatsCollection.find(
      {},
      {
        sort: {
          createAt: 1,
        },
      }
    )

    const chats = await chatsCursor.toArray()
    ctx.websocket.send(
      JSON.stringify({
        type: 'sync',
        payload: {
          chats,
        },
      })
    )

    ctx.websocket.on('message', async (data) => {
      /** @type {Chat} */
      const chat = JSON.parse(data.toString())
      chatsCollection.insertOne({
        ...chat,
        createdAt: new Date(),
      })

      const { nickname, message } = chat
      console.log(nickname, message)

      const { server } = app.ws

      if (!server) {
        return
      }

      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'chat',
            payload: {
              message,
              nickname,
            },
          })
        )
      })
    })
  })
)

app.listen(5005)
