import chatSchema from "../models/Chat.js";
import messageSchema from "../models/Message.js";
import userSchema from "../models/User.js";
import { io } from "../index.js";
import mongoose from "mongoose";

export const sendMessageController = async (req, res) => {
  try {
    const { userId } = req;
    const { content, isGroupChat, receiver, groupId } = req.body;

    // Group Chat
    if (isGroupChat === true || isGroupChat === 'true') {
      const groupChat = await chatSchema.findById(groupId).populate('users');
      if (!groupChat) {
        return res.status(404).json({ message: "Group chat not found" });
      }

      // Create and Save New Message
      const newMessage = new messageSchema({
        sender: userId,
        content,
        chatId: groupChat._id, // Group chat ID
      });
      await newMessage.save();

      // Update Latest Message
      groupChat.latestMessage = newMessage._id;
      await groupChat.save();

      // Emit the message to the specific group room
      io.to(groupId).emit("receive_message", {
        _id: newMessage._id,
        sender: { _id: userId },
        content,
        createdAt: newMessage.createdAt,
        isGroupChat: true,
        chatId: groupChat._id,
      });

      return res.status(200).json({ message: "Message sent successfully", data: newMessage });
    }

    // Private Chat
    let personalChat = await chatSchema.findOne({
      isGroupChat: false,
      users: { $all: [userId, receiver] },
    });

    // Create new chat if it doesn't exist
    if (!personalChat) {
      personalChat = new chatSchema({
        isGroupChat: false,
        users: [userId, receiver],
      });
      await personalChat.save();
    }

    // Create and Save New Message
    const newMessage = new messageSchema({
      sender: userId,
      content,
      chatId: personalChat._id, // Personal chat ID
    });
    await newMessage.save();

    // Update Latest Message
    personalChat.latestMessage = newMessage._id;
    await personalChat.save();

    // Emit the message to the specific receiver's room
    // io.to(receiver).emit("receive_message", {
    //   _id: newMessage._id,
    //   sender: { _id: userId },
    //   content,
    //   createdAt: newMessage.createdAt,
    //   isGroupChat: false,
    //   chatId: personalChat._id,
    // });
    io.to(userId).to(receiver).emit("receive_message", {
      _id: newMessage._id,
      sender: { _id: userId },
      content,
      createdAt: newMessage.createdAt,
      isGroupChat: false,
      chatId: personalChat._id,
    });

    return res.status(200).json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error sending message", error });
  }
};

export const getChatHistoryController = async (req, res) => {
  const { userId } = req;
  const { isGroupChat, receiver, groupId } = req.body;
  try {
    let chatHistory;
    if (isGroupChat === true || isGroupChat === 'true') {
      if (!groupId) {
        return res.status(400).json({ message: "Group ID is required for group chats" });
      }

      // Find the group chat by `groupId`
      const groupChat = await chatSchema.findOne({
        _id: groupId,
        isGroupChat: true,
      }).populate("users", "name email");

      if (!groupChat) {
        return res.status(404).json({ message: "Group chat not found" });
      }

      // Fetch messages for the group chat
      chatHistory = await messageSchema.find({
        chatId: groupChat._id,
      }).populate("sender", "name email").sort({ createdAt: 1 }); // Sort by time (ascending)

    } else {
      // If it is a private chat, fetch messages between `userId` and `receiver`
      if (!receiver) {
        return res.status(400).json({ message: "Receiver ID is required for private chats" });
      }

      // Find the private chat between two users
      const privateChat = await chatSchema.findOne({
        isGroupChat: false,
        users: { $all: [userId, receiver] }, // Ensure both users are in the chat
      }).populate("users", "name email");

      if (!privateChat) {
        return res.status(404).json([]);
      }

      // Fetch messages for the private chat
      chatHistory = await messageSchema.find({
        chatId: privateChat._id,
      }).populate("sender", "name email").sort({ createdAt: 1 }); // Sort by time (ascending)
    }
    return res.status(200).json(chatHistory);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ message: "Error fetching chat history", error });
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
    const { _id,name, participants } = req.body;
    const { userId } = req;
    const allParticipants = participants ? JSON.parse(participants) : [];
    if (_id && mongoose.Types.ObjectId.isValid(_id)) {
      const groupChat = await chatSchema.findById(_id);
      if (!groupChat) {
        return res.status(410).json({ message: "Group not found." });
      }
      
      if (groupChat.groupAdmin.toString() !== userId) {
        return res.status(403).json({ message: "You are not authorized to update this group." });
      }
    
      // Update group name if provided
      if (name) {
        groupChat.groupName = name;
        await groupChat.save(); // Save the group chat to persist the name change
      }
    
      // Ensure the user is part of the participants
      if (!allParticipants.includes(userId)) {
        allParticipants.push(userId);
      }
    
      // If there are participants, update the users
      if (allParticipants.length > 0) {
        // Add new participants if not already in the group
        await chatSchema.updateOne(
          { _id: groupChat._id },
          {
            $addToSet: { users: { $each: allParticipants } } // Add participants if they don't exist
          }
        );
    
        // Remove participants who are no longer in the updated list
        await chatSchema.updateOne(
          { _id: groupChat._id },
          {
            $pull: { users: { $nin: allParticipants } } // Remove participants who aren't in the updated list
          }
        );
      }
    
      // Fetch the updated group chat after the name and participants are updated
      const updatedGroupChat = await chatSchema.findById(groupChat._id);
    
      return res.status(200).json({
        message: "Group chat updated successfully!",
        groupChat: updatedGroupChat,
      });
    }

    if (!name || allParticipants.length === 0) {
      return res.status(400).json({ message: "Group name and participants are required." });
    }

    // Ensure the user who created the group is part of the participants
   
    allParticipants.push(userId);

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
    return res.status(200).json({
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