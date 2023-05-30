const express = require("express");
const path = require("path");
const { executeCmd } = require("./execute-cmd");
const fileUpload = require("express-fileupload");
const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD } = require("../../env");
const fs = require("fs");

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
  const basename = "/src/server/scripts/youtube-download-audio.sh";

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
  const basename = "/src/server/scripts/transcribe.py";

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

  const basename = "/src/server/scripts/transcribe.py";

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
  const basename = "/src/server/scripts/translate.py";

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

  let transporter = nodemailer.createTransport(config);

  let messageContent = `<p>Dear user,</p><br><p>Your source has been processed, and the result is now available. Please find the attached file for the details.</p><br><p><b>Result:</b> ${output}</p><br><p>Best Regards,</p><p>Tt Transcription and Translate Team</p>`;

  fs.writeFile("result.txt", output, (err) => {
    if (err) {
      console.log("Error writing to file:", err);
    } else {
      console.log("Text file created successfully");
    }
  });

  fs.readFile("result.txt", "utf8", (err, content) => {
    if (err) {
      console.log("Errpr reading file:", err);
      return;
    }
  });

  let message = {
    from: EMAIL,
    to: email,
    subject: "Your transcript/translate is done!", // Subject line
    text: output, // plain text body
    html: messageContent, // html body
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
