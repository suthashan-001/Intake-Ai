// IntakeAI Server Entry Point
// erver starts - run with: npm run dev

import "dotenv/config"; // Load environment variables from .env file
import app from "./app";

const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`
    Intake Ai Server running!

    local: http://localhost:${PORT}  
    health-check endpoint: http://localhost:${PORT}/api/health
  `);
});
