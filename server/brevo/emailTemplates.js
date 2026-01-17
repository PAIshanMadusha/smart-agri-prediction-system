// Email template for verification email
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
    <img
      src="https://raw.githubusercontent.com/PAIshanMadusha/crop-disease-detection-cnn-model/main/static/images/leaf_favicon.png"
      alt="Smart Agri Logo"
      style="max-width: 80px; margin-bottom: 3px;"
    />
    <h1 style="color: #ffffff; margin: 0;">
      Smart Agri Prediction
    </h1>
    <p style="color: #e8f5e9; margin: 0; font-size: 16px;">
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
    <p style="color: #FF0000">
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

// Email template for welcome email
export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Smart Agri Prediction System</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #f4f6f8;
  color: #333;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="
          background-color: #ffffff;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        ">
          <tr>
            <td style="
              background: linear-gradient(to right, #4CAF50, #2e7d32);
              padding: 20px;
              text-align: center;
            ">
              <img
                src="https://raw.githubusercontent.com/PAIshanMadusha/crop-disease-detection-cnn-model/main/static/images/leaf_favicon.png"
                alt="Smart Agri Logo"
                style="max-width: 80px; margin-bottom: 10px;"
              />
              <h1 style="
                margin: 0;
                color: #ffffff;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 26px;
              ">
                Welcome, We’re Glad You’re Here
              </h1>
              <p style="font-size: 14px; color: #e8f5e9;">
                Account Verified Successfully!
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 25px;">
              <p style="font-size: 16px;">Hello {USER_NAME},</p>
              <p style="font-size: 16px;">
                Welcome to <strong>Smart Agri Prediction System</strong>!
                Your account has been successfully verified, and you are now
                ready to explore intelligent agricultural insights powered by AI.
              </p>
              <ul style="font-size: 15px; padding-left: 20px;">
                <li>🌱 Crop recommendations based on soil and climate</li>
                <li>🦠 AI-based crop disease detection</li>
                <li>🧪 Fertilizer suggestions for better yield</li>
              </ul>
              <p style="margin-top: 25px;">
                Best regards,<br />
                Smart Agri Prediction System Team
              </p>
            </td>
          </tr>
          <tr>
            <td style="
              background-color: #f1f1f1;
              padding: 15px;
              text-align: center;
              font-size: 12px;
              color: #777;
            ">
              This is an automated message. Please do not reply.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #f4f6f8;
  color: #333;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="
          background-color: #ffffff;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        ">
          <tr>
            <td style="
              background: linear-gradient(to right, #4CAF50, #45a049);
              padding: 15px;
              text-align: center;
            ">
              <img
                src="https://raw.githubusercontent.com/PAIshanMadusha/crop-disease-detection-cnn-model/main/static/images/leaf_favicon.png"
                alt="Smart Agri Logo"
                style="max-width: 70px; margin-bottom: 5px;"
              />
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">
                Password Reset
              </h1>
              <p style="color: #e8f5e9; margin: 5px 0 0; font-size: 14px;">
                Smart Agri Prediction
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 25px;">
              <p style="font-size: 15px;">Hello,</p>
              <p style="font-size: 15px; color: #FF0000;">
                We received a request to reset your password. If you did not make
                this request, you can safely ignore this email.
              </p>
              <p style="font-size: 15px;">
                Click the button below to reset your password:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a
                  href="{RESET_URL}"
                  style="
                    background-color: #4CAF50;
                    color: #ffffff;
                    padding: 14px 22px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    display: inline-block;
                  "
                >
                  Reset Password
                </a>
              </div>

              <p style="font-size: 14px;">
                This link will expire in <strong>1 hour</strong> for security
                reasons.
              </p>
              <p style="margin-top: 25px;">
                Best regards,<br />
                Smart Agri Prediction System Team
              </p>
            </td>
          </tr>
          <tr>
            <td style="
              background-color: #f1f1f1;
              padding: 12px;
              text-align: center;
              font-size: 12px;
              color: #777;
            ">
              This is an automated message. Please do not reply to this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
