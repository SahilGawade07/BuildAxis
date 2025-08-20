import { Schema, model, Document, Types } from "mongoose";

// Interface: ITask
export interface ITask extends Document {
  title: string;
  site: Types.ObjectId; // Reference to Site model
  createdBy: Types.ObjectId; // Promoter who created
  supervisors: Types.ObjectId[]; // Multiple supervisors (User with role: 'supervisor')
  labourers: Types.ObjectId[]; // Multiple labourers (from Labour collection)
  status:
    | "open"
    | "in_progress"
    | "completed"
    | "verified"
    | "closed"
    | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  due: Date;
  inventoryUsed: Types.ObjectId[]; // Multiple inventory items
  description?: string;
  attachment?: string[]; // e.g., PDF, document
  images: string[]; // Array of image URLs
  progress: number; // Completion percentage: 0 to 100
}

// Schema: taskSchema
const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Site where task is assigned
    site: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },

    // Promoter who created the task
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Multiple supervisors assigned
    supervisors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // These should be users with role: 'supervisor'
      },
    ],

    // Multiple labourers assigned
    labourers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Labour", // Reference to Labour collection
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
      required: true,
    },

    // Multiple inventory items used in the task
    inventoryUsed: [
      {
        type: Schema.Types.ObjectId,
        ref: "Inventory",
      },
    ],

    description: {
      type: String,
      trim: true,
    },

    // Optional file (PDF, doc, etc.)
    attachment: [
      {
        type: String,
        trim: true,
      },
    ],

    // Array of image URLs taken/uploaded for the task
    images: [
      {
        type: String,
      },
    ],
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      validate: {
        validator: function (value: number) {
          return (
            Number.isInteger(value) || value === parseFloat(value.toFixed(1))
          );
        },
        message: "Progress must be a number with at most one decimal place.",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Export model
export const Task = model<ITask>("Task", taskSchema);
