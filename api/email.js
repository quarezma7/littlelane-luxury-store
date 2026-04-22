import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using Gmail SMTP
// Note: This relies on EMAIL_USER and EMAIL_PASS in the .env file
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
  }

  // If credentials aren't configured yet, simulate success for development
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('\n=============================================');
    console.log('📧 SIMULATED EMAIL (Credentials not set in .env)');
    console.log(`To: ${to}\nSubject: ${subject}`);
    console.log('=============================================\n');
    return res.status(200).json({ message: 'Email simulated (no credentials provided)', simulated: true });
  }

  try {
    const info = await transporter.sendMail({
      from: `"LittleLane" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    });

    console.log(`📧 Real Email sent successfully to ${to} [Message ID: ${info.messageId}]`);
    return res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
