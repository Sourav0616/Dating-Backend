import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "name is required"],
    },
    email: {
      type: String,
      require: [true, "name is required"],
      unique: true,
    },
    password: {
      type: String,
      require: [true, "name is required"],
    },
    gender: {
      type: String,
      require: [true, "name is required"],
    },
    mobile: {
      type: Number,
      require: [true, "name is required"],
    },
    age: {
      type: Number,
      min: 18,
      require: [true, "Age Should be mention & above 18"],
    },
    bio: {
      type: String,
      max: 50,
      require: [true, "Bio is required"],
    },
    avatar: {
      type: String, //its from another db url
      required: [true, "avatar is required"],
    },
    accesstoken: {
      type: String,
    },
    react: {
      type: Number,
      default: 0,
    },
    addaress: {
      type: String,
    },
    education: {
      type: String,
    },
    language: {
      type: String,
    },
    hobbies: {
      type: String,
    },
    otherinfo: {
      type: Array,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccesstoken = async function () {
  const token = await jwt.sign(
    // FIRST PARAMETER NEEDS OBJECT
    {
      _id: this._id,
    },
    // ! SECOND PARAMETER NEEDS STRING
    "HRhuKhsaT",
    // TODO THIRD PARAMETER NEEDS OBJECT
    {
      expiresIn: "30d",
    }
  );
  return token;
};

export const User = mongoose.model("User", userSchema);
