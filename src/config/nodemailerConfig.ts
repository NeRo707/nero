import nodemailer from 'nodemailer';

const EMAIL = process.env.EMAIL;
const PASS = process.env.PASS;

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: EMAIL, 
    pass: PASS,
  },
});

export default transporter;
