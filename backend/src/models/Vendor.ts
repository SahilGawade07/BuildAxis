import { Schema, model, Document, Types } from "mongoose";

export interface IVendor extends Document {
  vendorName: string;
  contactPerson: string;
  phoneNo: string;
  address: string;
  services: Types.ObjectId[];
  gstNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new Schema<IVendor>(
  {
    vendorName: {
      type: String,
      required: true,
      trim: true,
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    gstNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Vendor = model<IVendor>("Vendor", vendorSchema);
