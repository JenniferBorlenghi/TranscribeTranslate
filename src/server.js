const express = require("express");
const path = require("path");
const { executeCmd } = require("./apis/execute-cmd");
const fileUpload = require("express-fileupload");
const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD } = require("./../env");

const app = express();
const port = 3000;

app.use(express.json());
app.use(fileUpload());

app.get("/api/download/youtube/audio", (req, res) => {
  const { video_id } = req.query;

  if (typeof video_id !== "string") {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const isPythonScript = false;
  const args = [video_id];
  const basename = "/src/scripts/youtube-download-audio.sh";

  const onSuccess = (outputStream) => {
    outputStream.pipe(res);

    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
      "Content-Encoding": "none",
      "Access-Control-Allow-Origin": "*",
    });
  };

  const onError = (errorChunk) => {
    res.write(
      errorChunk
        .split("\n")
        .map((line) => "[Error] " + line)
        .join("\n")
    );
  };

  executeCmd(isPythonScript, args, basename, onSuccess, onError);
});

app.post("/api/upload/audio", (req, res) => {
  // Check if files were uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const audioFile = req.files.audio;
  console.log("audioFile", audioFile.name);

  const filePath = path.join(process.cwd(), `/tmp/${audioFile.name}`);

  audioFile.mv(filePath, (err) => {
    if (err) {
      console.error("Error to save the file: ", err);
      return res.status(500).send("Error to save the file");
    }
    res.send("File uploaded successfully.");
  });
});

app.get("/api/transcript/youtube", (req, res) => {
  const isPythonScript = true;
  const { source, resultType } = req.query;
  const args = [source, resultType, "youtube"];
  const basename = "/src/scripts/transcribe.py";

  const onSuccess = (outputStream) => {
    outputStream.pipe(res);

    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
      "Content-Encoding": "none",
      "Access-Control-Allow-Origin": "*",
    });
  };

  const onError = (errorChunk) => {
    res.write(
      errorChunk
        .split("\n")
        .map((line) => "[Error] " + line)
        .join("\n")
    );
  };

  executeCmd(isPythonScript, args, basename, onSuccess, onError);
});

app.post("/api/transcript/audio", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const isPythonScript = true;
  const fileName = req.files.audio.name;
  const resultType = req.body.resultType;
  const args = [fileName, resultType, "audio"];

  const basename = "/src/scripts/transcribe.py";

  const onSuccess = (outputStream) => {
    outputStream.pipe(res);

    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
      "Content-Encoding": "none",
      "Access-Control-Allow-Origin": "*",
    });
  };

  const onError = (errorChunk) => {
    res.write(
      errorChunk
        .split("\n")
        .map((line) => "[Error] " + line)
        .join("\n")
    );
  };

  executeCmd(isPythonScript, args, basename, onSuccess, onError);
});

app.post("/api/translate", (req, res) => {
  const isPythonScript = true;
  const { transcription, resultLanguage } = req.body;
  const args = [transcription, resultLanguage];
  const basename = "/src/scripts/translate.py";

  const onSuccess = (outputStream) => {
    outputStream.pipe(res);

    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
      "Content-Encoding": "none",
      "Access-Control-Allow-Origin": "*",
    });
  };

  const onError = (errorChunk) => {
    res.write(
      errorChunk
        .split("\n")
        .map((line) => "[Error] " + line)
        .join("\n")
    );
  };

  executeCmd(isPythonScript, args, basename, onSuccess, onError);
});

app.post("/api/send/email", async (req, res) => {
  const { email, output } = req.body;
  console.log("output", output);

  console.log("email", email);

  let config = {
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: testAccount.user, // generated ethereal user
  //     pass: testAccount.pass, // generated ethereal password
  //   },
  // });

  let transporter = nodemailer.createTransport(config);

  let message = {
    from: EMAIL, // sender address
    to: email, // list of receivers
    subject: "Your transcript is done!", // Subject line
    text: output, // plain text body
    html: output, // html body
  };

  transporter
    .sendMail(message)
    .then((info) => {
      return res.status(201).json({
        msg: "you should receive an email",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
