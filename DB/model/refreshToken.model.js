import mongoose, { Schema, model, Types } from "mongoose";

const refreshTokenSchema = new Schema({
  owner: { type: Types.ObjectId, ref: "User" },
});

const refreshTokenModel = mongoose.models.RefreshToken || model("RefreshToken", refreshTokenSchema);
export default refreshTokenModel;
