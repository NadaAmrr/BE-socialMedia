import commentModel from "../../../../DB/model/Comment.model.js";
import postModel from "../../../../DB/model/Post.model.js";
import replyModel from "../../../../DB/model/Reply.model.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
// ====================== Get Replyies of one comment ======================
export const getReplyies = async (req, res, next) => {
  const { postId, commentId } = req.params;
  const post = await postModel.findById(postId);
  if (!post) {
    return next(new Error("Not found post", { cause: 404 }));
  }
  if (
    post.privacy == "private" &&
    req.user._id.toString() != post.createdBy.toString()
  ) {
    return next(new Error("Unauthorized", { cause: 401 }));
  }
  const replies = await replyModel.find({ commentId });
  return res.status(200).json({ message: "Done", replies });
};
// ====================== Add Reply ======================
export const addReply = async (req, res, next) => {
  const { _id } = req.user;
  const { postId } = req.params;
  const { commentId } = req.params;
  const { replyBody } = req.body;
  //Check privacy of owner
  const privacy = await postModel.findById(postId);
  if (!privacy) {
    return next(new Error("Not found post", { cause: 404 }));
  }
  if (privacy.isDeleted) {
    return next(
      new Error("You can not comment, this is post deleted", { cause: 400 })
    );
  }
  if (privacy.privacy == "private") {
    return next(new Error("The post not found to add reply", { cause: 404 }));
  }
  const comment = await commentModel.findById(commentId);
  if (!comment) {
    return next(new Error("Not found comment", { cause: 404 }));
  }
  //create reply
  const reply = await replyModel.create({
    replyBody,
    commentId,
    postId,
    createdBy: _id,
  });
  return res.status(200).json({ message: "Done", reply });
};
//====================== Update reply ======================
export const updateReply = async (req, res, next) => {
  const { _id } = req.user;
  const { postId, commentId, replyId } = req.params;
  const { replyBody } = req.body;
  //Check privacy of owner
  const privacy = await postModel.findById(postId);
  if (!privacy) {
    return next(new Error("Not found post", { cause: 404 }));
  }
  if (privacy.privacy == "private") {
    return next(
      new Error("The post not found to update your reply", { cause: 404 })
    );
  }
  const comment = await commentModel.findById(commentId);
  if (!comment) {
    return next(new Error("Not found comment", { cause: 404 }));
  }
  //Post is deleted?
  if (post.isDeleted) {
    return next(
      new Error("You can not comment, this is post deleted", { cause: 400 })
    );
  }
  //Update reply
  const replyUpdate = await replyModel.findOneAndUpdate(
    {
      _id: replyId,
      createdBy: _id,
    },
    { replyUpdate },
    { new: true }
  );
  if (!replyId) {
    new Error("Not updated", { cause: 400 });
  }
  return res.status(200).json({ message: "Done", replyUpdate });
};
// ====================== Delete reply ======================
export const deleteReply = async (req, res, next) => {
  const { _id } = req.user;
  const { postId, commentId, replyId } = req.params;
  //Check privacy of owner post
  const privacy = await postModel.findById(postId);
  if (!privacy) {
    return next(new Error("Not found post", { cause: 404 }));
  }
  if (privacy.privacy == "private") {
    return next(
      new Error("The post not found to delete your reply", { cause: 404 })
    );
  }
  //delete Reply
  const replyDelete = await replyModel.findByIdAndDelete(
    {
      _id: replyId,
      postId,
      commentId,
      createdBy: _id,
    },
    { new: true }
  );
  if (!replyDelete) {
    new Error("Not updated", { cause: 400 });
  }
  return res.status(200).json({ message: "Done", replyDelete });
};
//====================== Reactions reply (like) ======================
export const replyLike = async (req, res, next) => {
  const { _id } = req.user;
  const { replyId, postId, commentId } = req.params;
  //Check privacy of owner post
  const privacy = await postModel.findById(postId);
  if (!privacy) {
    return next(new Error("Not found post", { cause: 404 }));
  }
  if (privacy.privacy == "private") {
    return next(new Error("The post not found to like reply", { cause: 404 }));
  }
  //update reply
  const reply = await replyModel.findOneAndUpdate(
    // Likes not contain userId
    {
      _id: replyId,
      postId,
      commentId,
      likes: { $nin: [_id] },
    },
    {
      $push: { likes: _id },
      $pull: { unlikes: _id },
    },
    { new: true }
  );
  if (!reply) {
    return next(new Error("You are already liked", { cause: 400 }));
  }
  const likeCounter = reply.likes.length;
  const unlikeCounter = reply.unlikes.length;
  return res.status(200).json({
    message: "Done",
    reply,
    likes: likeCounter,
    unlikes: unlikeCounter,
  });
};
//=========== Reactions reply (not like) ===========
export const replyUnLike = async (req, res, next) => {
  const { _id } = req.user;
  const { postId, commentId, replyId } = req.params;
  //Check privacy of owner post
  const privacy = await postModel.findById(postId);
  if (!privacy) {
    return next(new Error("Not found post", { cause: 404 }));
  }
  if (privacy.privacy == "private") {
    return next(
      new Error("The post not found to dislike reply", { cause: 404 })
    );
  }
  //update reply
  const reply = await replyModel.findOneAndUpdate(
    {
      _id: replyId,
      postId,
      commentId,
      unlikes: { $nin: [_id] },
    },
    {
      $push: { unlikes: _id },
      $pull: { likes: _id },
    },
    { new: true }
  );
  if (!reply) {
    return next(new Error("You are already unliked", { cause: 400 }));
  }
  const likeCounter = reply.likes.length;
  const unlikeCounter = reply.unlikes.length;
  return res.status(200).json({
    message: "Done",
    reply,
    likes: likeCounter,
    unlikes: unlikeCounter,
  });
};
