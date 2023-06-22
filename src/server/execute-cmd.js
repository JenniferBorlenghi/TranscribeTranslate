const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

function executeCmd(isPythonScript, args, basename, onCmdOk, onCmdError) {
  const scriptPath = path.join(process.cwd(), basename);

  // giving permissions to execute the command to this path
  fs.chmodSync(scriptPath, "755");

  let cmd = false;
  let errorMessage = "";
  let result = "";

  if (isPythonScript) {
    cmd = spawn("python3", [scriptPath, ...args]);
  } else {
    cmd = spawn(scriptPath, args);
  }

  cmd.on("close", (code) => {
    if (errorMessage) {
      onCmdError(errorMessage);
      return;
    }
    onCmdOk(result);
  });

  cmd.stdout.on("data", (data) => {
    result += data;
  });

  cmd.stderr.on("data", (chunk) => {
    errorMessage += chunk;
  });
}

module.exports = { executeCmd };
