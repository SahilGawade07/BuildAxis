import { Schema, model, Document, Types } from "mongoose";

export interface IInventory extends Document {
  name: string;
  specification: string;
  siteId: Types.ObjectId;
  unit: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unitPrice: number;
  vendor: Types.ObjectId;
}

const inventorySchema = new Schema<IInventory>(
  { 
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specification: {
      type: String,
      trim: true,
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    minQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
    },
  },
  {
    timestamps: true,
  }
);

export const Inventory = model<IInventory>("Inventory", inventorySchema);
