import { Schema, model, Document, Types } from "mongoose";

export interface IExpense extends Document {
  siteId: Types.ObjectId;
  description: string;
  amount: number;
  date: Date;
  paidBy: Types.ObjectId;
  paymentMethod: "cash" | "card" | "UPI" | "bank transfer" | "cheque" | "other";
  category: "daily" | "tool" | "inventory" | "rental" | "other";
  receiptUrls?: string[]; // Multiple receipt images
  status: "fullyPaid" | "partiallyPaid" | "fullyUnpaid";
  vendor?: Types.ObjectId;
  tool?: Types.ObjectId; // Reference to Tool
  inventory?: Types.ObjectId; // Reference to Inventory
  dueAmount?: number;
  note?: string;
}

const expenseSchema = new Schema<IExpense>(
  {
    siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "UPI", "bank transfer", "cheque", "other"],
      required: true,
    },
    category: {
      type: String,
      enum: ["daily", "tool", "inventory", "rental", "other"],
      required: true,
    },
    receiptUrls: [{
      type: String,
    }],
    status: {
      type: String,
      enum: ["fullyPaid", "partiallyPaid", "fullyUnpaid"],
      default: "fullyPaid",
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
    },
    tool: {
      type: Schema.Types.ObjectId,
      ref: "Tool",
    },
    inventory: {
      type: Schema.Types.ObjectId,
      ref: "Inventory",
    },
    dueAmount: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Expense = model<IExpense>("Expense", expenseSchema);
