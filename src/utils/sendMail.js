const nodemailer = require("nodemailer");

const FROM = "jdcoaching2019@gmail.com";

const sendMail = (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: FROM,
      pass: "JDcoaching2019"
    }
  });

  const mailOptions = {
    from: FROM,
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

module.exports = sendMail;
