const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

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

  //   const commandLine = spawn(
  //     path.join(process.cwd(), "scripts/download-audio.sh"),
  //     [video_id || ""]
  //   );

  //   console.log(commandLine);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
