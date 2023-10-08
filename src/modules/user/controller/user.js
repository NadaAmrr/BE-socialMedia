import userModel from "../../../../DB/model/User.model.js";
import postModel from "../../../../DB/model/Post.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from "http-status-codes";
import sendEmail from "../../../utils/email.js";
import { createHtml, linkBtn } from "../../../utils/emailHTML.js";
import {
  compare,
  decryptData,
  encryptData,
  hash,
} from "../../../utils/HashAndEncrypt.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/generateAndVerifyToken.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
//====================== Update password
export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { password } = req.user;
  const oldPasswordDB = password;
  const time = Date.now()
  const iatToken = req.time
  console.log({tokeniat: iatToken , time});
  console.log(time);
  // password matched ?
  const match = compare({ plaintext: oldPassword, hashValue: oldPasswordDB });
  if (!match) {
    return next(new Error("Check your old password", { cause: 400 }));
  }
  //Hash new password
  const hashNewPassword = hash({ plaintext: newPassword });
  const user = await userModel.updateOne(
    { _id: req.user._id },
    {password: hashNewPassword , updatedTime: Date.now() }
  );
  if (!user) {
    return next(new Error("Not Updated", { cause: 400 }));
  }
  return res.status(StatusCodes.ACCEPTED).json({ message: "done" });
};
//====================== Soft delete profile
export const softDelete = async (req, res) => {
  const user = await userModel.updateOne(
    { _id: req.user._id },
    { isDeleted: true },
    { new: true }
  );
  if (!user) {
    return next(new Error("In-valid user data", { cause: 400 }));
  } else {
    return res.status(StatusCodes.OK).json({ message: "done", user });
  }
};
//====================== Cover pictures
export const coverPicture = async (req, res, next) => {
  const { _id } = req.user;
  const imagesBefore = req.user.coverImages;
  const attachmentImg = [];
  if (imagesBefore) {
    for (let i = 0; i < imagesBefore.length; i++) {
      const { secure_url, public_id, _id } = imagesBefore[i];
      attachmentImg.push({ secure_url, public_id, _id });
    }
  }
  if (req.files.image) {
    for (const image of req.files.image) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        image.path,
        { folder: `social/profile/${req.user._id}/coverImages` }
      );
      attachmentImg.push({ secure_url, public_id });
    }
  }
  const update = await userModel.findOneAndUpdate(
    { _id },
    { coverImages: attachmentImg },
    { new: true }
  );
  return res.status(200).json({ message: "Done", update });
};
//====================== Get Profile
export const getProfile = async (req, res) => {
  const user = req.user;
  const posts = postModel
    .find({
      createdBy: req.user._id,
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
    const apiFeature = new ApiFeatures( posts ,req.query).pagination().filter().sort().search().select()
    const result = await apiFeature.mongooseQuery;
    const totalPages = await postModel.countDocuments();
    const { page } = apiFeature.queryData;
    let previousPage = page - 1;
    if (previousPage <= 0) {
      previousPage = "No previous page";
    } 
    return res
    .status(StatusCodes.OK)
    .json({
      message: "done",
      user,
      TotalPages: parseInt(totalPages),
      currentPage: page,
      nextPage: Number(page) + 1,
      previousPage,
      result,
    });
};
//====================== Update profile
export const updateProfile = async (req, res) => {
  const { name, age, gender, newEmail } = req.body;
  let { phone } = req.body;
  let newPhone = req.user.phone;
  if (phone) {
    newPhone = encryptData(phone);
  }
  if (newEmail) {
    const iEmailExist = await userModel.findOne({
      email: newEmail,
      _id: { $ne: _id },
    });
    if (iEmailExist) {
      return next(
        new ErrorClass(
          `The Email ${newEmail} already exists`,
          StatusCodes.CONFLICT
        )
      );
    }
    await userModel.updateOne({ _id: req.user._id }, { confirmEmail: false });
    // Send confirmation email
    await sendEmail({
      to: newEmail,
      subject: "Confirm Email",
      html: createHtml(
        `${linkBtn(
          `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`,
          "Verify Email address",
          "Use the following button to confirm your email"
        )}`,
        `${linkBtn(
          `${req.protocol}://${req.headers.host}/auth/requestNewConfirmEmail/${tokenNewReq}`,
          "New verify Email address",
          "If you have trouble using the button above, please click the following button"
        )}`,
        `${linkBtn(
          `${req.protocol}://${req.headers.host}/auth/unsubscribe/${tokenUnsubscribe}`,
          "unsubscribe",
          "If you did not create account, please click in the unsubscribe button"
        )}`,
        "Email Confirmation"
      ),
    });
  }
  const user = await userModel.updateOne(
    { _id: req.user._id },
    {
      firstName,
      lastName,
      phone: newPhone,
      age,
      gender,
      email: newEmail,
    }
  );
  return res.status(StatusCodes.OK).json({ message: "done", user });
};
//====================== Update email
export const updateEmail = async (req, res) => {
  const user = req.user;
  const { _id, email } = req.user;
  const { newEmail } = req.body;
  if (newEmail.toString() == email.toString()) {
    return res.status(StatusCodes.OK).json({ message: "The same email" });
  }
  const isEmailExist = await userModel.findOne({
    email: newEmail,
    _id: { $ne: _id },
  });
  if (isEmailExist) {
    console.log(isEmailExist);
    return next(
      new ErrorClass(
        `The Email ${newEmail} already exists`,
        StatusCodes.CONFLICT
      )
    );
  } else {
    await userModel.updateOne({ _id: req.user._id }, { confirmEmail: false });
    // Generate token for confirm email
    const token = generateToken({
      payload: { id: user._id, email: user.email },
      signature: process.env.EMAIL_SIGNATURE,
      expiresIn: 60 * 15,
    });
    // Generate token for New confirm email
    const tokenNewReq = generateToken({
      payload: { id: user._id, email: user.email },
      signature: process.env.EMAIL_SIGNATURE,
      expiresIn: "2d",
    });
    // Generate token for unsubscribe
    const tokenUnsubscribe = generateToken({
      payload: { id: user._id, email: user.email },
      signature: process.env.EMAIL_SIGNATURE,
      expiresIn: "1m",
    });
    // Send confirmation email
    await sendEmail({
      to: newEmail,
      subject: "Confirm Email",
      html: createHtml(
        `${linkBtn(
          `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`,
          "Verify Email address",
          "Use the following button to confirm your email"
        )}`,
        `${linkBtn(
          `${req.protocol}://${req.headers.host}/auth/requestNewConfirmEmail/${tokenNewReq}`,
          "New verify Email address",
          "If you have trouble using the button above, please click the following button"
        )}`,
        `${linkBtn(
          `${req.protocol}://${req.headers.host}/auth/unsubscribe/${tokenUnsubscribe}`,
          "unsubscribe",
          "If you did not create account, please click in the unsubscribe button"
        )}`,
        "Email Confirmation"
      ),
    });
    const updateEmail = await userModel.updateOne({ _id }, { email: newEmail });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Check your email", updateEmail });
  }
};
//====================== Profile picture
export const profilePicture = async (req, res, next) => {
  const { _id } = req.user;
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.image[0].path,
    { folder: `social/profile/${req.user._id}/profileImage` }
  );
  //check if user have before profile picture
  if (req.user.profileImage) {
    // Delete privaus one from cloudinary
    await cloudinary.uploader.destroy(req.user.profileImage.public_id);
  }
  // Upload the new image
  const update = await userModel.findOneAndUpdate(
    { _id },
    { profileImage: { secure_url, public_id } },
    { new: true }
  );
  return res.status(200).json({ message: "Done", update });
};
//====================== Delete Cover images in the same time
export const deleteCoverPicture = async (req, res, next) => {
  await cloudinary.api.delete_resources_by_prefix(
    `social/post/${req.user._id}/coverImages`,
    (err) => {
      if (err) console.log(err);
    }
  );
  await cloudinary.api.delete_folder(
    `social/post/${req.user._id}/coverImages`,
    (err) => {
      if (err) console.log(err);
    }
  );
  return res.status(200).json({ message: "Done", user });
};
//====================== Logout
export const logout = async (req, res) => {
  const user = await userModel.updateOne(
    { _id: req.user._id },
    { isOnline: false },
    { new: true }
  );
  if (!user) {
    return next(new Error("In-valid user id", { cause: 400 }));
  } else {
    return res.status(StatusCodes.OK).json({ message: "done", user });
  }
};
