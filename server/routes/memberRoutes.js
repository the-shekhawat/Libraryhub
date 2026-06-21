import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  addMember,
  getMembers,
  deleteMember,
   updateMemberStatus 
} from "../controllers/memberController.js";

const router = express.Router();

// CREATE MEMBER
router.post("/", protect, addMember);

// GET MEMBERS (user-specific)
router.get("/", protect, getMembers);

// DELETE MEMBER
router.delete("/:id", protect, deleteMember);

// UPDATE STATUS (soft delete / inactive)
router.put("/:id", protect, updateMemberStatus);

export default router;