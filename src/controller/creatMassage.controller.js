import { User } from "../model/user.model.js";
import { Massagerequest } from "../model/massage.model.js";
import { Chats } from "../model/chat.model.js";

const creatMassageMatch = async (req, res) => {
  try {
    const userId = req.user._id || req.body.userId;
    const loveId = req.body.loveId;

    const user = await User.findById(userId);
    const love = await User.findById(loveId);

    const exist = await Massagerequest.find({
      $and: [
        {
          whoaccepttomassage: user,
          whorequesttomassage: love,
        },
        {
          whoaccepttomassage: love,
          whorequesttomassage: user,
        },
      ],
    });

    const find = await Chats.find({
      $or: [
        { userone: userId, usertwo: loveId },
        { userone: loveId, usertwo: userId },
      ],
    });

    console.log(find);

    if (find.length <= 0) {
      const createChat = await Chats.create({
        userone: userId,
        usertwo: loveId,
      });
    }

    if (exist.length <= 0) {
      const createRequest1 = await Massagerequest.create({
        whoaccepttomassage: user,
        whorequesttomassage: love,
      });

      const createRequest2 = await Massagerequest.create({
        whoaccepttomassage: love,
        whorequesttomassage: user,
      });

      return res.send("Create Successful");
    }

    res.send("Request exists");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const sentUserAllMatchForMassage = async (req, res) => {
  try {
    const userId = req.user._id || req.body.userId;

    if (!userId) {
      return console.log("No user from token");
    }

    console.log("Sourav");

    const getAllMatch = await User.aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: "massagerequests",
          localField: "_id",
          foreignField: "whoaccepttomassage",
          as: "massages",
        },
      },
    ]);

    if (getAllMatch[0].massages.length === 0) {
      return res.status(400).json({ msg: "No match request" });
    }

    const length = [];
    for (let i = 0; i < getAllMatch[0].massages.length; i++) {
      length.push(getAllMatch[0].massages[i].whorequesttomassage);
    }
    console.log(length);

    const requestedUser = await User.find({
      _id: { $in: length },
    });

    res.send(requestedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { creatMassageMatch, sentUserAllMatchForMassage };



// import { User } from "../model/user.model.js";
// import { Massagerequest } from "../model/massage.model.js";
// import { Chats } from "../model/chat.model.js";
// const creatMassageMatch = async (req, res) => {
//   const userId = req.user._id || req.body.userId;
//   const loveId = req.body.loveId;

//   const user = await User.findById(userId);
//   const love = await User.findById(loveId);

//   const exist = await Massagerequest.find({
//     $and: [
//       {
//         whoaccepttomassage: user,
//         whorequesttomassage: love,
//       },
//       {
//         whoaccepttomassage: love,
//         whorequesttomassage: user,
//       },
//     ],
//   });
  

//   const find = await Chats.find({
//     $or: [
//       { userone: userId, usertwo: loveId },
//       { userone: loveId, usertwo: userId }
//     ]
//   });

//   console.log(find)

//   if(find.length <= 0){
//     const creat = await Chats.create({
//       userone : userId ,
//       usertwo : loveId
//     })
//   }

//   if (exist.length <= 0) {
//     const creat = await Massagerequest.create({
//       whoaccepttomassage: user,
//       whorequesttomassage: love,
//     });
//     const creat2 = await Massagerequest.create({
//       whoaccepttomassage: love,
//       whorequesttomassage: user,
//     }); 

//     return res.send("Creat Successfull");
//   }
//   res.send("Request exist");
// };

// //  first function end

// const sentUserAllMatchForMassage = async (req, res) => {
//   const userId = req.user._id || req.body.userId;
//   if (!userId) {
//     return console.log("no user from token");
//   }
//   console.log("Sourav");
//   const getAllMatch = await User.aggregate([
//     { $match: { _id: userId } },
//     {
//       $lookup: {
//         from: "massagerequests",
//         localField: "_id",
//         foreignField: "whoaccepttomassage",
//         as: "massages",
//       },
//     },
//   ]);

//   if (getAllMatch[0].massages.length === 0) {
//     return res.status(400).json({ msg: "No match request" });
//   }

//   const length = [];
//   for (let i = 0; i < getAllMatch[0].massages.length; i++) {
//     length.push(getAllMatch[0].massages[i].whorequesttomassage);
//   }
//   console.log(length);
//   const requestedUser = await User.find({
//     _id: { $in: length },
//   });
//   res.send(requestedUser);
// };
// //  sceond function end

// export { creatMassageMatch, sentUserAllMatchForMassage };
