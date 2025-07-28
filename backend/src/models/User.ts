import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  sites: Types.ObjectId[];
  role: "promoter" | "supervisor";
  profilePic?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fName: {
      type: String,
      required: true,
      trim: true,
    },
    lName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Site",
      },
    ],
    role: {
      type: String,
      enum: ["promoter", "supervisor"],
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);
