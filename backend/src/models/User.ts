import { Schema, model, Document, Types, Model } from "mongoose";
import bcrypt from "bcrypt";

// 1. Define methods in a separate interface
interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
}

// 2. Extend your IUser and Document with methods
export interface IUser extends Document {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  password: string;
  sites: Types.ObjectId[];
  role: "promoter" | "supervisor";
  profilePic?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 3. Define the model type with methods
type UserModel = Model<IUser, {}, IUserMethods>;

// 4. Schema definition
const userSchema = new Schema<IUser, UserModel>(
  {
    fName: { type: String, required: true, trim: true },
    lName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    sites: [{ type: Schema.Types.ObjectId, ref: "Site" }],
    role: { type: String, enum: ["promoter", "supervisor"], required: true },
    profilePic: { type: String, default: "" },
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.method("isPasswordCorrect", async function (password: string) {
  return bcrypt.compare(password, this.password);
});

export const User = model<IUser, UserModel>("User", userSchema);
