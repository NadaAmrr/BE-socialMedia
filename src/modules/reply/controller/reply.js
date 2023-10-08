import commentModel from "../../../../DB/model/Comment.model.js";
import postModel from "../../../../DB/model/Post.model.js";
import replyModel from "../../../../DB/model/Reply.model.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from "http-status-codes";
// ====================== Get Replyies of one comment ======================
export const getReplyies = async (req, res, next) => {
  const { postId, commentId } = req.params;
  const post = await postModel.findById(postId);
  if (!post) {
    return next(new ErrorClass("Not found post", StatusCodes.BAD_REQUEST));
  }
  if (
    post.privacy == "private" &&
    req.user._id.toString() != post.createdBy.toString()
  ) {
    return next(new ErrorClass("Unauthorized",  StatusCodes.UNAUTHORIZED));
  }
  const replies = replyModel.find({ commentId });
  const apiFeature = new ApiFeatures( replies ,req.query).pagination().filter().sort().search().select()
  const result = await apiFeature.mongooseQuery;
  const totalPages = await postModel.countDocuments();
  const { page } = apiFeature.queryData;
  let previousPage = page - 1;
  if (previousPage <= 0) {
    previousPage = "No previous page";
  } 
  return res
    .status(200)
    .json({
      message: "Done",
      TotalPages: parseInt(totalPages),
      currentPage: page,
      nextPage: Number(page) + 1,
      previousPage,
      result,
    });
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
    return next(new ErrorClass("Not found post", StatusCodes.NOT_FOUND));
  }
  if (privacy.isDeleted) {
    return next(
      new ErrorClass("You can not comment, this is post deleted", StatusCodes.BAD_REQUEST)
    );
  }
  if (privacy.privacy == "private") {
    return next(new ErrorClass("The post not found to add reply", StatusCodes.NOT_FOUND));
  }
  const comment = await commentModel.findById(commentId);
  if (!comment) {
    return next(new ErrorClass("Not found comment", StatusCodes.NOT_FOUND));
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
    return next(new ErrorClass("Not found post", StatusCodes.NOT_FOUND));
  }
  if (privacy.privacy == "private") {
    return next(
      new ErrorClass("The post not found to update your reply", StatusCodes.NOT_FOUND)
    );
  }
  const comment = await commentModel.findById(commentId);
  if (!comment) {
    return next(new ErrorClass("Not found comment", StatusCodes.NOT_FOUND));
  }
  //Post is deleted?
  if (post.isDeleted) {
    return next(
      new ErrorClass("You can not comment, this is post deleted", StatusCodes.BAD_REQUEST)
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
    new ErrorClass("Not updated", StatusCodes.BAD_REQUEST);
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
    return next(new ErrorClass("Not found post", StatusCodes.NOT_FOUND));
  }
  if (privacy.privacy == "private") {
    return next(
      new ErrorClass("The post not found to delete your reply", StatusCodes.NOT_FOUND)
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
    new ErrorClass("Not updated", StatusCodes.BAD_REQUEST);
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
    return next(new ErrorClass("Not found post", StatusCodes.NOT_FOUND));
  }
  if (privacy.privacy == "private") {
    return next(new ErrorClass("The post not found to like reply", StatusCodes.NOT_FOUND));
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
    return next(new ErrorClass("You are already liked", StatusCodes.BAD_REQUEST));
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
    return next(new ErrorClass("Not found post", StatusCodes.NOT_FOUND));
  }
  if (privacy.privacy == "private") {
    return next(
      new ErrorClass("The post not found to dislike reply", StatusCodes.NOT_FOUND)
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
    return next(new ErrorClass("You are already unliked", StatusCodes.BAD_REQUEST));
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
