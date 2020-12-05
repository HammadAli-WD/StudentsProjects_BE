const express = require("express")
const q2m = require("query-to-mongo")
const projectModel = require("../models/projectModel")
const projectRouter = express.Router()
const studentModel = require("../models/studentModel")

projectRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query)
    const projects = await projectModel.find(query.criteria, query.options.fields)
      .populate("studentid")
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort)
    res.send({
      totalNumberOfprojects: projects.length,
      data: projects,

    })
  } catch (error) {
    next(error)
  }
})

/* projectRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const project = await projectModel.findById(id)
    if (project) {
      res.send(project)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading projects list a problem occurred!")
  }
}) */

projectRouter.post("/", async (req, res, next) => {
  try {
    const newProject = await new projectModel(req.body)
    const { _id } = await newProject.save()
    console.log(newProject)
    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

projectRouter.put("/:id", async (req, res, next) => {
  try {
    const project = await projectModel.findByIdAndUpdate(req.params.id, req.body)
    console.log(project)
    if (project) {
      res.send("Ok")
    } else {
      const error = new Error(`project with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

projectRouter.delete("/:id", async (req, res, next) => {
  try {
    const project = await projectModel.findByIdAndDelete(req.params.id)
    if (project) {
      res.send("Deleted")
    } else {
      const error = new Error(`project with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = projectRouter