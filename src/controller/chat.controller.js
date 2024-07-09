import { Chats } from "../model/chat.model.js";

const creatChat = async (req, res) => {
  const userId = req.body.userId;
  const loveId = req.body.loveId;
  const message = req.body.message;

  if (!userId) {
    return res.status(401).json({ error: "User ID is missing." });
  }

  try {
    const find = await Chats.findOneAndUpdate(
      {
        $or: [
          { userone: userId, usertwo: loveId },
          { userone: loveId, usertwo: userId },
        ],
      },
      {
        $push: {
          messages: {
            senderid: userId,
            message: message,
          },
        },
      },
      { new: true } // To return the updated document
    );

    if (!find) {
      // If no document is found, you may want to create a new chat entry
      const newChat = new Chats({
        userone: userId,
        usertwo: loveId,
        messages: [
          {
            senderid: userId,
            message: message,
          },
        ],
      });
      await newChat.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getChatMessages = async (req, res) => {
  const userId = req.body.userId;
  const loveId = req.body.loveId;

  if (!userId || !loveId) {
    return res.status(400).json({ error: "User IDs are required." });
  }

  try {
    const chat = await Chats.findOne({
      $or: [
        { userone: userId, usertwo: loveId },
        { userone: loveId, usertwo: userId },
      ],
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    const messages = chat.messages;
    res.status(200).send(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { creatChat, getChatMessages };


// import { Chats } from "../model/chat.model.js";

// const creatChat = async (req, res) => {
//   const userId = req.body.userId;
//   const loveId = req.body.loveId;
//   const massage = req.body.message; // Corrected variable name

//   if (!userId) {
//     return res.status(401).json({ error: "User ID is missing." });
//   }

//   try {
//     const find = await Chats.findOneAndUpdate(
//       {
//         $or: [
//           { userone: userId, usertwo: loveId },
//           { userone: loveId, usertwo: userId },
//         ],
//       },
//       {
//         $push: {
//           messages: {
//             senderid: userId,
//             message: massage,
//           },
//         },
//       },
//       { new: true } // To return the updated document
//     );

//     if (!find) {
//       // If no document is found, you may want to create a new chat entry
//       const newChat = new Chats({
//         userone: userId,
//         usertwo: loveId,
//         messages: [
//           {
//             senderid: userId,
//             message: massage,
//           },
//         ],
//       });
//       await newChat.save();
//     }

//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// const getChatMessages = async (req, res) => {
//   const userId = req.body.userId;
//   const loveId = req.body.loveId;

//   if (!userId || !loveId) {
//       return res.status(400).json({ error: "User IDs are required." });
//   }

//   try {
//     const chat = await Chats.findOne({
//       $or: [
//         { userone: userId, usertwo: loveId },
//         { userone: loveId, usertwo: userId },
//       ],
//     })
    
//     if (!chat) {
//       return res.status(404).json({ error: "Chat not found." });
//     }
//     console.log(chat)

//     const messages = chat.messages;
//     console.log(messages)
//     res.status(200).send(messages);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export { creatChat, getChatMessages };
