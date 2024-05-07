import sendEmail from "../helpers/sendEmail.js";
import "dotenv/config";

const { TEAM_EMAIL} = process.env;

const emailHelp = async (req, res) => {
  const { name } = req.user;
  const { email, message } = req.body;
  const letterHelp = {
    to: TEAM_EMAIL,
    subject: `User ${name}  wrote a letter asking for help`,
    html: `<div><p>User <strong>${name}</strong> wrote a letter asking for help:</p>
                <p>Message from user: <strong>${message}</strong></p>
                <p>After processing the message, send a letter to the user email: <a href="mailto:${email}">${email}</a></p>
                
             `,
  };
    await sendEmail(letterHelp);
    
  const letterHelpUser = {
    to: email,
    subject: "Support Perfect-task",
    html: `<div><p>Dear <strong>${name}</strong> !</p>
                <p>We received a message from you about help: <strong>${message}</strong>.</p>
                <p>Thank you for your request! We will look into your issue and respond as soon as possible.</p>
                <p>Your appeal is very important to us.</p>
                <p><strong>Sincerely, team Perfect-task</strong></p><div/>
                `,
  };
  await sendEmail(letterHelpUser);

  res.json({
    message: "Reply email has been sent",
  });
};

export default emailHelp;
