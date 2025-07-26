import express from "express";
const router = express.Router();

import { registerUser, getAllUsers, sendAlertToAll } from "../controllers/alertController.js";

router.post("/register", registerUser);
router.get("/users", getAllUsers);
router.post("/alert", sendAlertToAll);

export default router;
