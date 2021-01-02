const express = require("express");
const q2m = require("query-to-mongo");
const { studentModel } = require("../models/studentModel");
const projectModel = require("../models/projectModel");
const studentsRouter = express.Router()
const multer = require('multer');
const fs = require("fs-extra");
const path = require("path");
const upload = multer({});

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, 'uploads/')
  }
});
//const upload = multer({ storage: storage });
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

studentsRouter.post("/", upload.single("image"),
  async (req, res, next) => {
    try {
      if (req.file) {
        const imagesPath = path.join(__dirname, "/images");
        await fs.writeFile(
          path.join(
            imagesPath,
            req.body.surname + "." + req.file.originalname.split(".").pop()
          ),
          req.file.buffer
        );
        var obj = {
          ...req.body,
          image: fs.readFileSync(
            path.join(
              __dirname +
              "/images/" +
              req.body.surname +
              "." +
              req.file.originalname.split(".").pop()
            )
          ),
        };
      } else {
        var obj = {
          ...req.body,
          image: fs.readFileSync(path.join(__dirname, "./images/default.jpg")),
        };
      }

      const newProfile = new studentModel(obj);
      await newProfile.save();
      res.send("ok");
      /*
        const newProfile = {
            ...req.body,
            "image": "https://i.dlpng.com/static/png/5326621-pingu-png-images-png-cliparts-free-download-on-seekpng-pingu-png-300_255_preview.png"
        }
        const rawNewProfile = new studentModel(newProfile)
        const { id } = await rawNewProfile.save()
        res.status(201).send(id)
        */
    } catch (error) {
      next(error);
    }
  }
);

studentsRouter.route('/:id/uploadImage')
  .post(upload.single('image'), function (req, res) {
    var new_img = new studentModel;
    new_img.img.data = fs.readFileSync(req.file.path)
    new_img.img.contentType = 'image/jpeg';  // or 'image/png'
    new_img.save();
    res.json({ message: 'New image added to the db!' });
  }).get(function (req, res) {
    Img.findOne({}, 'img createdAt', function (err, img) {
      if (err)
        res.send(err);
      res.contentType('json');
      res.send(img);
    }).sort({ createdAt: 'desc' });
  });

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