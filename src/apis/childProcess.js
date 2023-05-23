function handleChildProcessOutput(cmd, response) {
  cmd.on("close", (code) => {
    console.log("Finished command. Exit code:", code);
  });

  cmd.stderr.on("data", (chunk) => {
    const chunkStr = chunk.toString("utf-8");
    console.error("[Error]", chunkStr);
    response.write(
      chunkStr
        .split("\n")
        .map((line) => "[Error] " + line)
        .join("\n")
    );
  });

  response.writeHead(200, {
    "Content-Type": "text/plain",
    "Cache-Control": "no-cache",
    "Content-Encoding": "none",
    "Access-Control-Allow-Origin": "*",
  });

  cmd.stdout.pipe(response);
}

module.exports = { handleChildProcessOutput };
