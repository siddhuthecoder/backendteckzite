import express from "express";
import {
  deleteNotification,
  editNotification,
  fetchNotification,
  fetchNotificationById,
  newNotification,
} from "../controllers/notificationControllers.js";
import adminTokenCheck from "../middleware/adminTokenCheck.js";

const router = express.Router();

router.get("/all-notifications", fetchNotification);
router.get("/note/:id", fetchNotificationById);
router.post("/new", adminTokenCheck, newNotification);
router.put("/update/:id", adminTokenCheck, editNotification);
router.delete("/delete/:id", adminTokenCheck, deleteNotification);

export default router;
