import express from "express";
import adminTokenCheck from "../middleware/adminTokenCheck.js";
import {
  addPerson,
  createRooms,
  findPerson,
} from "../controllers/roomControllers.js";
const router = express.Router();

router.post("/create-rooms", adminTokenCheck, createRooms);
router.put("/new", adminTokenCheck, addPerson);
router.get("/:id", adminTokenCheck, findPerson);

export default router;
