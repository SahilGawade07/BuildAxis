import { Schema, model, Document, Types } from "mongoose";

export interface ILabour extends Document {
  fName: string;
  lName: string;
  profilePic: string;
  phone: number;
  documentsUrl: string[];
  orgId: Types.ObjectId;
  work: string;
  createdAt: Date;
  updatedAt: Date;
}

const labourSchema = new Schema<ILabour>(
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
    profilePic: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    documentsUrl: [
      {
        type: String,
      },
    ],
    orgId: { type: Schema.Types.ObjectId, ref: "Organisation" },

    work: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export const Labour = model<ILabour>("Labour", labourSchema);
