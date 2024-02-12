import fs from "fs";

import nodemailer from "nodemailer";

import config from "./globalVariables.js";

const { emailService, emailAppServicePass } = config;

const Sendmail = async (
  userEmail: string = config.administration_Email,
  subject: string,
  htmlTemplate: string,
  attachment?: boolean,
  fileName?: string,
  attachmentFile?: string,
  attachmentFiles?: { filename: string; path: string }[]
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailService,
        pass: emailAppServicePass,
      },
    });

    const mailOptions = {
      from: emailService,
      to: userEmail,
      subject: subject,
      html: htmlTemplate,
      attachments: attachment
        ? attachmentFiles
          ? attachmentFiles
          : [
              {
                filename: fileName || `${subject}.json`, // Specify the filename you want for the attachment
                path: attachmentFile, // Specify the path to the file you want to attach
              },
            ]
        : undefined,
    };

    const info = await transporter.sendMail(mailOptions);

    if (attachmentFiles) {
      attachmentFiles.map((file) => {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.log("Error deleting file:", err);
          }
        });
      });
    } else if (attachmentFile) {
      fs.unlink(attachmentFile, (err) => {
        if (err) {
          console.log("Error deleting file:", err);
        }
      });
    }

    return info.response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default Sendmail;
