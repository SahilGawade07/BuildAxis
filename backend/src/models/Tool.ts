import { Schema, model, Document, Types } from "mongoose";

export interface ITool extends Document {
  name: string;
  unit: string;
  quantity: number;
  site: Types.ObjectId;
  category: "owned" | "rented";
  vendor: Types.ObjectId;
  amount: number;
  remark?: string;
}

const toolSchema = new Schema<ITool>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    site: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    category: {
      type: String,
      enum: ["owned", "rented"],
      required: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    remark: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Tool = model<ITool>("Tool", toolSchema);
