import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  serviceName: string;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema: Schema = new Schema(
  {
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model<IService>("Service", serviceSchema);
