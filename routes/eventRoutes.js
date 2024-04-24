import express from "express";
import {
  createEvent,
  fetchAllEvents,
  fetchEventById,
  editEvent,
  deleteEvent,
  eventRegistration,
  getAllRegisteredStudents,
} from "../controllers/eventControllers.js";
import { verifyUserToken } from "../middleware/auth.js";
import adminTokenCheck from "../middleware/adminTokenCheck.js";

const router = express.Router();

router.post("/new", adminTokenCheck, createEvent);
router.get("/all-events", fetchAllEvents);
router.get("/:id", fetchEventById);
router.put("/edit/:id", adminTokenCheck, editEvent);
router.delete("/delete-event/:id", adminTokenCheck, deleteEvent);
router.get("/view-responses/:id", adminTokenCheck, getAllRegisteredStudents);
router.post("/register/:id", verifyUserToken, eventRegistration);

export default router;
