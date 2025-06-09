// api/index.js
const express = require("express");
require("dotenv").config(); // Loads environment variables from .env file

const app = express();
const PORT = process.env.PORT; // Crucial for Vercel: listens on the port Vercel provides

app.use(express.json()); // Essential for parsing JSON bodies from incoming requests

// Target account details (should also be in .env for real apps)
const TARGET_ROUTING = process.env.TARGET_ROUTING || "283977688";
const TARGET_ACCOUNT = process.env.TARGET_ACCOUNT || "0000339715";

// Middleware to validate incoming requests using a Bearer token
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : null;

  // process.env.AuthToken MUST be set in your Vercel project's environment variables
  if (!process.env.AuthToken || !token || token !== process.env.AuthToken) {
    console.error("Authentication failed: Invalid or Missing Token.");
    return res.status(403).json({ error: "Invalid or Missing Token" });
  }
  next(); // If token is valid, proceed to the next middleware/route handler
});

// Route to handle the "transfer" request
app.post("/transfer", async (req, res) => { // Made this async because real API calls will be asynchronous
  const { hash, amount } = req.body;

  if (!hash || !amount || typeof amount !== 'number' || amount <= 0) {
    console.warn("Transfer request failed: Missing or invalid transaction data.", req.body);
    return res.status(400).json({ error: "Missing or invalid transaction data (hash and positive numeric amount required)" });
  }

  // =========================================================================
  // !!! CRITICAL: PLACE YOUR REAL PAYMENT GATEWAY / CRYPTO API INTEGRATION HERE !!!
  // =========================================================================

  try {
    // Example placeholder for a real API call:
    // await yourPaymentGateway.sendFunds({
    //   amount: amount,
    //   currency: 'USD', // Or 'BTC', 'ETH' etc.
    //   destination: { routing: TARGET_ROUTING, account: TARGET_ACCOUNT },
    //   reference: hash // Use the hash as a transaction reference
    // });

    // For now, it will continue to simulate:
    console.log(`--- SIMULATED TRANSFER INITIATED ---`);
    console.log(`Hash: ${hash}`);
    console.log(`Amount: ${amount}`);
    console.log(`To Routing: ${TARGET_ROUTING}`);
    console.log(`To Account: ${TARGET_ACCOUNT}`);
    console.log(`-----------------------------------`);

    // Simulate a successful response after a short delay (like a real API might have)
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

    res.json({
      message: `Simulated transfer of ${amount} for hash ${hash} to routing ${TARGET_ROUTING}, account ${TARGET_ACCOUNT} successful.`,
      status: "success",
      transactionId: `simulated_txn_${Date.now()}_${hash.substring(0, 8)}`, // Unique ID for tracking
      hash: hash,
      amount: amount,
      destination: {
        routing: TARGET_ROUTING,
        account: TARGET_ACCOUNT
      }
    });

  } catch (error) {
    console.error(`Error during transfer for hash ${hash}:`, error);
    // In a real app, you'd parse the error from the payment gateway API
    res.status(500).json({
      error: "Failed to process transfer. Please check server logs.",
      details: error.message // Be careful not to expose sensitive error details in production
    });
  }
});

// A basic GET route for the root to serve your HTML page
app.get("/", (req, res) => {
  res.send('API is running. Access the website at "/" and POST to "/transfer" with a valid token.');
});

// Fallback for any other unhandled routes (after authentication)
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Target Routing: ${TARGET_ROUTING}, Target Account: ${TARGET_ACCOUNT}`);
});
