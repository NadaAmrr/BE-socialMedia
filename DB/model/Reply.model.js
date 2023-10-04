import mongoose, { Schema, model, Types } from "mongoose";

const replySchema = new Schema(
  {
    // replyBody
    replyBody: { type: String, required: true },
    // createdBy ( objectId ref to user model )
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    // postId ( objectId ref to post model )
    postId: {
      type: Types.ObjectId,
      ref: "Post",
      required: true,
    },
    // commentId ( objectId ref to comment model )
    commentId: {
      type: Types.ObjectId,
      ref: "Comment",
      required: true,
    },
    // likes ( array of objectId ref to user model )
    likes: {
      type: [Types.ObjectId],
      ref: "User",
      default: [],
    },
    // likes ( array of objectId ref to user model )
    unlikes: {
      type: [Types.ObjectId],
      ref: "User",
      default: [],
    },
    // images "optional"
    images: {
      type: [{ secure_url: String, public_id: String }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const replyModel = mongoose.models.Reply || model("Reply", replySchema);
export default replyModel;
