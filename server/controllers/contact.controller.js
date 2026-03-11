import ContactMessage from "../models/contactMessage.model.js";

// Create a new contact message
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, category, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled!",
      });
    }

    // Create a new contact message in the database
    const newMessage = await ContactMessage.create({
      name,
      email,
      category,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: newMessage,
    });
  } catch (error) {
    console.error("Contact message error:", error.message);

    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};
