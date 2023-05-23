const express = require("express");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { handleChildProcessOutput } = require("./apis/childProcess");

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// app.get("/api/transcript", (req, res) => {
//   console.log("transcript");
// });
