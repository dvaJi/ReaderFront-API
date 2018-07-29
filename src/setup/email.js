import nodemailer from 'nodemailer';
import serverConfig from '../config/server';

const transporter = nodemailer.createTransport({
  service: serverConfig.email.service,
  auth: {
    user: serverConfig.email.auth.user,
    pass: serverConfig.email.auth.pass
  }
});

export function sendActivateEmail({ siteUrl, to, name, token }) {
  if (to === null || token === null) {
    throw Error('Token or receiver are null');
  }

  // Ex: http://localhost/auth/activate_account?email=example@example.com&token=3x4mpl3t0k3n
  const activationUrl = `${siteUrl}auth/activate_account?email=${to}&token=${token}`;

  const mailOptions = {
    from: serverConfig.email.auth.user,
    to: to,
    subject: 'Activate your account',
    html: `<h1>Hey ${name},</h1><br>We have received a request to activate your account associated with your email address.<br>To confirm this request, please click <a href="${activationUrl}">here</a><br> Or copy and paste this url in your browser: <a href="${activationUrl}">${activationUrl}</a>`
  };

  transporter.sendMail(mailOptions, err => {
    if (err) throw new Error(err);
  });
}

export function sendAccountIsActivatedEmail({ siteUrl, to, name }) {
  // Ex: http://localhost/auth/login
  const activationUrl = `${siteUrl}auth/login`;

  const mailOptions = {
    from: serverConfig.email.auth.user,
    to: to,
    subject: 'Account activated',
    html: `<h1>Hey ${name},</h1><br>Your account is activated<br>To use your account please click <a href="${activationUrl}">here</a>`
  };

  transporter.sendMail(mailOptions, err => {
    if (err) throw new Error(err);
  });
}
