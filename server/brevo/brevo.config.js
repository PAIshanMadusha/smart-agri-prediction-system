import brevo from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

// Initialize Brevo client
const brevoClient = new brevo.TransactionalEmailsApi();

// Set API key for authentication
brevoClient.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

// Brevo configuration for sending emails
export const brevoConfig = {
  send: async ({ from, to, subject, htmlContent }) => {
    const sendSmtpEmail = {
      sender: from,
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
    };

    return await brevoClient.sendTransacEmail(sendSmtpEmail);
  },
};
