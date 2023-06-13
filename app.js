const { spawn } = require('child_process');
const fs = require("fs");
const path = require("path");

function statistics(command, arguments = [], time = Infinity) {
  const timestamp = new Date().toISOString().replaceAll(":", "-");
  const logFilePath = path.join(__dirname, "logs", timestamp + command + ".json");

  const start = new Date();

  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, arguments, { timeout: time });

    let data = "";
    childProcess.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    childProcess.on("close", (code) => {
      const end = new Date();
      const duration = end - start;
      let success;
      let commandSuccess;

      if (code === 0) {
        success = true;
        commandSuccess = true;
      } else {
        success = false;
        commandSuccess = false;
      }

      const stat = {
        start: start.toString(),
        duration,
        success,
      };

      if (!commandSuccess) {
        stat.commandSuccess = commandSuccess;
      }

      if (!success) {
        stat.error = "An error occurred";
      }

      fs.writeFile(logFilePath, JSON.stringify(stat, undefined, 2), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(stat);
        }
      });
    });

    childProcess.on("error", (error) => {
      const stat = {
        start: start.toString(),
        duration: 0,
        success: false,
        commandSuccess: false,
        error: error.message,
      };

      reject(stat);
    });
  });
}

statistics('l', ['l'], 5000)
  .then((result) => {
    console.log('Stat:', result);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
