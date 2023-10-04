import mongoose, { Schema, model, Types } from "mongoose";

const commentSchema = new Schema(
  {
    // commentBody
    commentBody: { type: String, required: true },
    // createdBy ( objectId ref to user model )
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    // PostId( objectId ref to post model )
    postId: { type: Types.ObjectId, ref: "Post", required: true },
    // images "optional"
    images: {
      type: [{ secure_url: String, public_id: String }],
      default: [],
    },
    // likes ( array of objectId ref to user model )
    likes: { type: [Types.ObjectId], ref: "User", default: [] },
    unlikes: { type: [Types.ObjectId], ref: "User", default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
commentSchema.virtual('replies', {
  localField: '_id',
  foreignField: 'commentId',
  ref: 'Reply'
})
const commentModel = mongoose.models.Comment || model("Comment", commentSchema);
export default commentModel;











    // replies ( array of objectId ref to reply model )
    // replies: {
    //   type: [Types.ObjectId],
    //   ref: "Reply",
    //   default: [],
    // },