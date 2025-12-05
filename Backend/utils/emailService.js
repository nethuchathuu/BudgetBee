const nodemailer = require('nodemailer');

// Create transporter with Gmail OAuth2 configuration
const createTransporter = () => {
  // Gmail API OAuth2 configuration
  if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    });
  }

  // Fallback to basic SMTP (for testing with Ethereal or other services)
  // For testing with Ethereal (fake SMTP), uncomment these lines:
  // return nodemailer.createTransport({
  //   host: 'smtp.ethereal.email',
  //   port: 587,
  //   auth: {
  //     user: 'your-ethereal-user@ethereal.email',
  //     pass: 'your-ethereal-password'
  //   }
  // });

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send verification code email to user
 * @param {string} email - Recipient email address
 * @param {string} code - 6-digit verification code
 * @returns {Promise<Object>} - Email send result
 */
const sendVerificationEmail = async (email, code) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"BudgetBee" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Password Change Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #059669, #34d399);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 40px 30px;
              color: #333;
            }
            .content p {
              font-size: 16px;
              line-height: 1.6;
              margin: 0 0 20px 0;
            }
            .code-box {
              background-color: #f9fafb;
              border: 2px dashed #059669;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
            }
            .code {
              font-size: 36px;
              font-weight: bold;
              color: #059669;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .warning {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .warning p {
              margin: 0;
              color: #92400e;
              font-size: 14px;
            }
            .footer {
              background-color: #f9fafb;
              padding: 20px 30px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
            .footer p {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🐝 BudgetBee</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You requested to change your password. Please use the verification code below to complete the process:</p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              
              <p>This code will expire in <strong>5 minutes</strong>.</p>
              
              <div class="warning">
                <p><strong>⚠️ Security Notice:</strong> If you didn't request this password change, please ignore this email and ensure your account is secure.</p>
              </div>
              
              <p>Thank you for using BudgetBee!</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} BudgetBee. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Your BudgetBee verification code is: ${code}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this password change, please ignore this email.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully to:', email);
    console.log('Message ID:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('❌ Error sending verification email:', error.message);
    throw new Error('Failed to send verification email. Please try again later.');
  }
};

module.exports = {
  sendVerificationEmail,
};
