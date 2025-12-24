const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const { createTransporter } = require('../utils/emailService');

const sendSupportEmail = async (req, res) => {
  try {
    const { fromEmail, subject, description } = req.body;
    const files = req.files;

    if (!fromEmail || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create transporter using the shared configuration (OAuth2)
    const transporter = createTransporter();

    // Prepare attachments
    const attachments = files ? files.map(file => ({
      filename: file.originalname,
      path: file.path
    })) : [];

    // Email content
    const mailOptions = {
      from: `"${fromEmail}" <${process.env.EMAIL_USER}>`, // Sender address (must be authenticated user for Gmail)
      replyTo: fromEmail,
      to: 'budgetbeefyp@gmail.com', // Target support email
      subject: `[BudgetBee Support] ${subject}`,
      text: `
Hello BudgetBee Support Team,

${description}

User Details:
- Email: ${fromEmail}
- App: BudgetBee
- Platform: Web

Regards,
${fromEmail}
      `,
      attachments: attachments
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Clean up uploaded files
    if (files) {
      files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
      });
    }

    res.status(200).json({
      success: true,
      message: 'Support request sent successfully'
    });

  } catch (error) {
    console.error('Error sending support email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send support request'
    });
  }
};

module.exports = {
  sendSupportEmail
};
