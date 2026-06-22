import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    payment_date: {
      type: Date,
      required: true,
    },

    // NEW: Number of months covered by this transaction
    months_paid: {
      type: Number,
      default: 1,
      required: true,
    },

    // NEW: Automatically calculated next renewal target date
    next_due_date: {
      type: Date,
    },
  },
  { timestamps: true }
);

/**
 * PRE-SAVE MIDDLEWARE
 * Automatically runs right before saving a new record to calculate the next due date.
 */
feeSchema.pre("save", function () {
  if (this.payment_date) {
    // Parse the baseline payment date string safely
    const baseDate = new Date(this.payment_date);
    
    // Programmatically push the calendar month forward by the exact number of months paid
    baseDate.setMonth(baseDate.getMonth() + (this.months_paid || 1));
    
    // Assign the generated timestamp to our new tracking property
    this.next_due_date = baseDate;
  }
  
});

export default mongoose.model("FeePayment", feeSchema);