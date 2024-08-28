import { PrismaClient } from '@prisma/client';
import { Server } from 'http';
import app, { routes } from './app';
import config from './config/config';

// Initialize server and PrismaClient
let server: Server;
export const prismaClient = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable logging for these levels
});

// Define color codes for console output
const GREEN = '\x1b[32m'; // Green color
const BLUE = '\x1b[34m'; // Blue color
const YELLOW = '\x1b[33m'; // Yellow color
const WHITE = '\x1b[37m'; // White color
const RESET = '\x1b[0m'; // Reset color

// Helper function to format the current date as a simple string
const getFormattedDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// Helper function to format the current time as a simple string
const getFormattedTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
};

// Main function to start the server and connect to the database
async function main() {
  try {
    // Start the server
    server = app.listen(config.PORT, () => {
      console.log(
        `${GREEN}[Express] ${BLUE}[Server] ${RESET}Server running at ${YELLOW}http://localhost:${config.PORT}${RESET}`
      );
    });

    // Test Prisma Client connection
    await prismaClient.$connect();
    console.log(`${GREEN}[Express] ${BLUE}[Database] ${RESET}Database connected successfully`);

    // Log routes in development mode
    if (config.NODE_ENV === 'development') {
      routes.forEach((route) => {
        const routeInfo = `${GREEN}${route.method} ${route.path} - ${YELLOW}${route.time.toFixed(2)} ms${RESET}`;
        console.log(
          `${GREEN}[Express] ${WHITE}${getFormattedDate()} ${getFormattedTime()} ${GREEN}LOG ${YELLOW}[RouterExplorer] ${routeInfo}`
        );
      });
    }
  } catch (error) {
    console.error(`${GREEN}[Express] ${BLUE}[Error] ${RESET}Error during server startup:`, error);
    process.exit(1); // Exit process if initialization fails
  }
}

// Run the main function
main();

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  console.error(`${GREEN}[Express] ${BLUE}[Error] ${RESET}Unhandled Rejection:`, error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error(`${GREEN}[Express] ${BLUE}[Error] ${RESET}Uncaught Exception:`, error);
  process.exit(1);
});

// Close Prisma Client connection when the process exits
process.on('SIGINT', async () => {
  console.log(`${GREEN}[Express] ${BLUE}[Shutdown] ${RESET}Gracefully shutting down...`);
  await prismaClient.$disconnect();
  process.exit(0);
});
