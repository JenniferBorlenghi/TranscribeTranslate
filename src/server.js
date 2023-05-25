const express = require("express");
const { spawn, exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { handleChildProcessOutput } = require("./apis/childProcess");
const fileUpload = require("express-fileupload");

const app = express();
const port = 3000;

app.use(express.json());
app.use(fileUpload());

app.get("/api/audio", (req, res) => {
  console.log("audio");

  const { video_id } = req.query;
  if (typeof video_id !== "string") {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  console.log("video ID:", video_id);

  const scriptPath = path.join(
    process.cwd(),
    "/src/scripts/youtube-download-audio.sh"
  );

  // making the script executable
  fs.chmodSync(scriptPath, "755");

  const cmd = spawn(scriptPath, [video_id || ""]);

  handleChildProcessOutput(cmd, res);

  // cmd.stdout.on("data", (data) => {
  //   // Handle the output from the child process if needed
  //   console.log("Child process output:", data.toString());
  // });

  // cmd.stderr.on("data", (data) => {
  //   // Handle any error output from the child process if needed
  //   console.error("Child process error:", data.toString());
  // });

  // cmd.on("close", (code) => {
  //   // Handle the child process close event and send the response
  //   if (code === 0) {
  //     res.send("Audio downloaded successfully");
  //   } else {
  //     res.status(500).json({ error: "Failed to download audio" });
  //   }
  // });
});

app.post("/api/upload", (req, res) => {
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
  const { source, resultType } = req.query;

  const cmd = spawn(
    "python3",
    [
      path.join(process.cwd(), "/src/scripts/transcribe.py"),
      source || "",
      resultType || "",
      "youtube",
    ],
    {
      cwd: process.cwd(),
    }
  );

  handleChildProcessOutput(cmd, res);
});

app.post("/api/transcript/audio", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const fileName = req.files.audio.name;
  const resultType = req.body.resultType;

  console.log("entering server transcript audio", fileName);
  console.log("result type", resultType);

  const cmd = spawn(
    "python3",
    [
      path.join(process.cwd(), "/src/scripts/transcribe.py"),
      fileName || "",
      resultType || "",
      "audio",
    ],
    {
      cwd: process.cwd(),
    }
  );

  handleChildProcessOutput(cmd, res);
});

app.post("/api/translate", (req, res) => {
  const { transcription, resultLanguage } = req.body;

  const cmd = spawn(
    "python3",
    [
      path.join(process.cwd(), "/src/scripts/translate.py"),
      transcription || "",
      resultLanguage || "",
    ],
    {
      cwd: process.cwd(),
    }
  );

  handleChildProcessOutput(cmd, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
