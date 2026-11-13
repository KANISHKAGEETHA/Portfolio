// Contact form backend: Express + Nodemailer
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "10kb" }));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));
app.use("/contact", rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }));

const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
});

const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

app.post("/contact", async (req, res) => {
  const { name, email, message, website } = req.body || {};
  if (website) return res.json({ ok: true });
  if (
    !name ||
    !/^\S+@\S+\.\S+$/.test(email || "") ||
    !message ||
    message.length < 5 ||
    message.length > 3000
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }
  try {
    await mailer.sendMail({
      from: `"Portfolio" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      html: `<p><b>${esc(name)}</b> (${esc(email)})</p><p>${esc(message).replace(/\n/g, "<br>")}</p>`,
    });
    await mailer.sendMail({
      from: `"Kanishka P G" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Thanks for reaching out",
      text: `Hi ${name},\n\nThanks for your message. I'll get back to you soon.\n\nKanishka P G`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email failed" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server running"));
