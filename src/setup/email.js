import nodemailer from 'nodemailer';
import serverConfig from '../config/server';

const transporter = nodemailer.createTransport({
  service: serverConfig.email.service,
  auth: {
    user: serverConfig.email.auth.user,
    pass: serverConfig.email.auth.pass
  }
});

export function sendActivateEmail(to, name, token) {
  if (to === null || token === null) {
    throw Error('Token or receiver are null');
  }

  const mailOptions = {
    from: serverConfig.email.auth.user,
    to: to,
    subject: 'Activate your account',
    html: `<h1>Hey ${name},</h1><br>We have received a request to activate your account associated with your email address.<br>To confirm this request, please click <a href="${token}">here</a>`
  };

  transporter.sendMail(mailOptions, err => {
    if (err) throw new Error(err);
  });
}
