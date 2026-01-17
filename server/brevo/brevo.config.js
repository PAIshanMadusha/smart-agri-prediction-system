import dotenv from "dotenv";

// Load environment variables from .env file
// Change the path if your .env file is located elsewhere
dotenv.config({ path: "../.env" });

import brevo from "@getbrevo/brevo";

// Initialize Brevo Transactional Emails API
const brevoClient = new brevo.TransactionalEmailsApi();

// Configure Brevo API key
brevoClient.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

// Export Brevo configuration
export const brevoConfig = {
  send: async ({ from, to, subject, htmlContent }) => {
    try {
      const sendSmtpEmail = {
        sender: from,
        to: [{ email: to }],
        subject,
        htmlContent,
      };

      return await brevoClient.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
      console.error("Brevo email error:", error.message);
      throw new Error("Email sending failed");
    }
  },
};

// Function to get email client and sender details
export const getEmailClient = () => {
  return {
    client: brevoClient,
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME || "No-Reply",
    },
  };
};
