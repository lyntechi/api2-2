const express = require("express");
const server = express();

const postRouter = require("../posts/postRouter")
server.use(express.json())


server.get('/', (req, res) => {
  res.send({api: " server is up and running"})
})

server.use("/api/posts", postRouter)

module.exports = server;