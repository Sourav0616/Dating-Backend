import { Lovereact } from "../model/react.model.js";
import { User } from "../model/user.model.js";

const creatReact = async (req, res) => {
  try {
    const userId = req.user._id || req.body.userId;
    const loveId = req.body.loveId;

    const user = await User.findById(userId);
    const love = await User.findById(loveId);

    const exist = await Lovereact.find({ whoreact: user, whogetreact: love });

    if (exist.length <= 0) {
      const react = await Lovereact.create({ whoreact: user, whogetreact: love });
      const reactedUser = await User.findById({ _id: loveId });

      if (!reactedUser) {
        return console.log("Error");
      }

      reactedUser.react = reactedUser.react + 1;
      reactedUser.save({ validateBeforeSave: false });
    }

    res.send("OK");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSpecficUserReactProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.body.userId;

    if (!userId) {
      return console.log("No user from token");
    }

    const getReactUsers = await User.aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: "lovereacts",
          localField: "_id",
          foreignField: "whogetreact",
          as: "reacts",
        },
      },
    ]);

    const length = [];
    for (let i = 0; i < getReactUsers[0].reacts.length; i++) {
      length.push(getReactUsers[0].reacts[i].whoreact);
    }

    const reactUsers = await User.find({
      _id: { $in: length },
    });
    res.send(reactUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loveReject = async (req, res) => {
  try {
    const userId = req.user._id || req.body.userId;
    const loveId = req.body.loveId;

    if (!userId) {
      return console.log("User Unauthorized");
    }
    if (!loveId) {
      return console.log("User Unauthorized");
    }

    const deleteRequest = await Lovereact.deleteOne({
      $and: [{ whogetreact: userId }, { whoreact: loveId }],
    });

    res.send("Deleted Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loveBack = async (req, res) => {
  try {
    const userId = req.user._id || req.body.userId;
    const loveId = req.body.loveId;

    const user = await User.findById(userId);
    const love = await User.findById(loveId);

    if (!user) {
      return console.log("UserId needed");
    }
    if (!love) {
      return console.log("LoveId needed");
    }

    const deleteReact = await Lovereact.deleteOne({ whoreact: love, whogetreact: user });
    const loveUser = await User.findById({ _id: love._id });
    loveUser.react = loveUser.react + 1;
    loveUser.save({ validateBeforeSave: false });

    res.send("Request removed");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getSpecficUserReactProfile, loveReject, loveBack };
export default creatReact;


// import { Lovereact } from "../model/react.model.js";
// import { User } from "../model/user.model.js";

// const creatReact = async (req, res) => {
//   const userId = req.user._id || req.body.userId;
//   const loveId = req.body.loveId;

//   const user = await User.findById(userId);
//   const love = await User.findById(loveId);

//   const exist = await Lovereact.find({ whoreact: user, whogetreact: love });
  
//   if (exist.length <= 0) {
//     const react = await Lovereact.create({ whoreact: user, whogetreact: love });
//     const reactedUser = await User.findById({ _id: loveId });
    
//     if (!reactedUser) {
//       return console.log("error");
//     } 

//     reactedUser.react = reactedUser.react + 1;
//     reactedUser.save({ validateBeforeSave: false });
//   }

//   res.send("OK");
// };

// const getSpecficUserReactProfile = async (req, res) => {
//   const userId = req.user._id || req.body.userId;

//   if (!userId) {
//     return console.log("no user from token");
//   }
//   const getReactUsers = await User.aggregate([
//     { $match: { _id: userId } },
//     {
//       $lookup: {
//         from: "lovereacts",
//         localField: "_id",
//         foreignField: "whogetreact",
//         as: "reacts",
//       },
//     },
//   ]);

//   const length = [];
//   for (let i = 0; i < getReactUsers[0].reacts.length; i++) {
//     length.push(getReactUsers[0].reacts[i].whoreact);
//   }

//   const reactUsers = await User.find({
//     _id: { $in: length },
//   });
//   res.send(reactUsers);
// };

// // above function end here

// const loveReject = async (req, res) => {
//   const userId = req.user._id || req.body.userId;
//   const loveId = req.body.loveId;

//   if (!userId) {
//     return console.log("User Unauthorize");
//   }
//   if (!loveId) {
//     return console.log("User Unauthorize");
//   }

//   const deletRequest = await Lovereact.deleteOne({
//     $and: [{ whogetreact: userId }, { whoreact: loveId }],
//   });
  
//   res.send("Deleted Successfully");
// };

// //  Loveback finction implement

// const loveBack= async (req , res)=>{

//   const userId = req.user._id || req.body.userId;
//   const loveId = req.body.loveId;

//   const user = await User.findById(userId);
//   const love = await User.findById(loveId);

//   if(! user){
//     return console.log("Userid needed")
//   }
//   if(! love){
//     return console.log("Loveid needed")
//   }

//   const delet = await Lovereact.deleteOne({ whoreact: love, whogetreact: user });
//   const loveuser= await User.findById({_id : love._id})
//   loveuser.react = loveuser.react+1
//   loveuser.save({ validateBeforeSave: false });

//   res.send("Request removed")
// }

// export { getSpecficUserReactProfile, loveReject , loveBack};
// export default creatReact;
