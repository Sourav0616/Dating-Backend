import { User } from "../model/user.model.js";
import { Matchrequest } from "../model/matchrequest.mode.js";

const creatMatchRequest = async (req, res) => {
  try {
    const userId = req.user._id || req.body.userId;
    const loveId = req.body.loveId;

    const user = await User.findById(userId);
    const love = await User.findById(loveId);

    const exist = await Matchrequest.find({
      whorequest: user,
      whogetrequest: love,
    });

    if (exist.length <= 0) {
      const createRequest = await Matchrequest.create({
        whorequest: user,
        whogetrequest: love,
      });
      return res.send("Create Successful");
    }
    res.send("Request exists");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSpecficUserMatchRequest = async (req, res) => {
  try {
    const userId = req.user._id || req.body.userId;

    if (!userId) {
      return console.log("No user from token");
    }

    const getReactUsers = await User.aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: "matchrequests",
          localField: "_id",
          foreignField: "whogetrequest",
          as: "matchprofile",
        },
      },
    ]);

    if (getReactUsers[0].matchprofile.length === 0) {
      return res.status(400).json({ msg: 'No match request' });
    }

    const length = [];
    for (let i = 0; i < getReactUsers[0].matchprofile.length; i++) {
      length.push(getReactUsers[0].matchprofile[i].whorequest);
    }
    console.log(length);

    const requestedUser = await User.find({
      _id: { $in: length },
    });

    if (requestedUser.length <= 0) {
      return res.send("No matches for you");
    }
    res.send(requestedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deletMatchRequest = async (req, res) => {
  try {
    const userId = req.user._id || req.body.userId;
    const loveId = req.body.loveId;

    if (!userId || !loveId) {
      return console.log("User Unauthorized");
    }

    const deleteMatch = await Matchrequest.deleteOne({
      $and: [{ whogetrequest: userId }, { whorequest: loveId }],
    });

    res.send("Deleted Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { creatMatchRequest, getSpecficUserMatchRequest, deletMatchRequest };


// import { User } from "../model/user.model.js";
// import { Matchrequest } from "../model/matchrequest.mode.js";

// const creatMatchRequest = async (req, res) => {
//   const userId = req.user._id || req.body.userId;
//   const loveId = req.body.loveId;

//   const user = await User.findById(userId);
//   const love = await User.findById(loveId);

//   const exist = await Matchrequest.find({
//     whorequest: user,
//     whogetrequest: love,
//   });

//   if (exist.length <= 0) {
//     const creat = await Matchrequest.create({
//       whorequest: user,
//       whogetrequest: love,
//     });
//     return res.send("Creat Successfull");
//   }
//   res.send("Request exist");
// };

// //  first function end

// const getSpecficUserMatchRequest = async (req, res) => {
//   const userId = req.user._id || req.body.userId;
//   if (!userId) {
//     return console.log("no user from token");
//   }
//   const getReactUsers = await User.aggregate([
//     { $match: { _id: userId } },
//     {
//       $lookup: {
//         from: "matchrequests",
//         localField: "_id",
//         foreignField: "whogetrequest",
//         as: "matchprofile",
//       },
//     },
//   ]);

//   if(getReactUsers[0].matchprofile.length === 0){
//      return res.status(400).json({ msg: 'No match request' })
//   }
  
//   const length = [];
//   for (let i = 0; i < getReactUsers[0].matchprofile.length; i++) {
//     length.push(getReactUsers[0].matchprofile[i].whorequest);
//   }
//   console.log(length)
//   const requestedUser = await User.find({
//      _id: { $in: length },
//    });

//    if(requestedUser.length <=0){
//    return res.send("No matchs For you");
//    }
//    res.send(requestedUser);
// };

// //  second function end

// const deletMatchRequest = async (req,res)=>{

//   const userId = req.user._id || req.body.userId;
//   const loveId = req.body.loveId;

//   if (!userId) {
//     return console.log("User Unauthorize");
//   }
//   if (!loveId) {
//     return console.log("User Unauthorize");
//   }

//   const deletMatch = await Matchrequest.deleteOne({
//     $and: [{ whogetrequest: userId }, { whorequest : loveId }],
//   });

//   res.send("Deleted Successfully");

// }

// export { creatMatchRequest, getSpecficUserMatchRequest , deletMatchRequest };
