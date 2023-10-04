import mongoose, { Schema, model, Types } from "mongoose";

// Create Schema
const postSchema = new Schema(
  {
    // content
    content: {
      type: String,
      required: true,
    },
    // images "optional"
    images: {
      type: [{ secure_url: String, public_id: String }],
      default: [],
    },
    // video "optional"
    video: {
      type: [{ secure_url: String, public_id: String }],
      default: [],
    },
    // pdf "optional"
    pdf: {
      type: [{ secure_url: String, public_id: String }],
      default: [],
    },
    // likes ( array of objectId ref to user model )
    likes: {
      type: [Types.ObjectId],
      ref: "User",
      default: [],
    },
    // unlikes ( array of objectId ref to user model )
    unlikes: {
      type: [Types.ObjectId],
      ref: "User",
      default: [],
    },
    // createdBy ( objectId ref to user model )
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    // privacy (only me or public) default public
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    // isDeleted
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
postSchema.virtual('comments', {
  localField: '_id',
  foreignField: 'postId',
  ref: 'Comment'
})

const postModel = mongoose.model.Post || model("Post", postSchema);
export default postModel;







    // // comments ( array of objectIds ref to comment model )
    // comments: {
    //   type: [Types.ObjectId],
    //   ref: "Comment",
    //   default: [],
    // },