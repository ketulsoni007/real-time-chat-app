import { Router } from "express";
import { chatUserListController, getGroupChatHistoryController, getPrivateChatHistoryController, groupCreateController, joinRoomController, sendMessageController } from "../controller/chatController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const chatRoute = Router();

chatRoute.post("/send-chat", sendMessageController);
chatRoute.get("/room/:otherUserId/:userId", getPrivateChatHistoryController);
chatRoute.get("/joinroom/:userId/:room", joinRoomController);
chatRoute.get("/group/:room", getGroupChatHistoryController);
chatRoute.post("/group/store",verifyToken ,groupCreateController);
chatRoute.get("/alluser/list",verifyToken ,chatUserListController);

export default chatRoute;
