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

    amount: Number,
    payment_date: String,
  },
  { timestamps: true }
);

export default mongoose.model("FeePayment", feeSchema);