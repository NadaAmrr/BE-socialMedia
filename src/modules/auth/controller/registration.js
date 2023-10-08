import userModel from "../../../../DB/model/User.model.js";
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from "http-status-codes";
import jwt from "jsonwebtoken";
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
  accessTokenFun,
  refreshTokenFun
} from "../../../utils/generateAndVerifyToken.js";
import { nanoid } from "nanoid";
import refreshTokenModel from "../../../../DB/model/refreshToken.model.js";
//====================== Sign up ======================
export const signup = async (req, res, next) => {
  let { name, email, password, age, phone } = req.body;
  // Find User (email)
  const checkUser = await userModel.findOne({ email });
  if (checkUser) {
    return next(
      new Error(`this email ${email} already exists`, { cause: 400 })
    );
  }
  // Encrypt phone
  phone = encryptData(phone);
  console.log({ phone_enc: phone });
  // Hash password
  const hashpassword = hash({ plaintext: password });
  // Create User
  const user = new userModel({
    name,
    email,
    password: hashpassword,
    age,
    phone,
  });
  user.save();
  //Refresh token 
  await refreshTokenModel.create({owner: user._id})
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
    to: user.email,
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
  return res.status(201).json({ message: "Done", user });
};
//====================== Confirm Email ======================
export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.EMAIL_SIGNATURE);
  // Update confirm Email to be true
  const user = await userModel.findByIdAndUpdate(decoded.id, {
    confirmEmail: true,
  });
  return user
    ? //  res.redirect("")
      res.status(200).json({ message: "Done" })
    : next(new Error("Not register account", { cause: 404 }));
};
//====================== New Confirm Email ======================
export const newConfirmEmail = async (req, res, next) => {
  const { token } = req.params;

  const decoded = jwt.verify(token, process.env.EMAIL_SIGNATURE);

  const user = await userModel.findById(decoded.id);

  if (!user) {
    return res.send("<a>Ops you look like do not have account</a>");
  }
  // user is confirmed email?
  if (user.confirmEmail) {
    return res.send("<a>Go to login page</a>");
  }
  // generate token
  const newtoken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.EMAIL_SIGNATURE,
    { expiresIn: 60 * 3 }
  );
  //send email
  await sendEmail({
    to: user.email,
    subject: "Confirm Email",
    html: createHtml(
      `${linkBtn(
        `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newtoken}`,
        "Verify Email address"
      )}`,
      ``,
      ``,
      "New Email Confirmation"
    ),
  });
  return res.send(`<p>Check your inbox now</p>`);
};
//====================== login ======================
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  // Find user by email
  const user = await userModel.findOne({ email });
  //check user
  if (!user) {
    return next(new Error("In-valid login data", { cause: 404 }));
  }
  //check if user is email confirmed true?
  if (!user.confirmEmail) {
    return next(new Error("You have to confirm your Email", { cause: 404 }));
  }
  // password matched ?
  const match = compare({ plaintext: password, hashValue: user.password });
  if (!match) {
    return next(new Error("In-valid login data", { cause: 400 }));
  }
  // const refreshToken = refreshTokenFun(user._id , createRefreshToken._id)
  const accessToken = accessTokenFun({id: user._id , email:user.email} )
  const refreshToken = refreshTokenFun({id: user._id , email:user.email} )
 
  user.isOnline = true;
  await user.save();
  return res.status(StatusCodes.OK).json({ message: "Done", accessToken, refreshToken });
};
//====================== unsubscribe ======================
export const unsubscribe = async (req, res, next) => {
  const { token } = req.params;

  const decoded = jwt.verify(token, process.env.EMAIL_SIGNATURE);

  if (!decoded?.id) {
    return next(new Error("In-valid Payload", { cause: 400 }));
  }
  // Find user by id
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new Error("Not register account", { cause: 401 }));
  }
  // check if email confirmed
  if (!user.confirmEmail) {
    const deleteUser = await userModel.deleteOne({ _id: decoded.id });

    return res.send({ message: "Account deleted", deleteUser });
  } else if (user.confirmEmail) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "You Can not deleted your account and your account confirmed",
    });
  }
};
//====================== forget Password ======================
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  //Find user (email)
  const user = await userModel.findOne({ email });
  // check user
  if (!user) {
    return next(new Error("invalid user data", StatusCodes.BAD_REQUEST));
  }
  //check if user is email confirmed true?
  if (!user.confirmEmail) {
    return next(new Error("You have to confirm your Email", { cause: 404 }));
  }
  //Expire date for code OTP
  const expiresAt = Date.now() + 120000; // 2 minutes from now
  //Generate code
  const code = nanoid(6);
  // Send code
  await sendEmail({
    to: user.email,
    subject: "Forget password",
    html: createHtml(
      `${linkBtn(
        ``,
        `${code}`,
        `${code} Do not share this OTO with anyone, It will expired`
      )}`,
      ``,
      ``,
      "Forget password"
    ),
  });
  await userModel.updateOne({ email }, { code , expCode: expiresAt });
  res.status(StatusCodes.ACCEPTED).json({ message: "Check your email" });
};
//====================== Reset password ======================
export const resetPassword = async (req, res, next) => {
  let { code, password, email } = req.body;
  //Find user(email)
  let user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("invalid user information", StatusCodes.BAD_REQUEST));
  }
  //check if user is email confirmed true?
  if (!user.confirmEmail) {
    return next(new Error("You have to confirm your Email", { cause: 400 }));
  }
  //Check if code is expired
  if (Date.now() > user.expCode.getTime() ) {
    return next(new Error("invalid code or expired code", StatusCodes.BAD_REQUEST));
  }
  //check code
  if (code != user.code) {
    return next(new Error("in-valid code", StatusCodes.NOT_ACCEPTABLE));
  }
  //Hash new password
  password = hash({ plaintext: password });
  //create new code
  const newCode = nanoid(6);
  //update user
  await userModel.updateOne(
    { _id: user._id },
    { password, code: newCode, updatedTime: Date.now() }
  );
  res.status(StatusCodes.ACCEPTED).json({ message: "done" });
};
//====================== New Refresh Token ======================
export const refreshToken = async(req,res,next)=>{
  const { refreshToken } = req.body;
  if (!refreshToken?.startsWith(process.env.BEARER_KEY)) {
    return next(
      new Error("authorization is required or in-valid BearerKey", {
        cause: 400,
      })
    );
  }
  const token = refreshToken.split(process.env.BEARER_KEY)[1];
  if (!token) {
    return next(new Error("Access Denied. No refresh token provided", StatusCodes.BAD_REQUEST));
  }
  const decoded = jwt.verify(token , process.env.REFRESH_TOKEN_SECRET)
  if (!decoded) {
    return next(new Error("In-valid refresh token", StatusCodes.BAD_REQUEST));
  }
  const accessToken = accessTokenFun({id: decoded._id , email:decoded.email} )
  res.status(StatusCodes.ACCEPTED).json({ accessToken });
  res.header('authorization', `Hamada__${accessToken}`)
}
