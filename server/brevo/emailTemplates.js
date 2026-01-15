export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f6f8;
">
  <div style="
    background: linear-gradient(to right, #4CAF50, #45a049);
    padding: 20px;
    text-align: center;
    border-radius: 5px 5px 0 0;
  ">
    <h1 style="color: #ffffff; margin: 0;">
      Smart Agri Prediction System
    </h1>
    <p style="color: #e8f5e9; margin: 4px 0 0; font-size: 16px;">
      Email Verification
    </p>
  </div>
  <div style="
    background-color: #ffffff;
    padding: 20px;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  ">
    <p>Hello,</p>
    <p>
      Thank you for registering with Smart Agri Prediction System. Please use the verification code below to confirm your email address:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="
        font-size: 34px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #4CAF50;
        background-color: #e8f5e9;
        padding: 10px 20px;
        border-radius: 4px;
        display: inline-block;
      ">
        {VERIFICATION_TOKEN}
      </span>
    </div>
    <p>
      This code will expire in <strong>15 minutes</strong> for security reasons.
      Please do not share this code with anyone.
    </p>
    <p>
      If you did not create an account, you can safely ignore this email.
    </p>
    <p style="margin-top: 20px;">
      Best regards,<br>
      Smart Agri Prediction System Team
    </p>
  </div>
  <div style="
    text-align: center;
    margin-top: 20px;
    color: #888;
    font-size: 12px;
  ">
    <p>
      This is an automated message. Please do not reply to this email.
    </p>
  </div>
</body>
</html>
`;
