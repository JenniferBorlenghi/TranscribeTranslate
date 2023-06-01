const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD } = require("../../env");
const fs = require("fs");

function sendEmail(email, output, onSuccessSendEmail, onErrorSendEmail) {
  let config = {
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let messageContent = `<p>Dear user,</p><br><p>Your source has been processed, and the result is now available. Please find the attached file for the details.</p><br><p><b>Result:</b> ${output}</p><br><p>Best Regards,</p><p>Tt Transcription & Translate Team</p>`;

  fs.writeFile("result.txt", output, (err) => {
    if (err) {
      console.log("Error writing to file:", err);
    } else {
      console.log("Text file created successfully");
    }
  });

  fs.readFile("result.txt", "utf8", (err, content) => {
    if (err) {
      console.log("Error reading file:", err);
      return;
    }
  });

  let message = {
    from: EMAIL,
    to: email,
    subject: "Your transcript/translate is done!",
    text: output,
    html: messageContent,
    attachments: [
      {
        filename: "result.txt",
        content: output,
      },
    ],
  };

  transporter
    .sendMail(message)
    .then((info) => {
      onSuccessSendEmail({ info, preview: nodemailer.getTestMessageUrl(info) });
      // return res.status(201).json({
      //   msg: "you should receive an email",
      //   info: info.messageId,
      //   preview: nodemailer.getTestMessageUrl(info),
      // });
    })
    .catch((error) => {
      onErrorSendEmail(error);
      // return res.status(500).json({ error });
    });
}

module.exports = { sendEmail };
