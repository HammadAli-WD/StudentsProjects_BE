const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const v = require("validator")


const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
    /* validate : {
      validator: async (name) => {
        if (!v.isEmpty(value)) {
          throw new Error("Please enter name")
          console.log('name Empty');
      } else if (!v.matches(name, '^[a-zA-Z0-9_.-]*$')) {
        throw new Error("Please enter valid name")
          console.log('name not Valid');
      } else {
          consoe.log('name Valid');
      }
      }
    } */
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate : {
      validator: async (value) => {
        if(!v.isEmail(value)) {
          throw new Error("The provided information is not an email")
        } else {
          const checkEmail = await studentModel.findOne({ email : value})
          if (checkEmail) {
            throw new Error("Email already exists")
          }
        }
      }
    }
  },
  dateOfBirth: {
    type: Date
    /* birthday: {
      datetime: {
        dateOnly: true,
        latest: moment.utc().subtract(18, 'years'),
        message: "^You need to be at least 18 years old"
      }
    } */
  },
  country: {
    type: String,
    required: true,
  },
  
  /* [{
    type: mongoose.Schema.Types.ObjectId, ref:'project' ,
    
  }], */
})

const studentModel = mongoose.model("student", studentSchema)

studentSchema.path('name').validate(function(n) {
  return !!n && n.length >= 3 && n.length < 10;
}, 'Invalid Name');


module.exports = {studentModel, studentSchema}