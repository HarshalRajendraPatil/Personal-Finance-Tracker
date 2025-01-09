import nodeMailer from "nodemailer";
import CustomError from "./customError.js";
import catchAsync from "../Utils/catchAsync.js";

// Fucntion for sending the mail of the reset-password and the response back to the user.
const sendMail = catchAsync(async function (email, next, msg, subject) {
  // Setting up the mail which will send the email
  const transporter = nodeMailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Setting up the content of the email
  const mailOption = {
    from: {
      name: "ToonDig",
      address: process.env.EMAIL,
    },
    to: email,
    subject: subject,
    html: msg,
  };

  // Sending the mail to the given email
  transporter.sendMail(mailOption, function (error, info) {
    if (error) {
      next(
        // Gives the error the global error middleware
        new CustomError("Failed to send the mail. Try again later", 500)
      );
    }
  });
});

export default sendMail;
