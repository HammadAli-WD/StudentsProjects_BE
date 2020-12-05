const express = require("express")
const cors = require("cors")
const { join } = require("path")
const listEndpoints = require("express-list-endpoints")
const mongoose = require("mongoose")

//const booksRouter = require("./services/books")
const studentRouter = require("./services/student")
const projectsRouter = require("./services/projects")

const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandler")

const server = express()

const port = process.env.PORT || 3000

const staticFolderPath = join(__dirname, "../public")
server.use(express.static(staticFolderPath))
server.use(express.json())

server.use(cors())

server.use("/projects", projectsRouter)
server.use("/student", studentRouter)

// ERROR HANDLERS MIDDLEWARES

server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndpoints(server))

mongoose
  .connect("mongodb://localhost:27017/studentRecords", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch((err) => console.log(err))