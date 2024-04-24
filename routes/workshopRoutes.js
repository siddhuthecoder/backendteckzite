import express from "express";
import {
  deleteWorkshop,
  editWorkshop,
  fetchAllWorkshops,
  fetchWorkshopById,
  newWorkshopUpload,
  registerWorkshop,
} from "../controllers/workshopControllers.js";
import adminTokenCheck from "../middleware/adminTokenCheck.js";

const router = express.Router();
router.get("/all-workshops", fetchAllWorkshops);
router.get("/:id", fetchWorkshopById);
router.post("/create/new", adminTokenCheck, newWorkshopUpload);
router.put("/edit-workshop/:id", adminTokenCheck, editWorkshop);
router.delete("/delete/:id", adminTokenCheck, deleteWorkshop);
router.post("/register/:id", registerWorkshop);

export default router;
