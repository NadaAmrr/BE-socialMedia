import mongoose, { Schema, model } from "mongoose";
import joi from "joi";
import { generalFields } from "../../src/middleware/validation.js";
import { validation } from "../../src/middleware/validation.js";
// Create User Schema (( FirstName lastName name email password phone age confirmEmail isDeleted isOnline isBlocked gender profileImage coverImages code ))
const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: String,
    age: {
      type: Number,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      default: "Male",
      enum: ["Male", "Female"],
    },
    profileImage: {
      type: { secure_url: String, public_id: String }
    },
    coverImages: {
      type: [{ secure_url: String, public_id: String }],
      default: [],
    },
    code:{
      type: String,
      min:[6,'minimum lenght 6 char'],
      max:[6,'maximum lenght 6 char']
    }
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", function () {
  this.firstName = this.name.split(" ")[0]
  this.lastName = this.name.split(" ")[1]
  const user = this
  const signupSchema = {
    body: joi.object({
      firstName:joi.string(),
      lastName:joi.string(),
      name: joi.string().min(3).max(30).alphanum().required(),
      newEmail:generalFields.email,
      password: generalFields.password.required(),
      cPassword: generalFields.cPassword.valid(joi.ref("password")).required(),
      phone: generalFields.phone,
      age: generalFields.age
    }).required(),
  };
  validation(signupSchema)

})
const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
