import { Schema, model, Document } from "mongoose";

export interface ILabour extends Document {
  fName: string;
  lName: string;
  phoneNo: number;
  documentsUrl: string[];
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
    phoneNo: {
      type: Number,
      required: true,
      unique: true,
    },
    documentsUrl: [
      {
        type: String,
      },
    ],
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
