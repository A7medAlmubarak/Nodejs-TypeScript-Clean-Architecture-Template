import http from "http";
import { connectToDatabase } from "./infrastructure/database";
import Scheduler from "./application/services/Scheduler.Service";
import app from "./app";
import configureSocket from "./configuration/socketConfig";
const scheduler = new Scheduler();
async function startServer() {
    try {
        const PORT = process.env.PORT || 3000;

        // Connect to the database
        await connectToDatabase();
        scheduler.run();

        const server = http.createServer(app);
        const io = configureSocket(server);

        // Start server
        server.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });

        // Handle uncaught exceptions
        process.on("uncaughtException", (error) => {
            console.error("Uncaught exception:", error);
                process.exit(1);
        });

        // Handle server errors
        server.on("error", (error: NodeJS.ErrnoException) => {
            console.error("Server error:", error);
            process.exit(1);
        });

        // Gracefully shut down server on SIGINT
        process.on("SIGINT", () => {
            console.log("Received SIGINT, shutting down gracefully");
            server.close(() => {
                console.log("Server closed");
                process.exit(0);
            });
        });

        // Gracefully shut down server on SIGTERM
        process.on("SIGTERM", () => {
            console.log("Received SIGTERM, shutting down gracefully");
            server.close(() => {
                console.log("Server closed");
                process.exit(0);
            });
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

startServer();
