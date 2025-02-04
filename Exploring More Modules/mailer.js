// 1. Import nodemailer
const nodemailer = require("nodemailer");

// 2. Configure email and send it.
async function sendMail() {
  // 1. Create an email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shiv.node.dev@gmail.com", // Your email
      pass: "ffwlfehlbhfnkbdn", // Your app password (not your Gmail password)
    },
  });

  // 2. Configure email content
  const mailOptions = {
    from: "shiv.node.dev@gmail.com",
    to: "shivanirathore@gmail.com", // Add recipient's email here
    subject: "Welcome to NodeJS App",
    text: "This is an email using Nodemailer in Node.js",
  };

  // 3. Send the email
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", result);
  } catch (err) {
    console.log("Email send failed with error: " + err);
  }
}

sendMail();
