import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import FeePayment from "../models/FeePayment.js";

const router = express.Router();

// ➤ Add Fee Payment
router.post("/", protect, async (req, res) => {
  try {
    const payment = await FeePayment.create({
      ...req.body,
      userId: req.user._id, // link payment to logged-in user
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➤ Get Fee Payments
router.get("/", protect, async (req, res) => {
  try {
    const payments = await FeePayment.find({
      userId: req.user._id,
    }).populate("member_id");

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;