import { Router } from "express";
import { registerController,loginController,getAllUserController,testController } from "../controller/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const authRoute = Router();

authRoute.post("/register",registerController)
authRoute.post("/login",loginController)
authRoute.get("/test",verifyToken,testController)
authRoute.get("/user/list",verifyToken, getAllUserController);

export default authRoute;