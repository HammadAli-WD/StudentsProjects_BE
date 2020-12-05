const express = require("express");
const q2m = require("query-to-mongo");
const { studentModel } = require("../models/studentModel");
const projectModel = require("../models/projectModel");
const studentsRouter = express.Router()

studentsRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query)
    const students = await studentModel.find(query.criteria, query.options.fields)

      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort)
    res.send({
      totalNumberOfStudents: students.length,
      data: students,

    })
  } catch (error) {
    next(error)
  }
})

studentsRouter.get("/:id/projects", async (req, res, next) => {
  try {
    const query = q2m(req.query)
    const project = await projectModel.find({ studentid: req.params.id })
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort)
    if (project) {

      res.send({
        totalNumberOfProjects: project.length,
        data: project
      })
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading project list a problem occurred!")
  }
})

studentsRouter.post("/:id/projects", async (req, res, next) => {
  try {
    const newproject = new projectModel(req.body)
    const { _id } = await newproject.save()
    console.log(newproject)
    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

studentsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const student = await studentModel.findById(id)
    if (student) {
      res.send(student)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading students list a problem occurred!")
  }
})

studentsRouter.post("/", async (req, res, next) => {
  try {
    const newstudent = new studentModel(req.body)
    const { _id } = await newstudent.save()
    console.log(newstudent)
    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

studentsRouter.put("/:id", async (req, res, next) => {
  try {
    const student = await studentModel.findByIdAndUpdate(req.params.id, req.body)
    console.log(student)
    if (student) {
      res.send("Ok")
    } else {
      const error = new Error(`student with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

studentsRouter.delete("/:id", async (req, res, next) => {
  try {
    const student = await studentModel.findByIdAndDelete(req.params.id)
    if (student) {
      res.send("Deleted")
    } else {
      const error = new Error(`student with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = studentsRouter