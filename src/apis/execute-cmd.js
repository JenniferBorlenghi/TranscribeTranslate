const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

function executeCmd(isPythonScript, args, basename, onSucess, onError) {
  const scriptPath = path.join(process.cwd(), basename);

  // giving permissions to execute the command to this path
  fs.chmodSync(scriptPath, "755");

  let cmd = "";

  if (isPythonScript) {
    cmd = spawn(
      "python3",
      [scriptPath, ...args]
      // ,{
      //   cwd: process.cwd(),
      // }
    );
  } else {
    cmd = spawn(scriptPath, args);
  }

  cmd.on("close", (code) => {
    console.log("Finished command. Exit code:", code);
  });

  cmd.stderr.on("data", (chunk) => {
    const chunkStr = chunk.toString("utf-8");
    console.error("[Error]", chunkStr);
    onError(chunkStr);
  });

  onSucess(cmd.stdout);
}

module.exports = { executeCmd };
