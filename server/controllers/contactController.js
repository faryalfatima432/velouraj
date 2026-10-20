import ContactMessage from "../models/ContactMessage.js";

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createContactMessage = async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const subject = typeof req.body?.subject === "string" ? req.body.subject.trim() : "";
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, email, subject, and message are required.",
    });
  }

  if (!validEmail.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid email address.",
    });
  }

  if (name.length > 100 || email.length > 254 || subject.length > 160 || message.length > 5000) {
    return res.status(400).json({
      success: false,
      message: "One or more fields exceed the allowed length.",
    });
  }

  try {
    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Thanks for reaching out. Our team will be in touch soon.",
      contactMessage,
    });
  } catch (error) {
    console.error("CREATE CONTACT MESSAGE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send your message right now.",
    });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const contactMessages = await ContactMessage.find({})
      .sort({ createdAt: -1 })
      .limit(500);

    return res.json({
      success: true,
      contactMessages,
    });
  } catch (error) {
    console.error("GET CONTACT MESSAGES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load contact messages.",
    });
  }
};

export const updateContactMessageStatus = async (req, res) => {
  const allowedStatuses = ["New", "In Progress", "Resolved"];
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Choose a valid message status.",
    });
  }

  try {
    const contactMessage = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.json({ success: true, contactMessage });
  } catch (error) {
    console.error("UPDATE CONTACT MESSAGE ERROR:", error);
    return res.status(400).json({
      success: false,
      message: "Unable to update this message.",
    });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const contactMessage = await ContactMessage.findByIdAndDelete(
      req.params.id
    );

    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.json({
      success: true,
      message: "Contact message deleted.",
    });
  } catch (error) {
    console.error("DELETE CONTACT MESSAGE ERROR:", error);
    return res.status(400).json({
      success: false,
      message: "Unable to delete this message.",
    });
  }
};
