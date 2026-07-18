import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Chat Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({});
      
      const systemInstruction = `You are a helpful, professional AI Financial Assistant for Ledger-Link, a financial management application.
Use the following JSON data representing the user's current app state to answer their questions accurately:
${JSON.stringify(context)}

Keep your answers concise, formatting numbers as currency where appropriate. If the user asks something unrelated to their finances or Ledger-Link, gently guide them back.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: message,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ error: "Failed to process AI request.", details: error?.message || String(error) });
    }

  });

  app.post("/api/contact", (req, res) => {
    const { name, organization, email, message } = req.body ?? {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    console.log("Contact request received:", {
      name,
      organization,
      email,
      message,
      receivedAt: new Date().toISOString(),
    });

    res.status(200).json({
      status: "success",
      message: "Thanks for reaching out. We will get back to you soon.",
    });
  });

  // M-Pesa Webhook & Payments
  app.post("/api/mpesa/webhook", (req, res) => {
    console.log("M-Pesa Webhook received:", req.body);
    // Real implementation would verify Daraja signatures and match against invoice ID
    res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
  });
  
  app.post("/api/mpesa/stkpush", (req, res) => {
    const { amount, phone, invoiceId } = req.body;
    if (!amount || !phone || !invoiceId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Real implementation would call Daraja API here
    console.log(`Initiating STK push for ${phone} for ${amount} (Invoice: ${invoiceId})`);
    res.json({ status: "success", message: "STK Push initiated", checkoutRequestID: "ws_CO_1234567890" });
  });

  // QuickBooks Online Integration
  app.get("/api/qbo/connect", (req, res) => {
    // Initiate OAuth flow
    const authUri = "https://appcenter.intuit.com/connect/oauth2"; // + parameters
    res.json({ url: authUri });
  });
  
  app.post("/api/qbo/sync", (req, res) => {
    console.log("Syncing with QBO...");
    res.json({ status: "success", syncedRecords: 124 });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Network access on http://0.0.0.0:${PORT}`);
  });
}

startServer();
