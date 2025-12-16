import express from "express";
import { getMessages, getUserForSidebar, markMessagesSeen, sendMessage } from "../controllers/messageController.js";
import { protectRoute } from "../middleware/auth.js";
const messagerouter = express.Router();
messagerouter.get("/users",protectRoute,getUserForSidebar);
messagerouter.get("/:id",protectRoute,getMessages);
messagerouter.put("/mark/:id",protectRoute,markMessagesSeen);
messagerouter.post("/send/:id",protectRoute,sendMessage);
export default messagerouter;