import { getEmailClient } from "./brevo.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

// Function to send verification email
export const sendVerificationEmail = async (email, verificationToken) => {
  const { client, sender } = getEmailClient();
  const recipient = [{ email }];

  try {
    const response = await client.sendTransacEmail({
      sender,
      to: recipient,
      subject: "Verify your email!",
      htmlContent: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{VERIFICATION_TOKEN}",
        verificationToken
      ),
    });
    console.log("Verification email sent successfully!:", response);
  } catch (error) {
    console.error("Error sending verification email:", error.message);
    throw new Error("Failed to send verification email");
  }
};
