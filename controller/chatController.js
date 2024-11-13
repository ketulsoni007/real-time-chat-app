import chatSchema from "../models/Chat.js";
import messageSchema from "../models/Message.js";
import userSchema from "../models/User.js";
import { io } from "../index.js";

export const sendMessageController = async (req, res) => {
  try {
      const { senderId, receiverId, message, room } = req.body;
      const sender = await userSchema.findById(senderId);
      if (!sender) {
          return res.status(404).json({ message: "Sender not found" });
      }
      let receiver;
      if (!room) {
          receiver = await userSchema.findById(receiverId);
          if (!receiver) {
              return res.status(404).json({ message: "Receiver not found" });
          }
          const newMessage = new chatSchema({
              sender: sender._id,
              receiver: receiver._id,
              message,
              status: "sent",
          });
          await newMessage.save();
      }
      if (room) {
          const roomExists = io.sockets.adapter.rooms.get(room);
          if (!roomExists) {
              return res.status(404).json({ message: "Room not found" });
          }
          const newGroupMessage = new chatSchema({
              sender: sender._id,
              receiver: room,
              message,
              status: "sent",
          });
          await newGroupMessage.save();
          io.to(room).emit("receive-message", {
              sender: sender.name,
              message,
              room,
          });
      } else {
          io.to(receiverId).emit("receive-message", {
              sender: sender.name,
              message,
              room: null,
          });
      }
      return res.status(200).json({ message: "messageSchema sent successfully" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error sending message", error });
  }
};

export const getPrivateChatHistoryController = async (req, res) => {
    try {
        const { userId, otherUserId } = req.params;

        // Retrieve chat history between the two users from the database
        // (If you're storing chat history in a database, you would query your messages collection here)
        // For now, this is just a placeholder for the history
        const chatHistory = []; // Replace this with actual DB query

        return res.status(200).json({
            message: "chatSchema history fetched successfully",
            chatHistory,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching chat history", error });
    }
};

export const joinRoomController = (req, res) => {
    try {
        const { userId, room } = req.body;

        // Find user by ID and ensure they are in the database
        userSchema.findById(userId, (err, user) => {
            if (err || !user) {
                return res.status(404).json({ message: "userSchema not found" });
            }

            // Join the user to the room
            io.to(userId).emit("join-room", room); // Emit a join event to the user
            return res.status(200).json({ message: `userSchema ${userId} joined room ${room}` });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error joining room", error });
    }
};

export const getGroupChatHistoryController = async (req, res) => {
    try {
        const { room } = req.params;

        // Retrieve chat history for the group chat (assuming it's stored in a database)
        const groupChatHistory = []; // Replace this with actual DB query

        return res.status(200).json({
            message: "Group chat history fetched successfully",
            groupChatHistory,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching group chat history", error });
    }
};

export const groupCreateController = async (req, res) => {
  try {
    const { name, participants } = req.body;

    const allParticipants = participants ? JSON.parse(participants) : [];

    if (!name || allParticipants.length === 0) {
      return res.status(400).json({ message: "Group name and participants are required." });
    }

    // Ensure the user who created the group is part of the participants
    const { userId } = req;
    allParticipants.push(userId); // Add the current user if not already present
    console.log('allParticipants: ', allParticipants);
    console.log('userId: ', userId);

    // Create the new group chat
    const newGroupChat = new chatSchema({
      isGroupChat: true,
      groupName: name,
      users: allParticipants,
      groupAdmin: userId, // The creator of the group is the admin
    });

    // Save the group chat to the database
    const savedGroupChat = await newGroupChat.save();

    // Optionally, create a message for the group indicating the chat has been created
    const newMessage = new messageSchema({
      sender: userId,
      content: `Welcome to the group, ${name}!`,
      chatId: savedGroupChat._id,
    });

    // Save the initial message
    await newMessage.save();

    // Update the group with the first message
    savedGroupChat.latestMessage = newMessage._id;
    await savedGroupChat.save();

    // Send response with the created group chat
    return res.status(201).json({
      message: "Group chat created successfully!",
      groupChat: savedGroupChat,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating group chat", error });
  }
};

export const messageStoreController = async (req, res) => {
    try {
      const { userId } = req.userId; // Extract the userId from authenticated user
      const { chatId, content } = req.body; // Get chatId and content from the request body
  
      // Validate input
      if (!chatId || !content) {
        return res.status(410).json({ message: "chatSchema ID and message content are required" });
      }
  
      // Check if the user is part of the chat
      const chat = await chatSchema.findById(chatId).populate("users", "_id");
      if (!chat) {
        return res.status(410).json({ message: "chatSchema not found" });
      }
  
      const isUserInChat = chat.users.some((user) => user._id.toString() === userId);
      if (!isUserInChat) {
        return res.status(410).json({ message: "You are not a participant of this chat" });
      }
  
      // Create a new message
      const newMessage = await messageSchema.create({
        sender: userId,
        content,
        chatId,
      });
  
      // Update the latest message in the chatSchema model
      chat.latestMessage = newMessage._id;
      await chat.save();
  
      // Populate sender details for the response
      const populatedMessage = await messageSchema.findById(newMessage._id)
        .populate("sender", "name email")
        .populate("chatId", "isGroupChat groupName users");
  
      // Emit the message using Socket.IO
      const { isGroupChat, users } = chat;
  
      if (isGroupChat) {
        // Emit to all users in the group except the sender
        users.forEach((user) => {
          if (user._id.toString() !== userId) {
            io.to(user._id.toString()).emit("receive-message", populatedMessage);
          }
        });
      } else {
        // For 1-to-1 chat, emit to the other participant
        const receiver = users.find((user) => user._id.toString() !== userId);
        if (receiver) {
          io.to(receiver._id.toString()).emit("receive-message", populatedMessage);
        }
      }
  
      // Return the stored message
      return res.status(201).json({ message: "messageSchema sent successfully", data: populatedMessage });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error storing message", error });
    }
};

export const chatUserListController = async (req, res) => {
  try {
    const { userId } = req;

    // Fetch chats where the logged-in user is included
    const chatList = await chatSchema.find({
      users: { $in: [userId] },
    })
      .populate("users", "-password") // Populate the users excluding the password
      .populate("latestMessage"); // Optionally populate the latest message if you need

    // Filter out the logged-in user from the users list in each chat
    const chatListWithFilteredUsers = chatList.map(chat => {
      const usersInChat = chat.users.filter(user => user._id.toString() !== userId.toString());
      return {
        ...chat.toObject(),
        users: usersInChat,
      };
    });

    // Fetch users excluding the logged-in user
    const users = await userSchema.find({ _id: { $ne: userId } });

    return res.status(200).json({
      message: "chatSchema list fetched successfully!",
      groupList: chatListWithFilteredUsers,
      userList: users, // Ensure the users list is returned after the query is awaited
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching chat list", error });
  }
};