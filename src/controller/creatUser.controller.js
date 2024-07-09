import { User } from "../model/user.model.js";
import uploadOnCloudinary from "../middlewire/cloudnary.middlewire.js";

// First function
const creatUser = async (req, res) => {
  try {
    const { name, bio, password, age, gender, mobile, email } = req.body;
    if (!(name && bio && password && age && gender && mobile && email)) {
      return res.status(401).send({ message: "All fields are required." });
    }

    const localFilepath = req.file.path;

    if (!localFilepath) {
      return res.status(500).send("Error in file uploading.");
    }

    const avatar = await uploadOnCloudinary(localFilepath);

    if (!avatar) {
      return res.status(401).send({ message: "Avatar Url is required" });
    }

    const user = await User.create({
      name,
      bio,
      password,
      email,
      avatar: avatar.url,
      mobile,
      age,
      gender,
    });

    if (!user) {
      return res.status(401).send({ message: "User creation failed" });
    }

    res.status(201).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// First end

// Second function
const getAllUser = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Second function end

// Third function
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    const token = await user.generateAccesstoken(user._id);

    if (!token) {
      return res.status(500).json({ error: "Token generation failed" });
    }

    user.accesstoken = token;
    user.save({ validateBeforeSave: false });

    return res.status(200).send(user.accesstoken);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Third function end

export { creatUser, getAllUser, loginUser };



// import { User } from "../model/user.model.js";
// import uploadOnCloudinary from "../middlewire/cloudnary.middlewire.js";


// //  first function

// const creatUser = async (req, res) => {
//   const { name, bio, password, age, gender, mobile, email } = req.body;
//   if (!(name && bio && password && age && gender && mobile && email)) {
//     return res.status(401).send({ message: "All fields are required." });
//   }
//   const localFilepath = req.file.path;

//   if (!localFilepath) {
//     return res.status(500).send("Error in file uploading.");
//   }
//   const avatar = await uploadOnCloudinary(localFilepath);

//   if (!avatar) {
//     return res.status(401).send({ message: "Avatar Url is required" });
//   }

//   const user = await User.create({
//     name,
//     bio,
//     password,
//     email,
//     avatar: avatar.url,
//     mobile,
//     age,
//     gender,
//   });

//   if (!user) {
//     return res.status(401).send({ message: "User creat faild" });
//   }
//   res.status(201).send(user);
// };

// //  first end

// // ! its second function

// const getAllUser = async (req, res) => {
//   const data = await User.find();
//   res.status(200).send(data);
// };

// // ! its second function

// // todo third function

// const loginUser = async (req, res) => {

//   const { email, password } = req.body;

   

//   if (email) {
//     // console.log(email);
//   }
//   const user = await User.findOne({ email: email });

//   if (user) {
//     // console.log(user);
//   }

//   const isPasswordValid = await user.isPasswordCorrect(password);
  
//   if (isPasswordValid == false) {
//    return console.log("error")
//   }
  
//   const token = await user.generateAccesstoken(user._id);

//   if (token) {
//     // console.log(token);
//   }

//   user.accesstoken = token;
//   user.save({ validateBeforeSave: false });

//   return res.status(200).send(user.accesstoken);
// };

// // todo third function
// export { creatUser, getAllUser, loginUser };
