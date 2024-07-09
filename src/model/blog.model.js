import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    createrid: {
      type: String,
      require: true,
    },
    useravatar: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    tags: {
      type: Array,
      require: true,
    },
    postimage: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
    comments: {
      type: Array,
    },
    like: {
      type: Array,
    },
    dislike: {
      type: Array,
      
    },
    share: {
      type: Array,
    },
    description: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog",blogSchema)