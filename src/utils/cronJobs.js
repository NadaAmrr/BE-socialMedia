import schedule from "node-schedule";
import sendEmail from "./../utils/email.js";
import { createHtml, linkBtn } from "./../utils/emailHTML.js";
import userModel from "./../../DB/model/User.model.js";
import jwt from "jsonwebtoken";

export const warningEmails = () => {
    schedule.scheduleJob(
      '00 00 20 * * *',
      async function () {
        const usersArr = [];
        const users = await userModel.find({ confirmEmail: false });
        for (let i = 0; i < users.length; i++) {
          // Generate token
          const token = jwt.sign(
            { id: users[i]._id, email: users[i].email },
            process.env.EMAIL_SIGNATURE,
            { expiresIn: '1m' }
          );
          //Send Email
        await sendEmail({
          to: users[i].email,
          subject: "Confirm Email Reminder",
          html: createHtml(
            `${linkBtn(
              `http://localhost:3000/auth/confirmEmail/${token}`,
              "Verify Email address",
              "This is Reminig Email because your email is not confirmd. It will deleted if not confirmd. Use the following button to confirm your email"
            )}`,
            ``,
            ``,
            "Email Confirmation Warning"
          ),
        });
          usersArr.push({email: users[i].email, token});
        }
      }
    )
  };