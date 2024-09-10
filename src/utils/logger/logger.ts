import fs from 'fs';
import os from 'os';
import path from 'path';

// Define the path to the log directory
const logDir = path.join(__dirname, '..', '..', '..', 'logs');

// System information
const systemMac = os.networkInterfaces().Ethernet?.[0].mac;
const systemUseName = os.userInfo().username || 'UNKNOWN USER';
const systemHost = os.hostname() || 'UNKNOWN HOST';
const osType = os.type() || 'UNKNOWN OS';
const systemSanitizedMac =
  os.networkInterfaces().Ethernet?.[0].mac?.replace(/:/g, '-') || 'UNKNOWN MAC';

// Ensure the logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Function to log messages and ensure log directories are properly created
export const logMessage = (message: string) => {
  const now = new Date();
  const dateString = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const logDirForToday = path.join(
    logDir,
    `[${dateString}] MAC[${systemSanitizedMac}] USER[${systemUseName}]`
  );
  const logFileForToday = path.join(logDirForToday, 'access.log');

  // Ensure the directory for today's logs exists
  if (!fs.existsSync(logDirForToday)) {
    fs.mkdirSync(logDirForToday, { recursive: true });
  }

  // Log message format
  const logMessage = `${now.toISOString()} | OS-TYPE:${osType} | HOST-NAME:${systemHost} | MAC-ADDRESS:${systemMac} | USER-NAME:${systemUseName} | [INFO]: ${message}\n`;

  // Write to log file
  fs.appendFile(logFileForToday, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err.message);
    }
  });
};

// Function to return a writable stream for Morgan
export const loggerStream = {
  write: (message: string) => logMessage(message.trim()),
};
