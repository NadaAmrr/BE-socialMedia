import { StatusCodes } from "http-status-codes";
import commentModel from "../../../../DB/model/Comment.model.js";
import postModel from "../../../../DB/model/Post.model.js";
import replyModel from "../../../../DB/model/Reply.model.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import cloudinary from "../../../utils/cloudinary.js";
import { ErrorClass } from "../../../utils/errorClass.js";
//====================== Add Post ======================
export const addPost = async (req, res, next) => {
  const { content, privacy } = req.body;
  const { _id } = req.user;
  const attachmentImg = [];
  const attachmentPdf = [];
  const attachmentVedio = [];
  //Image
  if (req.files.image) {
    for (const image of req.files.image) {
      console.log(req.files.image);
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        image.path,
        { folder: `social/post/${req.user._id}/images` }
      );
      attachmentImg.push({ secure_url, public_id });
    }
  }
  //video
  if (req.files.video) {
    for (const videoo of req.files.video) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        videoo.path,
        { folder: `social/post/${req.user._id}/videos`, resource_type: "video" }
      );
      attachmentVedio.push({ secure_url, public_id });
      // cloudinary.api.delete_resources_by_prefix(`social/post/${req.user._id}/`)
    }
  }
  //File(pdf)
  if (req.files.pdf) {
    for (const file of req.files.pdf) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `social/post/${req.user._id}//pdf` }
      );
      attachmentPdf.push({ secure_url, public_id });
    }
  }
  //create post
  const post = await postModel.create({
    content,
    images: attachmentImg,
    video: attachmentVedio,
    pdf: attachmentPdf,
    createdBy: _id,
    privacy,
  });
  return res.status(201).json({ message: "Done", post });
};
//====================== Delete post ======================
export const deletePost = async (req, res, next) => {
  // Check if user is authorized to delete post
  const post = await postModel.findById(req.params.id);
  if (!post) {
    return next(new ErrorClass("Not found", StatusCodes.NOT_FOUND));
  }
  if (req.user._id.toString() != post.createdBy.toString()) {
    return next(new ErrorClass("Unauthorized", StatusCodes.UNAUTHORIZED));
  }
  //Delete images from cloudinary
  if (post.images) {
    console.log(post.images);
    for (let i = 0; i < post.images.length; i++) {
      await cloudinary.uploader
        .destroy(post.images[i].public_id)
        .then((result) => console.log(result));
    }
  }
  //Delete vedios from cloudinary
  if (post.video) {
    for (let i = 0; i < post.video.length; i++) {
      await cloudinary.api
        .delete_resources(post.video[i].public_id, { resource_type: "video" })
        .then((result) => console.log(result));
    }
  }
  //Delete post & comments & replyies
  const postDelete = await postModel.findByIdAndDelete(req.params.id);
  const comment = await commentModel.deleteMany({ postId: req.params.id });
  await replyModel.deleteMany({
    postId: req.params.id,
    commentId: comment._id,
  });
  return res.status(200).json({ message: "done", postDelete });
};
//====================== Soft delete ======================
export const softDelete = async (req, res, next) => {
  const { id } = req.params;
  const post = await postModel.findOneAndUpdate(
    { _id: id, createdBy: req.user._id },
    { isDeleted: true },
    { new: true }
  );
  if (!post) {
    return next(new ErrorClass("Not found", StatusCodes.NOT_FOUND));
  }
  if (req.user._id.toString() != post.createdBy.toString()) {
    return next(new ErrorClass("Unauthorized", StatusCodes.UNAUTHORIZED));
  }
  return res.status(200).json({ message: "done", post });
};
//====================== Update post ======================
export const updatePost = async (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;
  const { content, privacy } = req.body;
  const attachmentImg = [];
  const attachmentPdf = [];
  const attachmentVedio = [];
  const post = await postModel.findById(id);
  // Check if user is authorized to update post
  if (post.createdBy.toString() !== _id.toString()) {
    return next(new ErrorClass("Unauthorized", StatusCodes.UNAUTHORIZED));
  }
  // Check if post is soft deleted
  if (post.isDeleted || !post) {
    return next(new ErrorClass("This is post deleted or not found", StatusCodes.NOT_FOUND));
  }
  //Upload Image in cloudinary
  if (req.files.image) {
    for (const image of req.files.image) {
      console.log(req.files.image);
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        image.path,
        { folder: `social/post/${req.user._id}/images` }
      );
      attachmentImg.push({ secure_url, public_id });
    }
  }
  //Upload video in cloudinary
  if (req.files.video) {
    for (const videoo of req.files.video) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        videoo.path,
        { folder: `social/post/${req.user._id}/videos`, resource_type: "video" }
      );
      attachmentVedio.push({ secure_url, public_id });
    }
  }
  //Upload file(pdf) in cloudinary
  if (req.files.pdf) {
    for (const file of req.files.pdf) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `social/post/${req.user._id}//pdf` }
      );
      attachmentPdf.push({ secure_url, public_id });
    }
  }
  const postUpdate = await postModel.findOneAndUpdate(
    { _id: id, createdBy: _id },
    {
      content,
      privacy,
      images: attachmentImg,
      video: attachmentVedio,
      pdf: attachmentPdf,
    },
    { new: true }
  );
  return res.status(201).json({ message: "Done", postUpdate });
};
//====================== Update post ( privecy) ======================
export const updatePostPrivecy = async (req, res, next) => {
  const { privacy } = req.body;
  const post = await postModel.updateOne({ _id: req.params.id }, { privacy });
  if (!post) {
    return next(new ErrorClass("Not updated privacy", StatusCodes.BAD_REQUEST));
  }
  return res.status(200).json({ message: "Done", post });
};
//====================== Reactions Post (like) ======================
export const postLike = async (req, res, next) => {
  const { _id } = req.user;
  const { postId } = req.params;
  const post = await postModel.findOneAndUpdate(
    // Likes not contain userId
    {
      _id: postId,
      likes: { $nin: [_id] }
      ,
      unlikes: { $in: [_id] }
    },
    {
      $push: { likes: _id },
      $pull: { unlikes: _id },
    },
    { new: true }
  );
  if (!post) {
    return next(new ErrorClass("You are already liked", StatusCodes.BAD_REQUEST));
  }
  const likeCounter = post.likes.length;
  const unlikeCounter = post.unlikes.length;
  return res.status(200).json({
    message: "Done",
    post,
    likes: likeCounter,
    unlikes: unlikeCounter,
  });
};
//====================== Reactions Post (not like) ======================
export const postUnLike = async (req, res, next) => {
  const { _id } = req.user;
  const { postId } = req.params;
  //update post
  const post = await postModel.findOneAndUpdate(
    { _id: postId, 
      unlikes: { $nin: [_id] }, 
      likes: { $in: [_id] }
     },
    {
      $push: { unlikes: _id },
      $pull: { likes: _id },
    },
    { new: true }
  );
  if (!post) {
    return next(new ErrorClass("You are already unliked", StatusCodes.BAD_REQUEST));
  }
  const likeCounter = post.likes.length;
  const unlikeCounter = post.unlikes.length;
  return res.status(200).json({
    message: "Done",
    post,
    likes: likeCounter,
    unlikes: unlikeCounter,
  });
};
//====================== get posts created yesterday ======================
export const getYesterdayPosts = async (req, res, next) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayFrom = yesterday.setHours(0, 0, 0);
  const yesterdayTo = yesterday.setHours(23, 59, 59);
  const posts = postModel
    .find({
      createdAt: {
        $gte: yesterdayFrom,
        $lt: yesterdayTo
        // $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
        // $lt: new Date(new Date().setDate(new Date().getDate())),
      },
      privacy: "public",
    })
    .populate([
      {
        path: "createdBy",
        select: ["name"],
      },
      {
        path: "comments",
        select: ["commentBody", "createdBy", "images", "replies", "likes"],
        populate: [
          {
            path: "replies",
          },
        ],
      },
    ]);
  const apiFeature = new ApiFeatures(posts, req.query)
    .pagination()
    .filter()
    .sort()
    .search()
    .select();
    const result = await apiFeature.mongooseQuery;
    const totalPages = await postModel.countDocuments();
    const { page } = apiFeature.queryData;
    let previousPage = page - 1;
    if (previousPage <= 0) {
      previousPage = "No previous page";
    }
    return res.status(200).json({
    message: "done",
    TotalPages: parseInt(totalPages),
    currentPage: page,
    nextPage: Number(page) + 1,
    previousPage,
    result,
  });
};
//====================== get posts created today ======================
export const getTodayPosts = async (req, res, next) => {
  const posts = postModel
    .find({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59)),
      },
      privacy: "public",
    })
    .populate([
      {
        path: "createdBy",
        select: ["name"],
      },
      {
        path: "comments",
        select: ["commentBody", "createdBy", "images", "replies", "likes"],
        populate: [
          {
            path: "replies",
          },
        ],
      },
    ]);
  const total = await postModel.countDocuments();
  console.log(total);
  const apiFeature = new ApiFeatures(posts, req.query)
    .pagination(postModel)
    .filter()
    .sort()
    .search()
    .select();
  const result = await apiFeature.mongooseQuery;
  const totalPages = await postModel.countDocuments();
  const { page } = apiFeature.queryData;
  let previousPage = page - 1;
  if (previousPage <= 0) {
    previousPage = "No previous page";
  }
  return res.status(200).json({
    message: "done",
    TotalPages: parseInt(totalPages),
    currentPage: page,
    nextPage: Number(page) + 1,
    previousPage,
    result,
  });
};
//====================== Get all posts with their comments ======================
export const getPosts = async (req, res, next) => {
  const posts = postModel.find().populate([
    {
      path: "createdBy",
      select: ["name"],
    },
    {
      path: "comments",
      select: ["commentBody", "createdBy", "images", "replies", "likes"],
      populate: [
        {
          path: "replies",
        },
      ],
    },
  ]);
  const apiFeature = new ApiFeatures(posts, req.query)
    .pagination()
    .filter()
    .sort()
    .search()
    .select();
  const result = await apiFeature.mongooseQuery;
  const totalPages = await postModel.countDocuments();
  const { page } = apiFeature.queryData;
  let previousPage = page - 1;
  if (previousPage <= 0) {
    previousPage = "No previous page";
  }
  return res.status(200).json({
    message: "done",
    TotalPages: parseInt(totalPages),
    currentPage: page,
    nextPage: Number(page) + 1,
    previousPage,
    result,
  });
};
//====================== Get one post ======================
export const getOnePost = async (req, res, next) => {
  const { postId } = req.params;
  const post = postModel
    .findOne({
      _id: postId,
      $or: [
        { createdBy: req.user._id },
        { privacy: "public", createdBy: { $ne: req.user._id } },
      ],
    })
    .populate([
      {
        path: "createdBy",
        select: ["name"],
      },
      {
        path: "comments",
        select: ["commentBody", "createdBy", "replies", "likes"],
        populate: [
          {
            path: "replies",
          },
        ],
      },
    ]);
  const apiFeature = new ApiFeatures(post, req.query)
    .pagination()
    .filter()
    .sort()
    .search()
    .select();
  const result = await apiFeature.mongooseQuery;
  const totalPages = await postModel.countDocuments();
  const { page } = apiFeature.queryData;
  let previousPage = page - 1;
  if (previousPage <= 0) {
    previousPage = "No previous page";
  }
  if (!result) {
    return next(new ErrorClass("Not found or Unauthorized", StatusCodes.NOT_FOUND));
  }
  return res
    .status(200)
    .json({
      message: "done",
      TotalPages: parseInt(totalPages),
      currentPage: page,
      nextPage: Number(page) + 1,
      previousPage,
      result,
    });
};
