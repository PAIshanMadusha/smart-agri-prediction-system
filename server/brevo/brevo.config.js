import brevo from "@getbrevo/brevo";

// Initialize API client
const apiClient = brevo.ApiClient.instance;
apiClient.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

// Initialize transactional email API
const transactionalEmailApi = new brevo.TransactionalEmailsApi();

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

      return await transactionalEmailApi.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
      console.error("Brevo email error:", error.message);
      throw new Error("Email sending failed");
    }
  },
};

// Function to get email client and sender details
export const getEmailClient = () => {
  return {
    client: transactionalEmailApi,
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME || "No-Reply",
    },
  };
};
