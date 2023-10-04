import commentModel from "../../../../DB/model/Comment.model.js";
import postModel from "../../../../DB/model/Post.model.js";
import cloudinary from "../../../utils/cloudinary.js";

//====================== Add comment ======================
export const addComment = async (req, res, next) => {
  const { _id } = req.user;
  const { postId } = req.params;
  const { commentBody } = req.body;
  const post = await postModel.findById(postId);
  if (!post) {
    return next(new Error("Not found post", { cause: 404 }));
  }
  if (post.isDeleted) {
    return next(new Error("This is post deleted", { cause: 400 }));
  }
  //  Check privacy
  //  Owner add comment ==> private public - createdBy == _id
  //  Anyone add comment ==> public - createdBy != _id
  if (
    post.createdBy == _id ||
    (post.privacy == "public" && post.createdBy != req.user)
  ) {
    //create comment
    const comment = await commentModel.create({
      commentBody,
      postId: postId,
      createdBy: _id,
    });
    return res.status(200).json({ message: "Done", comment });
  } else {
    return next(
      new Error("This is post may be deleted", { cause: 403 })
    );
  }
};
//====================== Update Comment ======================
export const updateComment = async (req, res, next) => {
  const { _id } = req.user;
  const { postId, commentId } = req.params;
  const { commentBody } = req.body;
  //Find post
  const post = await postModel.findById(postId);
  if (!post) {
    return next(new Error("Not found post", { cause: 404 }));
  }
  //Post is deleted?
  if (post.isDeleted) {
    return next(
      new Error("You can not comment, this is post deleted", { cause: 400 })
    );
  }
  //check post privacy
  if (post.privacy == "private" && post.createdBy.toString() != req.user._id.toString()){
    return next(new Error("Unauthorized", { cause: 401 }));
  }
    //Update comment
    const commentUpdate = await commentModel.findOneAndUpdate(
      {
        _id: commentId,
        createdBy: _id,
      },
      { commentBody },
      { new: true }
    );
  if (!commentUpdate) {
    new Error("Not updated", { cause: 404 });
  }
  return res.status(200).json({ message: "Done", commentUpdate });
};
// ====================== Delete comment ======================
export const deleteComment = async (req, res, next) => {
  const { postId, commentId } = req.params;
  //check post
  const post = await postModel.findOne({ _id: postId });
  if (!post) {return next(new Error("Not found post", { cause: 404 }))}
  //check post privacy
  if (post.privacy == "private" && post.createdBy.toString() !== req.user) {
    return next(new Error("You are not authorized to delete this comment",{cause: 404}));
  }
  //delete comment
  const comment = await commentModel.findById(commentId);
  if (!comment) {new Error("Comment Not found", { cause: 404 })}
  if (comment.createdBy.toString() !== req.user._id) {
    return new Error("You are not authorized to delete this comment");
  }
  await comment.remove();
  return res
    .status(200)
    .json({ message: "Comment deleted successfully", comment });
};
//====================== Reactions comment (like) ======================
export const commentLike = async (req, res, next) => {
  const { _id } = req.user;
  const { commentId, postId } = req.params;
  const comment = await commentModel.findOneAndUpdate(
    {
      _id: commentId,
      postId: postId,
      likes: { $nin: [_id] },
    },
    {
      $push: { likes: _id },
      $pull: { unlikes: _id },
    },
    { new: true }
  );
  if (!comment) {
    return next(new Error("You are already liked or not found comment", { cause: 400 }));
  }
  const likeCounter = comment.likes.length;
  const unlikeCounter = comment.unlikes.length;
  return res.status(200).json({
    message: "Done",
    comment,
    likes: likeCounter,
    unlikes: unlikeCounter,
  });
};
//=========== Reactions comment (not like) ===========
export const commentUnLike = async (req, res, next) => {
  const { _id } = req.user;
  const { postId, commentId } = req.params;
  const comment = await commentModel.findOneAndUpdate(
    {
      _id: commentId,
      postId,
      unlikes: { $nin: [_id] },
    },
    {
      $push: { unlikes: _id },
      $pull: { likes: _id },
    },
    { new: true }
  );
  if (!comment) {
    return next(new Error("You are already unliked", { cause: 400 }));
  }
  const likeCounter = comment.likes.length;
  const unlikeCounter = comment.unlikes.length;
  return res.status(200).json({
    message: "Done",
    comment,
    likes: likeCounter,
    unlikes: unlikeCounter,
  });
};
