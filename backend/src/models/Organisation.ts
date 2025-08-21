import { Schema, model, Document, Types } from "mongoose";

export interface IOrganisation extends Document {
  name: string;
  promoters: Types.ObjectId[];
  supervisorsId: Types.ObjectId[];
  labourId: Types.ObjectId[];
  siteId: Types.ObjectId[];
  vendor: Types.ObjectId[]; // renamed and updated
  email: string;
  phone: string;
  address: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const organisationSchema = new Schema<IOrganisation>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    promoters: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    supervisorsId: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    labourId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Labour",
      },
    ],
    siteId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Site",
      },
    ],
    vendor: [
      {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
      },
    ],
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Organisation = model<IOrganisation>(
  "Organisation",
  organisationSchema
);
