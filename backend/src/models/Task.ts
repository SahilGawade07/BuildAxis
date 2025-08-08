import { Schema, model, Document, Types } from "mongoose";

// ✅ Update interface to support arrays and multiple assignment types
export interface ITask extends Document {
  title: string;
  supervisors: Types.ObjectId[]; // Oversight: who is supervising the task
  images: string[];
  site: Types.ObjectId;
  createdBy: Types.ObjectId;

  // ✅ Replace single `assignedTo` with two arrays
  assignedToSupervisors: Types.ObjectId[]; // Task is assigned TO these supervisors (Users)
  assignedToLabourers: Types.ObjectId[]; // Task is assigned TO these labourers

  status:
    | "open"
    | "in_progress"
    | "completed"
    | "verified"
    | "closed"
    | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  due: Date;
  inventoryUsed: Array<{ item: Types.ObjectId; quantity: number }>; // Better structure
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

    // Supervisors who oversee the task
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

    // ✅ New: Multiple supervisors can be assigned to the task
    assignedToSupervisors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ✅ New: Multiple labourers can be assigned to the task
    assignedToLabourers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Labour", // Make sure "Labour" model is registered
      },
    ],

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

    // ✅ Improved: inventoryUsed as array of objects
    inventoryUsed: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

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
