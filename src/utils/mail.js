import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://taskmanagerlink.com",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);
  //connector of our backend to the email server
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_STMP_HOST,
    port: process.env.MAILTRAP_STMP_PORT,
    auth: {
      user: process.env.MAILTRAP_STMP_USER,
      pass: process.env.MAILTRAP_STMP_PASS,
    },
  });

  const mail = {
    from: "mail.taskmanager@gamil.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed please make sure that you have provided your MAILTRAP credentials in the .env file",
    );
    console.error("Error: ", error);
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "welcome to our App!  we're excited to have you on board.",
      action: {
        instruction: "To verify your email please click on the button",
        button: {
          color: "#1a8ec4",
          text: "verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this emial, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account",
      action: {
        instruction:
          "To reset the password of your account click on the button",
        button: {
          color: "#d83114",
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this emial, we'd love to help.",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEMail,
};
