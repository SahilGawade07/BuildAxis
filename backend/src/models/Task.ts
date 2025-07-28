import { Schema, model, Document, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  supervisors: Types.ObjectId[];
  images: string[];
  site: Types.ObjectId;
  createdBy: Types.ObjectId;
  assignedTo: Types.ObjectId;
  status:
    | "open"
    | "in_progress"
    | "completed"
    | "verified"
    | "closed"
    | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  due: Date;
  inventoryUsed: Types.ObjectId;
  description: string;
  attachment?: string;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    supervisors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    site: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: [
        "open",
        "in_progress",
        "completed",
        "verified",
        "closed",
        "cancelled",
      ],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    due: {
      type: Date,
    },
    inventoryUsed: {
      type: Schema.Types.ObjectId,
      ref: "Inventory",
    },
    description: {
      type: String,
    },
    attachment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Task = model<ITask>("Task", taskSchema);
