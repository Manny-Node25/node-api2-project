const express = require("express");

const server = express();
server.use(express.json());

const postsRouter = require("./router")


server.get("/", (req, res) => {
    res.send(`<p>Hola Amiga</p`);
  });

server.use("/api/posts", postsRouter)

module.exports = server