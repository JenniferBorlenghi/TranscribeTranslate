const express = require("express");
const path = require("path");
const { executeCmd } = require("./execute-cmd");
const fileUpload = require("express-fileupload");
const { sendEmail } = require("./send-email");

const app = express();
const port = 3000;

app.use(express.json());
app.use(fileUpload());

const onSuccess = (result, res) => {
  // console.log("@@@ onSuccess", result);

  // if the headers of the response is not sent:
  if (!res.headersSent) {
    // Setting up headers
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "no-cache");
    // decoding is not necessary, the response body will be the final response
    res.setHeader("Content-Encoding", "none");
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  // send the HTTP response with the result type text and the headers
  // already set up above (if headers not sent)
  res.send(result);
};

const onError = (errorChunk, res) => {
  console.log("@@@ onError");
  return res.status(500).json({ error: true });
};

app.get("/api/download/youtube/audio", (req, res) => {
  const { video_id } = req.query;

  if (typeof video_id !== "string") {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const isPythonScript = false;
  const args = [video_id];
  const basename = "/src/server/scripts/youtube-download-audio.sh";

  const onCmdError = (error) => {
    onError(error, res);
  };
  const onCmdOk = (result) => {
    onSuccess(result, res);
  };

  executeCmd(isPythonScript, args, basename, onCmdOk, onCmdError);
});

app.post("/api/upload/audio", (req, res) => {
  // Check if files were uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const audioFile = req.files.audio;

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

  const onCmdError = (cmd) => {
    onError(cmd, res);
  };
  const onCmdOk = (cmd) => {
    onSuccess(cmd, res);
  };

  executeCmd(isPythonScript, args, basename, onCmdOk, onCmdError);
});

app.post("/api/transcript/audio", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const isPythonScript = true;
  const fileName = req.files.audio.name;
  console.log("filename", fileName);
  const resultType = req.body.resultType;
  console.log("result type", resultType);
  const args = [fileName, resultType, "audio"];

  const basename = "/src/server/scripts/transcribe.py";

  const onCmdError = (cmd) => {
    onError(cmd, res);
  };
  const onCmdOk = (cmd) => {
    onSuccess(cmd, res);
  };

  executeCmd(isPythonScript, args, basename, onCmdOk, onCmdError);
});

app.post("/api/translate", (req, res) => {
  const isPythonScript = true;
  const { transcription, resultLanguage } = req.body;
  const args = [transcription, resultLanguage];
  const basename = "/src/server/scripts/translate.py";

  const onCmdError = (cmd) => {
    onError(cmd, res);
  };
  const onCmdOk = (cmd) => {
    onSuccess(cmd, res);
  };

  executeCmd(isPythonScript, args, basename, onCmdOk, onCmdError);
});

app.post("/api/send/email", async (req, res) => {
  const { email, output } = req.body;

  const onSuccessSendEmail = ({ info, preview }) => {
    return res.status(201).json({
      msg: "you should receive an email",
      info: info.messageId,
      preview,
    });
  };

  const onErrorSendEmail = ({ error }) => {
    return res.status(500).json({ error });
  };

  sendEmail(email, output, onSuccessSendEmail, onErrorSendEmail);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
