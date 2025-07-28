import { Schema, model, Document, Types } from "mongoose";

export interface ISite extends Document {
  name: string;
  address: string;
  description: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  status: "active" | "paused" | "completed";
  supervisors: Types.ObjectId[];
  promoters: Types.ObjectId[];
  labours: Types.ObjectId[];
  customerName: string;
  tasks: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const siteSchema = new Schema<ISite>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    budget: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
    },
    supervisors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    promoters: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    labours: [
      {
        type: Schema.Types.ObjectId,
        ref: "Labour",
      },
    ],
    customerName: {
      type: String,
      required: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true, 
  }
);

export const Site = model<ISite>("Site", siteSchema);
