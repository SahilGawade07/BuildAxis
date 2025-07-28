import { Schema, model, Document, Types } from "mongoose";

export interface ILabourAttendance extends Document {
  labourId: Types.ObjectId;
  siteId: Types.ObjectId;
  verifiedBy: Types.ObjectId;
  date: Date;
  status: "present" | "absent" | "half_day" | "late" | "on_leave";
  remark?: string;
  createdAt: Date;
  updatedAt: Date;
}

const labourAttendanceSchema = new Schema<ILabourAttendance>(
  {
    labourId: {
      type: Schema.Types.ObjectId,
      ref: "Labour",
      required: true,
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "half_day", "late", "on_leave"],
      required: true,
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

export const LabourAttendance = model<ILabourAttendance>(
  "LabourAttendance",
  labourAttendanceSchema
);
