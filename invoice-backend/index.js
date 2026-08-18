require("dotenv").config();
const express = require("express");
const cors = require("cors");
const webpush = require("web-push");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- database ----------------
const db = new Database("data.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT UNIQUE,
    subscription TEXT
  );
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    amount REAL,
    narration TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// ---------------- web push setup ----------------
webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// send a push notification to every saved subscription
async function broadcastNotification(payload) {
  const rows = db.prepare("SELECT subscription FROM subscriptions").all();
  for (const row of rows) {
    const sub = JSON.parse(row.subscription);
    try {
      await webpush.sendNotification(sub, JSON.stringify(payload));
    } catch (err) {
      console.error("Push failed for one subscriber:", err.message);
      if (err.statusCode === 410 || err.statusCode === 404) {
        db.prepare("DELETE FROM subscriptions WHERE endpoint = ?").run(sub.endpoint);
      }
    }
  }
}

// ---------------- routes ----------------

// frontend calls this once to give us its push subscription
app.post("/api/subscribe", (req, res) => {
  const subscription = req.body;
  db.prepare(
    "INSERT OR IGNORE INTO subscriptions (endpoint, subscription) VALUES (?, ?)"
  ).run(subscription.endpoint, JSON.stringify(subscription));
  res.status(201).json({ message: "Subscribed" });
});

// send your VAPID public key to the frontend so it can subscribe
app.get("/api/BDVFl8ojxjktbP1BDkFegGBwzn63XF5AhTAlHT1O7bu45ofdkjbowVaHm5diFHH8N6hy_vO-rEkDpaJXAZAKmcM", (req, res) => {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

// manual test endpoint: trigger a notification yourself to confirm it works
app.post("/api/test-notify", async (req, res) => {
  await broadcastNotification({
    title: "Test Notification",
    body: "If you're seeing this, push notifications are working.",
  });
  res.json({ message: "Sent" });
});

// this is where Mono will send real transaction webhooks (Phase 3)
app.post("/api/mono-webhook", async (req, res) => {
  const event = req.body;
  console.log("Mono webhook received:", event);

  if (event.event === "transaction.credit" || event.event === "transaction.debit") {
    const { amount, narration, type } = event.data || {};
    db.prepare(
      "INSERT INTO transactions (type, amount, narration) VALUES (?, ?, ?)"
    ).run(type, amount, narration);

    await broadcastNotification({
      title: type === "credit" ? "Money In ..." : "Money Out ...",
      body: `${narration || ""} — ₦${amount?.toLocaleString?.() || amount}`,
    });
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));