import express from "express";
import { adminLogin, adminRegister } from "../controllers/adminControllers.js";
import adminTokenCheck from "../middleware/adminTokenCheck.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/register", adminTokenCheck, adminRegister);

export default router;
