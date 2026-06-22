import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import FeePayment from "../models/FeePayment.js";

const router = express.Router();

// Add Fee
router.post("/", protect, async (req, res) => {
  try {
    

    const payment = await FeePayment.create({
      ...req.body,
      userId: req.user._id,
    });



    res.status(201).json(payment);
  } catch (err) {
    console.error("ERROR NAME:", err.name);
    console.error("ERROR MESSAGE:", err.message);
    console.error("FULL ERROR:", err);

    res.status(500).json({
      message: err.message,
      name: err.name,
      errors: err.errors,
    });
  }
});
// Update Fee (Renew)
router.put("/:id", protect, async (req, res) => {
  try {
    const { payment_date, months_paid } = req.body;

    let next_due_date = null;

    if (payment_date && months_paid) {
      const date = new Date(payment_date);
      date.setMonth(date.getMonth() + Number(months_paid));
      next_due_date = date;
    }

    const updated = await FeePayment.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      {
        ...req.body,
        next_due_date,   // 🔥 ADD THIS
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Fees
// Get Fees
router.get("/", protect, async (req, res) => {
  try {
    let payments = await FeePayment.find({
      userId: req.user._id,
    }).populate("member_id");

    // Sort by Year -> Month -> Day
    payments.sort((a, b) => {
      const da = new Date(a.payment_date);
      const db = new Date(b.payment_date);

      // Year
      if (da.getFullYear() !== db.getFullYear()) {
        return da.getFullYear() - db.getFullYear();
      }

      // Month
      if (da.getMonth() !== db.getMonth()) {
        return da.getMonth() - db.getMonth();
      }

      // Day
      return da.getDate() - db.getDate();
    });

    res.json(payments);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Delete Fee
router.delete("/:id", protect, async (req, res) => {
  try {
    const payment = await FeePayment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment record not found",
      });
    }

    res.json({
      message: "Payment deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;