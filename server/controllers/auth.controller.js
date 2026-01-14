import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

export const login = async (req, res) => {
  res.send("Login routes");
};

export const logout = async (req, res) => {
  res.send("Logout routes");
};
