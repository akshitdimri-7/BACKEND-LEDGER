const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Backend Ledger!";

  const text = `Hello ${name},\n\nThank you for registering at Backend Ledger.
We're excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`;

  const html = `<p>Hello ${name},</p>
<p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p>
<p>Best regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(
  userEmail,
  name,
  account,
  toAccount,
  amount,
) {
  const subject = "Transaction Successful - Backend Ledger";

  const text = `Hello ${name},

Your transaction has been completed successfully.

From Account: ${account}
To Account: ${toAccount}
Amount: ₹${amount}

Thank you for using Backend Ledger.

Best regards,
The Backend Ledger Team`;

  const html = `
    <p>Hello ${name},</p>

    <p>Your transaction has been completed successfully.</p>

    <ul>
      <li><strong>From Account:</strong> ${account}</li>
      <li><strong>To Account:</strong> ${toAccount}</li>
      <li><strong>Amount:</strong> ₹${amount}</li>
    </ul>

    <p>Thank you for using Backend Ledger.</p>

    <p>
      Best regards,<br>
      The Backend Ledger Team
    </p>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Failed - Backend Ledger";

  const text = `Hello ${name},

We were unable to process your transaction.

Amount: ₹${amount}
Recipient Account: ${toAccount}

Possible reasons:
- Insufficient balance
- Invalid recipient account
- Transaction restrictions
- Temporary server issue

Please review the details and try again.

Best regards,
The Backend Ledger Team`;

  const html = `
    <p>Hello ${name},</p>

    <p>We were unable to process your transaction.</p>

    <ul>
      <li><strong>Amount:</strong> ₹${amount}</li>
      <li><strong>Recipient Account:</strong> ${toAccount}</li>
    </ul>

    <p><strong>Possible reasons:</strong></p>

    <ul>
      <li>Insufficient balance</li>
      <li>Invalid recipient account</li>
      <li>Transaction restrictions</li>
      <li>Temporary server issue</li>
    </ul>

    <p>Please review the details and try again.</p>

    <p>
      Best regards,<br>
      The Backend Ledger Team
    </p>
  `;

  await sendEmail(userEmail, subject, text, html);
}
module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
};
