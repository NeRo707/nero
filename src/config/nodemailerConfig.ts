import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'botnetx1@gmail.com', 
    pass: 'jbrt ioxe bwhn ctjv',
  },
});

export default transporter;
