export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Missing or Invalid Token" });
    }

    const token = authHeader.split(" ")[1];
    const expectedToken = process.env.API_TOKEN; // Store in Vercel .env file

    if (token !== expectedToken) {
        return res.status(403).json({ error: "Forbidden: Invalid Token" });
    }

    const { hash, amount } = req.body;
    if (!hash || !amount) {
        return res.status(400).json({ error: "Bad Request: Missing transaction data" });
    }

    // Convert SHA-256 hash to byte segments for 8086 processing
    const byteChunks = hash.match(/.{1,2}/g); // Split into 1-byte pieces
    const hexAmount = Number(amount).toString(16).padStart(4, '0');

    res.json({ instruction: `MOV SI, OFFSET ${byteChunks.join(" ")}; MOV AX, ${hexAmount}` });
}

