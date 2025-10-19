import { model, Schema } from "mongoose";
import { TAccount } from "./auth.interface";

const authSchema = new Schema<TAccount>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    deviceToken: { type: String, requried: true },
  },
  {
    timestamps: true,
  }
);

export const Account_Model = model("auth", authSchema);
