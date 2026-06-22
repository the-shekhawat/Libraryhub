import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  addMember,
  getMembers,
  deleteMember,
   updateMemberStatus ,
   updateMember
} from "../controllers/memberController.js";

const router = express.Router();

// CREATE MEMBER
router.post("/", protect, addMember);

// GET MEMBERS (user-specific)
router.get("/", protect, getMembers);

// DELETE MEMBER
router.delete("/:id", protect, deleteMember);



// edits
router.put('/:id', protect, updateMember);

export default router;