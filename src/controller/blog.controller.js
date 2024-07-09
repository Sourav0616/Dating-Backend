import { Blog } from "../model/blog.model.js";
import uploadOnCloudinary from "../middlewire/cloudnary.middlewire.js";

const creatBlog = async (req, res) => {
  try {
    const { tags, description, type } = req.body;
    const createrid = req.body.createrid || req.user._id;
    const useravatar = req.body.useravatar || req.user.avatar;
    const name = req.body.name || req.user.name;
    const localFilepath = req.file.path;

    if (!createrid) {
      res.status(401).send("You are not logged in");
    }
    if (!description) {
      res.status(401).send("description required");
    }
    if (!type) {
      res.status(401).send("type required");
    }
    if (!tags) {
      res.status(401).send("tags required");
    }

    const newTags = tags.split(/,|\s+/ );

    if (!localFilepath) {
      throw new Error("Error in file uploading.");
    }

    const postimage = await uploadOnCloudinary(localFilepath);

    if (!postimage) {
      throw new Error("Postimage Url is required");
    }

    const newBlog = await Blog.create({
      createrid,
      useravatar,
      name,
      tags: newTags,
      postimage: postimage.url,
      description,
      type,
    });

    res.status(201).send(newBlog);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const getAllBlog = async (req, res) => {
  try {
    const userId = req.body.userId || req.user._id;

    if (!userId) {
      throw new Error("Please Login");
    }

    const blogs = await Blog.find().sort("-createdAt");

    res.status(200).send(blogs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const addMassage = async (req, res) => {
  try {
    console.log(req.body.massage);
    const { blogId, massage, createrAvatar, createrName } = req.body;
    const createrId = req.body.userId || req.user._id;

    if (!createrId || !blogId || !massage || !createrAvatar || !createrName) {
      throw new Error("Missing required fields");
    }

    const findBlog = await Blog.findById({ _id: blogId });
    if (!findBlog) {
      throw new Error("Blog is not found");
    }

    const data = {
      postId: blogId,
      avatar: createrAvatar,
      name: createrName,
      comments: massage,
      creator: createrId,
    };

    await findBlog.comments.push(data);
    await findBlog.save();

    res.status(201).send(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const likeBlog = async (req, res) => {
  try {
    const userId = req.body.userId || req.user._id;
    const blogId = req.body.blogId;

    if (!userId || !blogId) {
      throw new Error("Missing required fields");
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      throw new Error("Blog Not Found");
    }

    const existingLike = blog.like.find(
      (like) => like.userId.toString() === userId.toString()
    );

    if (!existingLike) {
      const data = {
        userId: userId,
        postId: blogId,
      };

      blog.like.push(data);
      await blog.save();

      res.status(200).send(data);
    } else {
      res.status(200).send("You already like this post");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const disLikeBlog = async (req, res) => {
  try {
    const userId = req.body.userId || req.user._id;
    const blogId = req.body.blogId;

    if (!userId || !blogId) {
      throw new Error("Missing required fields");
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      throw new Error("Blog Not Found");
    }

    const existingDislike = blog.dislike.find(
      (dislike) => dislike.userId.toString() === userId.toString()
    );

    if (!existingDislike) {
      const data = {
        userId: userId,
        postId: blogId,
      };

      blog.dislike.push(data);
      await blog.save();

      res.status(200).send(data);
    } else {
      res.status(200).send("You already dislike this post");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export { creatBlog, getAllBlog, addMassage, likeBlog, disLikeBlog };

// import { Blog } from "../model/blog.model.js";
// import uploadOnCloudinary from "../middlewire/cloudnary.middlewire.js";

// const creatBlog = async (req, res) => {
//   const { tags, description , type } = req.body;
//   const createrid = req.body.createrid || req.user._id;
//   const useravatar = req.body.useravatar || req.user.avatar;
//   const name = req.body.name || req.user.name;
//   if (!createrid) {
//     res.status(400).send("createrid required");
//   }
//   if(!type){
//     res.status(400).send("Content Type required");
//   }
//   if (!useravatar) {
//     res.status(400).send("avatar required");
//   }
//   if (!name) {
//     res.status(400).send("name required");
//   }
//   if (!description) {
//     res.status(400).send("description required");
//   }
//   if (!tags) {
//     res.status(400).send("tags required");
//   }
//   const newTags = tags.split(/,|\s+/);
//   console.log(newTags + "Line no 22");

//   const localFilepath = req.file.path;

//   if (!localFilepath) {
//     return res.status(500).send("Error in file uploading.");
//   }

//   const postimage = await uploadOnCloudinary(localFilepath);

//   if (!postimage) {
//     return res.status(401).send("Postimage Url is required");
//   }

//   const newBlog = await Blog.create({
//     createrid,
//     useravatar,
//     name,
//     tags: newTags,
//     postimage: postimage.url,
//     description,
//   });

//   res.status(201).send(newBlog);
// };

// const getAllBlog = async (req, res) => {
//   const userId = req.body.userId || req.user._id;

//   if (!userId) {
//     res.status(400).send("Please Login");
//   }
//   const blogs = await Blog.find().sort("-createdAt");

//   res.status(200).send(blogs);
// };

// const addMassage = async (req, res) => {
//   console.log(req.body.massage);
//   const { blogId, massage, createrAvatar, createrName } = req.body;
//   const createrId = req.body.userId || req.user._id;

//   if (!createrId) {
//     res.status(400).send("Creater ID is Required");
//   }
//   if (!blogId) {
//     res.status(400).send("Blog ID is Required");
//   }
//   if (!blogId || massage == "") {
//     res.status(400).send("Massage is Required");
//   }
//   if (!createrAvatar) {
//     res.status(400).send("Avatar is Required");
//   }
//   if (!createrName) {
//     res.status(400).send("Name is Required");
//   }

//   const findBlog = await Blog.findById({ _id: blogId });
//   if (!findBlog) {
//     return res.status(400).send("Blog is not found");
//   }
//   const data = {
//     postId: blogId,
//     avatar: createrAvatar,
//     name: createrName,
//     comments: massage,
//     creator: createrId,
//   };
//   await findBlog.comments.push(data);
//   await findBlog.save();
//   // console.log(findBlog);
//   res.status(201).send(data);
// };

// const likeBlog = async (req, res) => {
//   const userId = req.body.userId || req.user._id;
//   const blogId = req.body.blogId;

//   if (!userId) {
//     return res.status(400).send("User Unauthorized");
//   }
//   if (!blogId) {
//     return res.status(400).send("Blog Not Found");
//   }

//   const blog = await Blog.findById(blogId);

//   if (!blog) {
//     return res.status(404).send("Blog Not Found");
//   }

//   // Check if the userId is already in the blog's dislike array
//   const existingLike = blog.like.find(
//     (like) => like.userId.toString() === userId.toString()
//   );

//   if (!existingLike) {
//     // If userId is not present, add dislike data to the dislike array
//     const data = {
//       userId: userId,
//       postId: blogId,
//     };
//     blog.like.push(data);

//     // Save the updated blog document
//     await blog.save();

//     return res.status(200).send(data);
//   } else {
//     // If userId is already in the dislike array, do nothing
//     return res.status(200).send("You already like this post");
//   }
// };

// const disLikeBlog = async (req, res) => {
//   const userId = req.body.userId || req.user._id;
//   const blogId = req.body.blogId;

//   if (!userId) {
//     return res.status(400).send("User Unauthorized");
//   }
//   if (!blogId) {
//     return res.status(400).send("Blog Not Found");
//   }

//   const blog = await Blog.findById(blogId);

//   if (!blog) {
//     return res.status(404).send("Blog Not Found");
//   }

//   // Check if the userId is already in the blog's dislike array
//   const existingDislike = blog.dislike.find(
//     (dislike) => dislike.userId.toString() === userId.toString()
//   );

//   if (!existingDislike) {
//     // If userId is not present, add dislike data to the dislike array
//     const data = {
//       userId: userId,
//       postId: blogId,
//     };
//     blog.dislike.push(data);

//     // Save the updated blog document
//     await blog.save();

//     return res.status(200).send(data);
//   } else {
//     // If userId is already in the dislike array, do nothing
//     return res.status(200).send("You already dislike this post");
//   }
// };

// export { creatBlog, getAllBlog, addMassage, likeBlog, disLikeBlog };
