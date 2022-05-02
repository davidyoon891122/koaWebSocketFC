// @ts-check

require('dotenv').config()

const { MongoClient } = require('mongodb')

const uri = `mongodb+srv://davidyoon:${process.env.MONGO_PASSWORD}@cluster0.6ntxk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

module.exports = client
