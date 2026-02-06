const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Set up the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "reply2kanishka@gmail.com", // Your email
    pass: "cdwf xenv ogaz jpxi", // See "How to Run" section below
  },
});

app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: "reply2kanishka@gmail.com",
    subject: `New Portfolio Contact from ${name}`,
    text: `You have a new message from: \n\nName: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error");
    } else {
      res.status(200).send("Success");
    }
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
