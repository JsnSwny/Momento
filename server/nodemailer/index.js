const nodemailer = require("nodemailer");
const config = require("../config");

async function verifyEmail(receiver, name, link) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_SECRET,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Momento 👻" <signup-noreply@momento.com>', // sender address
    to: receiver, // list of receivers
    subject: "Momento - New account successfully registered", // Subject line
    text: "Dear " + name + ", \n\nThank you for registering with us!\nYou're one step away from creating memories with your friends and family! \
    We just need you to verify your email address.\n" + link, // plain text body
    html: "<p>Dear " + name + `,</p> \
    <p>Thank you for registering with us!<br/>\
    You're one step away from creating memories with your friends and family!<br/> \
    We just need you to verify your email address.<br/>Please click <a href = '${link}'>here</a> to activate your account.</p>`
  });

  console.log("Message sent: %s", info.messageId);
}

async function passwordReset(receiver, name, link) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      secure: false,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_SECRET,
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Momento 👻" <password-reset-noreply@momento.com>', // sender address
      to: receiver, // list of receivers
      subject: "Momento - Password reset link", // Subject line
      text: "Dear " + name + ", \n\nThank you for registering with us!\nYou're one step away from creating memories with your friends and family! \
      We just need you to verify your email address.\n" + link, // plain text body
      html: "<p>Dear " + name + `,</p> \
      <p>We received a request to reset the password for the Momento account associated with this email address.<br/>\
      Please click <a href = '${link}'>here</a> to reset your password.</p>`
    });
  
    console.log("Message sent: %s", info.messageId);
  }

module.exports = {
    verifyEmail,
    passwordReset
}